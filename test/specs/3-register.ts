import { expect } from '@wdio/globals'
import Page from '../pageobjects/page';
import { EmailHelper } from '../helpers/emailHelper';
import { ImapEmailHelper } from '../helpers/imapEmailHelper';

describe('Register application', () => {
  let page: Page;
  let emailHelper: EmailHelper | ImapEmailHelper;

  before(async () => {
    page = new Page();

    // Pilih salah satu helper berdasarkan konfigurasi
    if (process.env.GMAIL_REFRESH_TOKEN) {
      console.log('🔧 Using Gmail API for real email access');
      emailHelper = new EmailHelper();
    } else if (process.env.TEST_EMAIL_ADDRESS && process.env.TEST_EMAIL_PASSWORD) {
      console.log('🔧 Using IMAP for real email access');
      emailHelper = new ImapEmailHelper();
      await emailHelper.connect();
    } else {
      throw new Error('❌ No email credentials configured. Please set up Gmail API or IMAP credentials.');
    }
  });

  it("should register with invalid Password", async () => {
    const testEmail = "odew.odew12+1@gmail.com"; // Ganti dengan email real Anda
    const testPhone = "088905450134";
    const testPassword = "Test123";

    console.log(`📧 Using real email: ${testEmail}`);

    const noribaElement = await $('//android.widget.TextView[@content-desc="Noriba"]');

    if (await noribaElement.isDisplayed()) {
      await noribaElement.click();
      console.log('Noriba element clicked!');

      //Click button masuk
      await $('//android.widget.Button[@content-desc="Buat Akun/Masuk"]').click()

      //Click button buat akun
      await $('//android.widget.Button[@content-desc="Buat Akun"]').click()

      // Fill registration form with invalid credentials
      console.log('📝 Filling registration form...');
      await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[1]').click();
      await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[1]').setValue(testEmail);

      await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[2]').click();
      await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[2]').setValue(testPhone);

      await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[3]').click();
      await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[3]').setValue(testPassword)
      await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.ImageView[1]').click();

      await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[4]').click();
      await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[4]').setValue(testPassword);
      await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.ImageView[2]').click();

      //Click Ketentuan Layanan dan Kebijakan Privasi
      await $('//android.widget.Button[@content-desc="Ketentuan Layanan "]').click()
      await $('//android.widget.Button[@content-desc="Back"]').click()
      await $('//android.widget.Button[@content-desc="Kebijakan Privasi "]').click()
      await $('//android.widget.Button[@content-desc="Back"]').click()

      //Click Daftar
      await $('//android.widget.Button[@content-desc="Lanjut"]').click()
      await driver.pause(3000)

      // Verify error message appears for invalid password
      const passwordErrorElement = await $('//android.view.View[@content-desc="Password terdiri dari paduan huruf dan angka minimal 8 digit"]');
      await expect(passwordErrorElement).toBeDisplayed();

      // Verify the content-desc attribute contains the expected text
      const contentDesc = await passwordErrorElement.getAttribute('content-desc');
      await expect(contentDesc).toBe("Password terdiri dari paduan huruf dan angka minimal 8 digit");

    } else {
      console.log('Noriba element is not visible!');
    }
  });

  it("should register with existing email/phone", async () => {
    const testPassword = "Test123!";

    // Fill registration form with invalid credentials
    console.log('📝 Filling registration form...');

    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[3]').click();
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[3]').setValue(testPassword)
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.ImageView[1]').click();

    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[4]').click();
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[4]').setValue(testPassword);
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.ImageView[2]').click();

    //Click Daftar
    await $('//android.widget.Button[@content-desc="Lanjut"]').click()
    await driver.pause(3000)

    // Verify error message appears for invalid password
    const valueExistingElement = await $('//android.view.View[@content-desc="Nomor/Email yang anda gunakan sudah terdaftar"]');
    await expect(valueExistingElement).toBeDisplayed();

    // Verify the content-desc attribute contains the expected text
    const contentDesc = await valueExistingElement.getAttribute('content-desc');
    await expect(contentDesc).toBe("Nomor/Email yang anda gunakan sudah terdaftar");
  });

  it('should complete registration with real email verification', async () => {
    const testEmail = "odew.odew12+test1@gmail.com"; // Ganti dengan email real Anda
    const testPhone = "082339582790";

    console.log(`📧 Using real email: ${testEmail}`);

    // Navigate to registration
    const noribaElement = await $('//android.widget.TextView[@content-desc="Noriba"]');

    if (await noribaElement.isDisplayed()) {
      await noribaElement.click();
      console.log('✅ App launched successfully');

      // Navigate to registration
      await $('//android.widget.Button[@content-desc="Buat Akun/Masuk"]').click();
      await driver.pause(3000);

      await $('//android.widget.Button[@content-desc="Buat Akun"]').click();
      await driver.pause(3000);

      // Fill registration form
      console.log('📝 Filling registration form...');
      await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[1]').click();
      await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[1]').setValue(testEmail);

      await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[2]').click();
      await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[2]').setValue(testPhone);

      // Submit registration
      console.log('📤 Submitting registration...');
      await $('//android.widget.Button[@content-desc="Lanjut"]').click();

      // Wait for email verification screen
      console.log('⏳ Waiting for email verification screen...');
      const verificationScreen = await $('//android.view.View[@content-desc="Verifikasi Email"]');
      await verificationScreen.waitForDisplayed({ timeout: 20000 });

      // Get REAL verification token from email
      console.log('🔍 Monitoring real email for verification token...');
      console.log(`📬 Checking email: ${testEmail}`);
      console.log('⏱️  Timeout: 2 minutes');

      const verificationToken = await emailHelper.getVerificationToken(
        testEmail,
        'verifikasi', // atau 'verification' sesuai dengan subject email
        180000 // 2 minutes timeout
      );

      console.log(`✅ Real token extracted: ${verificationToken}`);

      // Enter verification token in the app
      console.log('⌨️  Entering real token in app...');
      const tokenInputField = await $('//android.widget.EditText');
      await tokenInputField.waitForDisplayed({ timeout: 10000 });
      await tokenInputField.click();
      await tokenInputField.setValue(verificationToken);

      // Input Kode Referral
      const popUpKodeReferral = await $('//android.view.View[@content-desc="Proses pembuatan akun berhasil, isi kode referral untuk melanjutkan"]');
      await popUpKodeReferral.waitForDisplayed({ timeout: 10000 });
      await $('//android.widget.Button[@content-desc="Input Kode Referral"]').click();

    } else {
      console.log('❌ App not launched properly');
      throw new Error('App not launched properly');
    }
  });

  after(async () => {
    if (emailHelper instanceof ImapEmailHelper) {
      await emailHelper.disconnect();
    }
    console.log('🧹 Cleanup completed');
  });
})

