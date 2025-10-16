# Panduan Testing Email Verification untuk APK Android

## Overview
Dokumen ini menjelaskan cara menguji alur yang membutuhkan kode token dari email dalam testing APK Android menggunakan WebdriverIO dan Appium.

## Strategi Testing Email

### 1. Gmail API Integration (Recommended)
- **Keuntungan**: Reliable, real-time access, official Google API
- **Kekurangan**: Perlu setup OAuth2, lebih kompleks
- **Cocok untuk**: Production testing, CI/CD pipeline

### 2. IMAP Email Access
- **Keuntungan**: Lebih sederhana, langsung akses email
- **Kekurangan**: Perlu app password, mungkin ada rate limiting
- **Cocok untuk**: Development testing, manual testing

### 3. Test Email Services
- **Keuntungan**: Dedicated untuk testing, mudah setup
- **Kekurangan**: Perlu service eksternal
- **Cocok untuk**: Staging environment

## Setup Gmail API

### 1. Buat Google Cloud Project
1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Buat project baru atau pilih existing project
3. Enable Gmail API

### 2. Setup OAuth2 Credentials
1. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
2. Set application type to "Desktop application"
3. Download credentials JSON file

### 3. Get Refresh Token
```bash
# Install dependencies
npm install

# Run OAuth setup script
node scripts/setup-gmail-oauth.js
```

### 4. Environment Variables
Copy `config/email.env.example` to `config/email.env` and fill:
```env
GMAIL_CLIENT_ID=your_client_id
GMAIL_CLIENT_SECRET=your_client_secret
GMAIL_REDIRECT_URI=http://localhost:3000/oauth2callback
GMAIL_REFRESH_TOKEN=your_refresh_token
```

## Setup IMAP (Alternative)

### 1. Enable App Password
1. Go to Google Account settings
2. Security → 2-Step Verification → App passwords
3. Generate app password for "Mail"

### 2. Environment Variables
```env
TEST_EMAIL_ADDRESS=your_email@gmail.com
TEST_EMAIL_PASSWORD=your_app_password
```

## Usage Examples

### Basic Email Verification Test
```typescript
import { EmailHelper } from '../helpers/emailHelper';

describe('Email Verification', () => {
    let emailHelper: EmailHelper;

    before(async () => {
        emailHelper = new EmailHelper();
    });

    it('should verify email with token', async () => {
        // Trigger email sending in app
        await triggerEmailVerification();
        
        // Get token from email
        const token = await emailHelper.getVerificationToken(
            'test@example.com',
            'verification',
            60000 // 1 minute timeout
        );
        
        // Enter token in app
        await enterVerificationToken(token);
        
        // Verify success
        await expect(successMessage).toBeDisplayed();
    });
});
```

### Using IMAP Helper
```typescript
import { ImapEmailHelper } from '../helpers/imapEmailHelper';

describe('Email Verification with IMAP', () => {
    let emailHelper: ImapEmailHelper;

    before(async () => {
        emailHelper = new ImapEmailHelper();
        await emailHelper.connect();
    });

    after(async () => {
        await emailHelper.disconnect();
    });

    it('should get verification token via IMAP', async () => {
        const token = await emailHelper.getVerificationToken(
            'test@example.com',
            'verifikasi',
            120000
        );
        
        console.log('Token received:', token);
    });
});
```

## Best Practices

### 1. Email Management
- Gunakan email khusus untuk testing
- Clean up emails setelah testing
- Gunakan unique email addresses untuk setiap test

### 2. Token Extraction
- Support multiple token formats (6-digit, alphanumeric)
- Handle different languages (English/Indonesian)
- Implement retry mechanism

### 3. Error Handling
- Handle network timeouts
- Handle email service unavailability
- Provide meaningful error messages

### 4. Test Data
- Use consistent test email addresses
- Implement email cleanup between tests
- Use environment-specific email accounts

## Common Issues & Solutions

### 1. Gmail API Quota Exceeded
**Problem**: Too many API calls
**Solution**: Implement caching, use batch requests

### 2. IMAP Connection Failed
**Problem**: App password not working
**Solution**: Regenerate app password, check 2FA settings

### 3. Token Not Found
**Problem**: Email format different than expected
**Solution**: Update regex patterns, check email content

### 4. Timeout Issues
**Problem**: Email delivery delay
**Solution**: Increase timeout, implement retry logic

## Test Scenarios

### 1. Happy Path
- Register with valid email
- Receive verification email
- Extract token successfully
- Complete verification

### 2. Error Scenarios
- Invalid email format
- Email delivery failure
- Token expiration
- Network timeout

### 3. Edge Cases
- Multiple verification attempts
- Resend verification email
- Different email providers
- International email addresses

## Monitoring & Debugging

### 1. Logging
```typescript
// Enable detailed logging
console.log('Waiting for email...');
console.log('Token extracted:', token);
console.log('Email content:', emailBody);
```

### 2. Screenshots
```typescript
// Take screenshot on failure
await driver.saveScreenshot('./screenshots/email-verification-failed.png');
```

### 3. Email Content Debugging
```typescript
// Log email content for debugging
console.log('Email subject:', email.subject);
console.log('Email body:', email.text);
```

## CI/CD Integration

### 1. Environment Setup
- Set environment variables in CI
- Use service accounts for Gmail API
- Configure email credentials securely

### 2. Test Execution
- Run email tests in dedicated environment
- Implement proper cleanup
- Handle test failures gracefully

### 3. Reporting
- Include email verification in test reports
- Track email delivery metrics
- Monitor API usage

## Security Considerations

### 1. Credentials Management
- Never commit credentials to repository
- Use environment variables
- Rotate credentials regularly

### 2. Email Privacy
- Use dedicated test email accounts
- Clean up test emails
- Respect email service terms

### 3. API Security
- Use least privilege principle
- Monitor API usage
- Implement rate limiting

## Troubleshooting

### Common Commands
```bash
# Install dependencies
npm install

# Run specific test
npm test -- --spec test/specs/5-email-verification.ts

# Run with debug
DEBUG=* npm test

# Check email connectivity
node scripts/test-email-connection.js
```

### Debug Checklist
- [ ] Environment variables set correctly
- [ ] Email service credentials valid
- [ ] Network connectivity to email service
- [ ] App permissions for email access
- [ ] Test email account accessible
- [ ] Token extraction patterns correct
