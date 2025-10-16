import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

export class EmailHelper {
    private oauth2Client: OAuth2Client;
    private gmail: any;

    constructor() {
        // Initialize OAuth2 client
        this.oauth2Client = new google.auth.OAuth2(
            process.env.GMAIL_CLIENT_ID,
            process.env.GMAIL_CLIENT_SECRET,
            process.env.GMAIL_REDIRECT_URI
        );
        
        // Set credentials if available
        if (process.env.GMAIL_REFRESH_TOKEN) {
            this.oauth2Client.setCredentials({
                refresh_token: process.env.GMAIL_REFRESH_TOKEN
            });
        }

        this.gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
    }

    /**
     * Get verification token from email
     * @param emailAddress - Email address to check
     * @param subjectKeywordOrOptions - Keyword to search in subject OR options object
     * @param timeoutArg - Timeout in milliseconds (default: 60000) if using legacy signature
     * @returns Promise<string> - The verification token
     */
    async getVerificationToken(
        emailAddress: string,
        subjectKeywordOrOptions: string | { subjectKeyword?: string; timeout?: number; anchorTs?: number } = 'verification',
        timeoutArg: number = 60000
    ): Promise<string> {
        const { subjectKeyword, timeout, anchorTs } = ((): { subjectKeyword: string; timeout: number; anchorTs?: number } => {
            if (typeof subjectKeywordOrOptions === 'string') {
                return { subjectKeyword: subjectKeywordOrOptions || 'verification', timeout: timeoutArg ?? 60000, anchorTs: undefined };
            }
            return {
                subjectKeyword: subjectKeywordOrOptions.subjectKeyword ?? 'verification',
                timeout: subjectKeywordOrOptions.timeout ?? 60000,
                anchorTs: subjectKeywordOrOptions.anchorTs
            };
        })();

        const startTime = Date.now();
        
        while (Date.now() - startTime < timeout) {
            try {
                // Search for unread emails to the target address with subject keyword
                const response = await this.gmail.users.messages.list({
                    userId: 'me',
                    q: `to:${emailAddress} subject:${subjectKeyword} is:unread`
                });

                const messages = response.data.messages || [];
                if (messages.length > 0) {
                    // Iterate from newest to oldest
                    for (const { id: messageId } of messages) {
                        if (!messageId) continue;

                        const message = await this.gmail.users.messages.get({
                            userId: 'me',
                            id: messageId
                        });

                        const internalDateMs = message.data.internalDate ? parseInt(message.data.internalDate, 10) : 0;
                        if (anchorTs && internalDateMs <= anchorTs) {
                            // Skip emails that arrived before the anchor
                            continue;
                        }

                        // Extract token from email body
                        const token = this.extractTokenFromEmail(message.data);
                        if (token) {
                            try {
                                // Mark email as read
                                await this.gmail.users.messages.modify({
                                    userId: 'me',
                                    id: messageId,
                                    resource: { removeLabelIds: ['UNREAD'] }
                                });
                            } catch (modifyErr) {
                                // Non-fatal if lacking modify scope
                                console.log('Warning: could not modify message labels:', modifyErr);
                            }
                            return token;
                        }
                    }
                }
            } catch (error) {
                console.log('Error fetching email:', error);
            }

            // Wait 5 seconds before retrying
            await new Promise(resolve => setTimeout(resolve, 5000));
        }

        throw new Error(`No verification token found within ${timeout}ms`);
    }

    /**
     * Extract token from email message
     * @param message - Gmail message object
     * @returns string | null - Extracted token or null
     */
    private extractTokenFromEmail(message: any): string | null {
        try {
            const body = message.payload.body.data;
            if (body) {
                const decodedBody = Buffer.from(body, 'base64').toString();
                
                // Common patterns for verification tokens (EN + ID)
                const patterns = [
                    /Gunakan\s+kode\s+OTP[^\d]*?(\d{6})/i,
                    /Instruksi\s+Reset\s+Password[\s\S]*?(\d{6})/i,
                    /Reset\s+Password[\s\S]*?(\d{6})/i,
                    /kode\s+OTP[^\d]*?(\d{6})/i,
                    /verification code[:\s]+(\d{6})/i,
                    /token[:\s]+(\d{6})/i,
                    /code[:\s]+(\d{6})/i,
                    /(\d{6})/,
                    /verification code[:\s]+([A-Z0-9]{6,8})/i,
                    /token[:\s]+([A-Z0-9]{6,8})/i
                ];

                for (const pattern of patterns) {
                    const match = decodedBody.match(pattern);
                    if (match) {
                        return match[1];
                    }
                }
            }

            // Check alternative parts of the message
            if (message.payload.parts) {
                for (const part of message.payload.parts) {
                    if (part.body && part.body.data) {
                        const decodedPart = Buffer.from(part.body.data, 'base64').toString();
                        const patterns = [
                            /Gunakan\s+kode\s+OTP[^\d]*?(\d{6})/i,
                            /Instruksi\s+Reset\s+Password[\s\S]*?(\d{6})/i,
                            /Reset\s+Password[\s\S]*?(\d{6})/i,
                            /kode\s+OTP[^\d]*?(\d{6})/i,
                            /verification code[:\s]+(\d{6})/i,
                            /token[:\s]+(\d{6})/i,
                            /code[:\s]+(\d{6})/i,
                            /(\d{6})/,
                            /verification code[:\s]+([A-Z0-9]{6,8})/i,
                            /token[:\s]+([A-Z0-9]{6,8})/i
                        ];

                        for (const pattern of patterns) {
                            const match = decodedPart.match(pattern);
                            if (match) {
                                return match[1];
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.log('Error extracting token from email:', error);
        }

        return null;
    }

    /**
     * Get OAuth2 authorization URL
     * @returns string - Authorization URL
     */
    getAuthUrl(): string {
        const scopes = ['https://www.googleapis.com/auth/gmail.readonly'];
        
        return this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
        });
    }

    /**
     * Set authorization code to get refresh token
     * @param code - Authorization code from OAuth2 flow
     */
    async setAuthCode(code: string): Promise<void> {
        const { tokens } = await this.oauth2Client.getToken(code);
        this.oauth2Client.setCredentials(tokens);
        console.log('Refresh token:', tokens.refresh_token);
    }
}
