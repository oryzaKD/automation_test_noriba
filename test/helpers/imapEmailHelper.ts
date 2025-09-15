import Imap from 'imap';
import { simpleParser } from 'mailparser';

export class ImapEmailHelper {
    private imap: any;

    constructor() {
        const options: any = {
            user: process.env.TEST_EMAIL_ADDRESS || '',
            password: process.env.TEST_EMAIL_PASSWORD || '',
            host: 'imap.gmail.com',
            port: 993,
            tls: true,
            tlsOptions: { rejectUnauthorized: false }
        };

        // Optional verbose IMAP protocol logging
        if (process.env.DEBUG_IMAP === '1') {
            options.debug = console.log;
        }

        this.imap = new Imap(options);
    }

    /**
     * Get verification token from email using IMAP
     * @param emailAddress - Email address to check
     * @param subjectKeyword - Keyword to search in email subject
     * @param timeout - Timeout in milliseconds (default: 60000)
     * @returns Promise<string> - The verification token
     */
    async getVerificationToken(
        emailAddress: string,
        subjectKeyword: string = 'verification',
        timeout: number = 60000
    ): Promise<string> {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            let tokenFound = false;

            this.imap.once('ready', () => {
                const checkForToken = () => {
                    if (tokenFound) return;

                    this.imap.openBox('INBOX', false, (err: unknown, box: any) => {
                        if (err) {
                            console.log('Error opening inbox:', err);
                            setTimeout(checkForToken, 5000);
                            return;
                        }

                        // Search for unread emails with specific subject
                        const searchCriteria = [
                            'UNSEEN',
                            ['TO', emailAddress],
                            ['SUBJECT', subjectKeyword]
                        ];

                        this.imap.search(searchCriteria, (err: unknown, results: any[]) => {
                            if (err) {
                                console.log('Search error:', err);
                                setTimeout(checkForToken, 5000);
                                return;
                            }

                            if (results.length === 0) {
                                // No emails found, check if timeout reached
                                if (Date.now() - startTime > timeout) {
                                    this.imap.end();
                                    reject(new Error(`No verification token found within ${timeout}ms`));
                                    return;
                                }
                                setTimeout(checkForToken, 5000);
                                return;
                            }

                            // Get the latest email
                            const fetch = this.imap.fetch(results[results.length - 1], {
                                bodies: '',
                                markSeen: true
                            });

                            fetch.on('message', (msg: any) => {
                                msg.on('body', (stream: NodeJS.ReadableStream) => {
                                    simpleParser(stream, (err: unknown, parsed: any) => {
                                        if (err) {
                                            console.log('Parse error:', err);
                                            return;
                                        }

                                        const token = this.extractTokenFromEmailBody(parsed.text || parsed.html || '');
                                        if (token) {
                                            tokenFound = true;
                                            this.imap.end();
                                            resolve(token);
                                        }
                                    });
                                });
                            });

                            fetch.once('error', (err: unknown) => {
                                console.log('Fetch error:', err);
                                setTimeout(checkForToken, 5000);
                            });

                            fetch.once('end', () => {
                                if (!tokenFound) {
                                    setTimeout(checkForToken, 5000);
                                }
                            });
                        });
                    });
                };

                checkForToken();
            });

            this.imap.once('error', (err: any) => {
                console.log('IMAP connection error:', err);
                reject(err);
            });

            this.imap.once('end', () => {
                console.log('IMAP connection ended');
            });

            this.imap.connect();
        });
    }

    /**
     * Extract token from email body
     * @param emailBody - Email body content
     * @returns string | null - Extracted token or null
     */
    private extractTokenFromEmailBody(emailBody: string): string | null {
        // Common patterns for verification tokens
        const patterns = [
            /verification code[:\s]+(\d{6})/i,
            /token[:\s]+(\d{6})/i,
            /code[:\s]+(\d{6})/i,
            /(\d{6})/,
            /verification code[:\s]+([A-Z0-9]{6,8})/i,
            /token[:\s]+([A-Z0-9]{6,8})/i,
            /kode verifikasi[:\s]+(\d{6})/i,
            /kode[:\s]+(\d{6})/i
        ];

        for (const pattern of patterns) {
            const match = emailBody.match(pattern);
            if (match) {
                return match[1];
            }
        }

        return null;
    }

    /**
     * Connect to IMAP server
     */
    async connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.imap.once('ready', () => {
                console.log('IMAP connected successfully');
                resolve();
            });

            this.imap.once('error', (err: any) => {
                console.log('IMAP connection error:', err);
                reject(err);
            });

            this.imap.connect();
        });
    }

    /**
     * Disconnect from IMAP server
     */
    async disconnect(): Promise<void> {
        return new Promise((resolve) => {
            this.imap.end();
            this.imap.once('end', () => {
                console.log('IMAP disconnected');
                resolve();
            });
        });
    }
}
