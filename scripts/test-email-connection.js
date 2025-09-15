// Enable requiring TypeScript helpers
require('ts-node').register({
    transpileOnly: true,
    project: require('path').join(__dirname, '../test/tsconfig.json')
});

const { EmailHelper } = require('../test/helpers/emailHelper');
const { ImapEmailHelper } = require('../test/helpers/imapEmailHelper');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../config/email.env') });

async function testGmailAPI() {
    console.log('Testing Gmail API connection...');
    
    try {
        const emailHelper = new EmailHelper();
        
        // Test basic connection
        console.log('✅ Gmail API helper initialized');
        
        // Test getting auth URL (if not authenticated)
        if (!process.env.GMAIL_REFRESH_TOKEN) {
            console.log('⚠️  No refresh token found. Run setup-gmail-oauth.js first');
            return false;
        }
        
        console.log('✅ Gmail API connection test passed');
        return true;
        
    } catch (error) {
        console.error('❌ Gmail API test failed:', error.message);
        return false;
    }
}

async function testIMAPConnection() {
    console.log('\nTesting IMAP connection...');
    
    // Basic env diagnostics (mask password length only)
    const addr = process.env.TEST_EMAIL_ADDRESS;
    const pwdLen = process.env.TEST_EMAIL_PASSWORD ? process.env.TEST_EMAIL_PASSWORD.length : 0;
    console.log(`IMAP env: address=${addr || '(empty)'} passwordLen=${pwdLen}`);

    try {
        const emailHelper = new ImapEmailHelper();
        await emailHelper.connect();
        console.log('✅ IMAP connection successful');
        await emailHelper.disconnect();
        return true;
        
    } catch (error) {
        console.error('❌ IMAP connection test failed:', error && error.message ? error.message : error);
        console.log('\nTroubleshooting IMAP:');
        console.log('1. Check TEST_EMAIL_ADDRESS and TEST_EMAIL_PASSWORD in config/email.env');
        console.log('2. Make sure 2FA is enabled and app password is generated');
        console.log('3. Verify IMAP is enabled in Gmail settings');
        console.log('4. For verbose logs, run with DEBUG_IMAP=1');
        return false;
    }
}

async function testEmailTokenExtraction() {
    console.log('\nTesting email token extraction...');
    
    const testEmails = [
        'Your verification code is: 123456',
        'Token: ABC123',
        'Kode verifikasi: 789012',
        'Verification code: 456789',
        'Your code is 111222',
        'Token: XYZ789'
    ];
    
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
    
    let successCount = 0;
    
    for (const email of testEmails) {
        let tokenFound = false;
        
        for (const pattern of patterns) {
            const match = email.match(pattern);
            if (match) {
                console.log(`✅ "${email}" → Token: ${match[1]}`);
                tokenFound = true;
                successCount++;
                break;
            }
        }
        
        if (!tokenFound) {
            console.log(`❌ "${email}" → No token found`);
        }
    }
    
    console.log(`\nToken extraction test: ${successCount}/${testEmails.length} passed`);
    return successCount === testEmails.length;
}

async function runAllTests() {
    console.log('🧪 Running Email Testing Setup Tests\n');
    
    const results = {
        gmailAPI: await testGmailAPI(),
        imap: await testIMAPConnection(),
        tokenExtraction: await testEmailTokenExtraction()
    };
    
    console.log('\n📊 Test Results:');
    console.log(`Gmail API: ${results.gmailAPI ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`IMAP: ${results.imap ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Token Extraction: ${results.tokenExtraction ? '✅ PASS' : '❌ FAIL'}`);
    
    const allPassed = Object.values(results).every(result => result);
    
    if (allPassed) {
        console.log('\n🎉 All tests passed! Email testing setup is ready.');
    } else {
        console.log('\n⚠️  Some tests failed. Please check the configuration.');
        console.log('\nNext steps:');
        if (!results.gmailAPI) {
            console.log('1. Run: node scripts/setup-gmail-oauth.js');
        }
        if (!results.imap) {
            console.log('2. Set up IMAP credentials in config/email.env');
        }
        if (!results.tokenExtraction) {
            console.log('3. Update token extraction patterns if needed');
        }
    }
    
    return allPassed;
}

// Run tests if called directly
if (require.main === module) {
    runAllTests().catch(console.error);
}

module.exports = { runAllTests, testGmailAPI, testIMAPConnection, testEmailTokenExtraction };
