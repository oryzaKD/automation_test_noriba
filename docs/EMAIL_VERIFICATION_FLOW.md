# Alur Pengujian Email Verifikasi

## Overview
Dokumen ini menjelaskan alur lengkap pengujian email verifikasi dalam testing APK Android menggunakan WebdriverIO dan Appium.

## Diagram Alur Pengujian

```
┌─────────────────────────────────────────────────────────────────┐
│                    ALUR PENGUJIAN EMAIL VERIFIKASI              │
└─────────────────────────────────────────────────────────────────┘

1. PREPARATION PHASE
   ┌─────────────────┐
   │ Setup Test Data │
   │ - Email Address │
   │ - Phone Number  │
   │ - Password      │
   └─────────────────┘
           │
           ▼
   ┌─────────────────┐
   │ Initialize      │
   │ Email Helper    │
   │ (Gmail/IMAP/    │
   │  Mock)          │
   └─────────────────┘

2. APP INTERACTION PHASE
           │
           ▼
   ┌─────────────────┐
   │ Launch App      │
   │ & Navigate to   │
   │ Registration    │
   └─────────────────┘
           │
           ▼
   ┌─────────────────┐
   │ Fill Registration│
   │ Form:           │
   │ - Email         │
   │ - Phone         │
   │ - Password      │
   │ - Confirm Pass  │
   └─────────────────┘
           │
           ▼
   ┌─────────────────┐
   │ Click "Daftar"  │
   │ Button          │
   └─────────────────┘
           │
           ▼
   ┌─────────────────┐
   │ App Sends       │
   │ Verification    │
   │ Email           │
   └─────────────────┘

3. EMAIL PROCESSING PHASE
           │
           ▼
   ┌─────────────────┐
   │ Email Helper    │
   │ Monitors Email  │
   │ Inbox           │
   └─────────────────┘
           │
           ▼
   ┌─────────────────┐
   │ Wait for Email  │
   │ (with timeout)  │
   └─────────────────┘
           │
           ▼
   ┌─────────────────┐
   │ Extract Token   │
   │ from Email      │
   │ Body/Subject    │
   └─────────────────┘
           │
           ▼
   ┌─────────────────┐
   │ Return Token    │
   │ to Test         │
   └─────────────────┘

4. VERIFICATION PHASE
           │
           ▼
   ┌─────────────────┐
   │ Navigate to     │
   │ Verification    │
   │ Screen          │
   └─────────────────┘
           │
           ▼
   ┌─────────────────┐
   │ Enter Token in  │
   │ Input Field     │
   └─────────────────┘
           │
           ▼
   ┌─────────────────┐
   │ Click Submit/   │
   │ Verify Button   │
   └─────────────────┘
           │
           ▼
   ┌─────────────────┐
   │ Verify Success  │
   │ Message/State   │
   └─────────────────┘

5. CLEANUP PHASE
           │
           ▼
   ┌─────────────────┐
   │ Clean Up        │
   │ - Close Email   │
   │   Connection    │
   │ - Reset Mock    │
   │   Data          │
   └─────────────────┘
```

## Detail Alur Step-by-Step

### 1. **Preparation Phase (Setup)**

```typescript
before(async () => {
    page = new Page();
    emailHelper = new EmailHelper(); // atau SimpleEmailHelper()
});
```

**Yang dilakukan:**
- Inisialisasi WebdriverIO page object
- Setup email helper (Gmail API, IMAP, atau Mock)
- Konfigurasi test data (email, phone, password)

### 2. **App Interaction Phase**

#### Step 2.1: Launch & Navigate
```typescript
const noribaElement = await $('//android.widget.TextView[@content-desc="Noriba"]');
await noribaElement.click();
await $('//android.widget.Button[@content-desc="Buat Akun/Masuk"]').click();
await $('//android.widget.Button[@content-desc="Buat Akun"]').click();
```

#### Step 2.2: Fill Registration Form
```typescript
// Email field
await $('//android.widget.EditText[1]').setValue("test@example.com");

// Phone field  
await $('//android.widget.EditText[2]').setValue("088905450134");

// Password field
await $('//android.widget.EditText[3]').setValue("Test123!");

// Confirm password
await $('//android.widget.EditText[4]').setValue("Test123!");
```

#### Step 2.3: Submit Registration
```typescript
await $('//android.widget.Button[@content-desc="Lanjut"]').click();
```

**Hasil:** App mengirim email verifikasi ke alamat email yang diisi.

### 3. **Email Processing Phase**

#### Step 3.1: Monitor Email Inbox
```typescript
const verificationToken = await emailHelper.getVerificationToken(
    'test@example.com',    // email address
    'verifikasi',          // subject keyword
    60000                  // timeout 60 detik
);
```

**Proses di Email Helper:**

**Gmail API Version:**
```typescript
// 1. Connect to Gmail API
const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

// 2. Search for unread emails
const response = await gmail.users.messages.list({
    userId: 'me',
    q: `to:${emailAddress} subject:${subjectKeyword} is:unread`
});

// 3. Get email content
const message = await gmail.users.messages.get({
    userId: 'me',
    id: messageId
});

// 4. Extract token from email body
const token = this.extractTokenFromEmail(message.data);
```

