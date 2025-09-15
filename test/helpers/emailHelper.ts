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
     * @param subjectKeyword - Keyword to search in email subject
     * @param timeout - Timeout in milliseconds (default: 60000)
     * @returns Promise<string> - The verification token
     */
    async getVerificationToken(
        emailAddress: string, 
        subjectKeyword: string = 'verification',
        timeout: number = 60000
    ): Promise<string> {
        const startTime = Date.now();
        
        while (Date.now() - startTime < timeout) {
            try {
                // Search for emails
                const response = await this.gmail.users.messages.list({
                    userId: 'me',
                    q: `to:${emailAddress} subject:${subjectKeyword} is:unread`
                });

                if (response.data.messages && response.data.messages.length > 0) {
                    // Get the latest email
                    const messageId = response.data.messages[0].id;
                    const message = await this.gmail.users.messages.get({
                        userId: 'me',
                        id: messageId
                    });

                    // Extract token from email body
                    const token = this.extractTokenFromEmail(message.data);
                    if (token) {
                        // Mark email as read
                        await this.gmail.users.messages.modify({
                            userId: 'me',
                            id: messageId,
                            resource: { removeLabelIds: ['UNREAD'] }
                        });
                        return token;
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
                
                // Common patterns for verification tokens
                const patterns = [
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