**IMAP Version:**
```typescript
// 1. Connect to IMAP server
this.imap.connect();

// 2. Open inbox
this.imap.openBox('INBOX', false);

// 3. Search for emails
const searchCriteria = [
    'UNSEEN',
    ['FROM', emailAddress],
    ['SUBJECT', subjectKeyword]
];

// 4. Fetch and parse email
const fetch = this.imap.fetch(messageId, { bodies: '' });
```

**Mock Version:**
```typescript
// 1. Simulate email delivery delay
await new Promise(resolve => setTimeout(resolve, delay));

// 2. Return pre-configured token
return this.mockTokens.get(emailAddress);
```

#### Step 3.2: Token Extraction
```typescript
private extractTokenFromEmail(emailBody: string): string | null {
    const patterns = [
        /verification code[:\s]+(\d{6})/i,
        /token[:\s]+(\d{6})/i,
        /kode verifikasi[:\s]+(\d{6})/i,
        /(\d{6})/  // fallback untuk 6 digit
    ];

    for (const pattern of patterns) {
        const match = emailBody.match(pattern);
        if (match) return match[1];
    }
    return null;
}
```

### 4. **Verification Phase**

#### Step 4.1: Navigate to Verification Screen
```typescript
const verificationScreen = await $('//android.view.View[@content-desc*="verifikasi"]');
await verificationScreen.waitForDisplayed({ timeout: 10000 });
```

#### Step 4.2: Enter Token
```typescript
const tokenInputField = await $('//android.widget.EditText[@hint*="kode"]');
await tokenInputField.click();
await tokenInputField.setValue(verificationToken);
```

#### Step 4.3: Submit Verification
```typescript
const submitButton = await $('//android.widget.Button[@content-desc*="verifikasi"]');
await submitButton.click();
```

#### Step 4.4: Verify Success
```typescript
const successMessage = await $('//android.view.View[@content-desc*="berhasil"]');
await expect(successMessage).toBeDisplayed();
```

### 5. **Cleanup Phase**

```typescript
after(async () => {
    await emailHelper.disconnect(); // untuk IMAP/Gmail API
    emailHelper.clearMockTokens();  // untuk Mock
});
```

## Variasi Alur Berdasarkan Email Helper

### **Gmail API Flow:**
1. OAuth2 authentication
2. Gmail API calls
3. Real-time email monitoring
4. Automatic token extraction

### **IMAP Flow:**
1. Direct IMAP connection
2. Email folder monitoring
3. Manual email parsing
4. Token pattern matching

### **Mock Flow:**
1. Pre-configured tokens
2. Simulated delays
3. No real email access
4. Perfect for development

## Error Handling dalam Alur

### **Timeout Handling:**
```typescript
try {
    const token = await emailHelper.getVerificationToken(email, subject, 10000);
} catch (error) {
    if (error.message.includes('No verification token found')) {
        // Handle timeout scenario
        console.log('Email not received within timeout period');
    }
}
```

### **Network Error Handling:**
```typescript
try {
    await emailHelper.connect();
} catch (error) {
    console.log('Email service unavailable, using fallback');
    // Switch to mock or retry
}
```

### **Token Extraction Failure:**
```typescript
const token = this.extractTokenFromEmail(emailBody);
if (!token) {
    throw new Error('Unable to extract token from email');
}
```

## Best Practices dalam Alur

### **1. Timeout Management:**
- Set reasonable timeouts (30-120 detik)
- Implement retry mechanism
- Handle network delays

### **2. Token Pattern Matching:**
- Support multiple formats
- Handle different languages
- Use fallback patterns

### **3. Error Recovery:**
- Graceful degradation
- Fallback to mock data
- Clear error messages

### **4. Test Data Management:**
- Use unique email addresses
- Clean up after tests
- Avoid conflicts between tests

## Monitoring & Debugging

### **Logging Points:**
```typescript
console.log('🔍 Looking for verification email...');
console.log('📧 Email found, extracting token...');
console.log('✅ Token extracted:', token);
console.log('📱 Entering token in app...');
console.log('🎉 Verification successful!');
```

### **Screenshot on Failure:**
```typescript
try {
    await expect(successMessage).toBeDisplayed();
} catch (error) {
    await driver.saveScreenshot('./screenshots/verification-failed.png');
    throw error;
}
```

## Performance Considerations

### **Email Monitoring:**
- Polling interval: 5 detik
- Maximum timeout: 120 detik
- Connection pooling untuk IMAP

### **Token Extraction:**
- Regex optimization
- Caching parsed patterns
- Early exit on match

### **App Interaction:**
- Wait for elements properly
- Use explicit waits
- Minimize unnecessary delays

Alur ini memastikan testing email verifikasi berjalan dengan reliable, maintainable, dan dapat di-debug dengan mudah.
