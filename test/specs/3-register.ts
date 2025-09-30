import { expect } from '@wdio/globals'
import Page from '../pageobjects/page';
import { EmailHelper } from '../helpers/emailHelper';
import { ImapEmailHelper } from '../helpers/imapEmailHelper';
import { nextSequence } from '../helpers/counter';

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

  it("Registrasi dengan inputan kosong", async () => {
    const noribaElement = await $('//android.widget.TextView[@content-desc="Noriba"]');

    if (await noribaElement.isDisplayed()) {
      await noribaElement.click();
      console.log('Noriba element clicked!');

      //Click button masuk
      await $('//android.widget.Button[@content-desc="Buat Akun/Masuk"]').click()

      //Click button buat akun
      await $('//android.widget.Button[@content-desc="Buat Akun"]').click()

      //Click Ketentuan Layanan dan Kebijakan Privasi
      await $('//android.widget.Button[@content-desc="Ketentuan Layanan "]').click()
      await $('//android.widget.Button[@content-desc="Back"]').click()
      await $('//android.widget.Button[@content-desc="Kebijakan Privasi "]').click()
      await $('//android.widget.Button[@content-desc="Back"]').click()

      //Click Daftar
      await $('//android.widget.Button[@content-desc="Lanjut"]').click()
      await driver.pause(3000)

      // Verify error message appears for invalid password
      const inputanKosong = await $('(//android.view.View[@content-desc="Tidak boleh kosong"])[1]');
      await expect(inputanKosong).toBeDisplayed();

      // Verify the content-desc attribute contains the expected text
      const contentDesc = await inputanKosong.getAttribute('content-desc');
      await expect(contentDesc).toBe("Tidak boleh kosong");

    } else {
      console.log('Noriba element is not visible!');
    }
  });

  it("Registrasi dengan format Email tidak sesuai", async () => {
    const testEmail = "test.id"; // Ganti dengan email real Anda
    const testPhone = "088905450134";
    const testPassword = "Test123!";

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

    //Click Daftar
    await $('//android.widget.Button[@content-desc="Lanjut"]').click()
    await driver.pause(3000)

    // Verify error message appears for invalid password
    const passwordErrorElement = await $('//android.view.View[@content-desc="Email tidak valid"]');
    await expect(passwordErrorElement).toBeDisplayed();

    // Verify the content-desc attribute contains the expected text
    const contentDesc = await passwordErrorElement.getAttribute('content-desc');
    await expect(contentDesc).toBe("Email tidak valid");
  });

  it("Registrasi dengan format No HP tidak sesuai", async () => {
    const testEmail = "odew.odew12+1@gmail.com"; // Ganti dengan email real Anda
    const testPhone = "test088905450134";

    // Fill registration form with invalid credentials
    console.log('📝 Filling registration form...');
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[1]').click();
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[1]').setValue(testEmail);

    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[2]').click();
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[2]').setValue(testPhone);

    //Click Daftar
    await $('//android.widget.Button[@content-desc="Lanjut"]').click()
    await driver.pause(3000)

    // Verify error message appears for invalid password
    const passwordErrorElement = await $('//android.view.View[@content-desc="No Handphone harus terdiri 10-13 digit numerik dan diawali dengan (08)"]');
    await expect(passwordErrorElement).toBeDisplayed();

    // Verify the content-desc attribute contains the expected text
    const contentDesc = await passwordErrorElement.getAttribute('content-desc');
    await expect(contentDesc).toBe("No Handphone harus terdiri 10-13 digit numerik dan diawali dengan (08)");
  });

  it("Registrasi dengan format Password tidak sesuai", async () => {
    const testPhone = "088905450134";
    const testPassword = "Test123";

    // Fill registration form with invalid credentials
    console.log('📝 Filling registration form...');

    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[2]').click();
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[2]').setValue(testPhone);

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
    const passwordErrorElement = await $('//android.view.View[@content-desc="Password terdiri dari paduan huruf dan angka minimal 8 digit"]');
    await expect(passwordErrorElement).toBeDisplayed();

    // Verify the content-desc attribute contains the expected text
    const contentDesc = await passwordErrorElement.getAttribute('content-desc');
    await expect(contentDesc).toBe("Password terdiri dari paduan huruf dan angka minimal 8 digit");
  });

  it("Registrasi dengan Konfirmasi Password tidak sesuai", async () => {
    // const testEmail = "odew.odew12+1@gmail.com"; // Ganti dengan email real Anda
    const testPassword = "Test123!";
    const testPasswordConfirm = "Test123!%";

    // Fill registration form with invalid credentials
    console.log('📝 Filling registration form...');
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[3]').click();
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[3]').setValue(testPassword)
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.ImageView[1]').click();

    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[4]').click();
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[4]').setValue(testPasswordConfirm);
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.ImageView[2]').click();

    //Click Daftar
    await $('//android.widget.Button[@content-desc="Lanjut"]').click()
    await driver.pause(3000)

    // Verify error message appears for invalid password
    const passwordErrorElement = await $('//android.view.View[@content-desc="Ulangi password anda dengan benar"]');
    await expect(passwordErrorElement).toBeDisplayed();

    // Verify the content-desc attribute contains the expected text
    const contentDesc = await passwordErrorElement.getAttribute('content-desc');
    await expect(contentDesc).toBe("Ulangi password anda dengan benar");
  });

  it("Registrasi dengan nomor telepon/email terdaftar", async () => {
    const testPassword = "Test123!";

    // Fill registration form with invalid credentials
    console.log('📝 Filling registration form...');
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

  it('Validasi Kode OTP', async function () {
    this.timeout(480000);
    const seq = nextSequence('register');
    const testEmail = `odew.odew12+test${seq}@gmail.com`;
    // const phoneSuffix = ((seq % 900) + 100).toString(); // 3 digits 100-999
    const testPhone = `08311111111${seq}`; // total 13 digits, starts with 08
    const wrongOTP = "123456";

    // Fill registration form
    console.log('📝 Filling registration form...');
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[1]').click();
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[1]').setValue(testEmail);

    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[2]').click();
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[2]').setValue(testPhone);

    // Ambil anchor email sebelum mengirim OTP agar hanya membaca email terbaru
    let emailAnchorUid: number | undefined;
    let emailAnchorTs: number | undefined;
    if (emailHelper instanceof ImapEmailHelper) {
      try {
        emailAnchorUid = await emailHelper.getNextUid();
      } catch (e) {
        console.log('Tidak bisa mendapatkan IMAP UID anchor, melanjutkan tanpa anchor:', e);
      }
    } else {
      emailAnchorTs = Date.now();
    }

    // Klik Lanjut
    await $('//android.widget.Button[@content-desc="Lanjut"]').click();

    // Wait for email verification screen
    console.log('⏳ Waiting for email verification screen...');
    const verificationScreen = await $('//android.view.View[@content-desc="Verifikasi Email"]');
    await verificationScreen.waitForDisplayed({ timeout: 20000 });

    // Enter verification token in the app
    console.log('⌨️  Entering real token in app...');
    const tokenInputField = await $('//android.widget.EditText');
    await tokenInputField.waitForDisplayed({ timeout: 10000 });
    await tokenInputField.click();
    await tokenInputField.setValue(wrongOTP);

    await driver.pause(120000);

    // Ambil OTP yang dikirim saat ini, lalu tunggu 2 menit agar kadaluarsa
    console.log('🔍 Mengambil OTP dari email untuk uji kadaluarsa...');
    const tokenFetchOptions: any = { subjectKeyword: 'Kode Verifikasi Noriba', timeout: 100000 };
    if (typeof emailAnchorUid === 'number') {
      tokenFetchOptions.anchorUid = emailAnchorUid;
    }
    if (typeof emailAnchorTs === 'number') {
      tokenFetchOptions.anchorTs = emailAnchorTs;
    }
    const issuedTokenForExpiry = await emailHelper.getVerificationToken(testEmail, tokenFetchOptions);
    console.log(`📩 OTP diterima: ${issuedTokenForExpiry}. Menunggu hingga tombol Kirim ulang aktif (indikasi kadaluarsa)...`);

    // Coba masukkan OTP yang sudah kadaluarsa dan pastikan muncul error kadaluarsa
    console.log('⌨️  Memasukkan OTP yang sudah kadaluarsa...');
    await $('//android.widget.EditText').clearValue();
    await tokenInputField.waitForDisplayed({ timeout: 10000 });
    await tokenInputField.click();
    await tokenInputField.setValue(issuedTokenForExpiry);
    await tokenInputField.clearValue();

    // //Resend OTP
    await $('//android.view.View[@content-desc="Kirim ulang"]').click();
    await tokenInputField.clearValue();

    const verificationToken = await emailHelper.getVerificationToken(
      testEmail,
      'verifikasi', // atau 'verification' sesuai dengan subject email
      180000 // 2 minutes timeout
    );

    console.log(`✅ Real token extracted: ${verificationToken}`);

    // Enter verification token in the app
    console.log('⌨️  Entering real token in app...');
    await tokenInputField.waitForDisplayed({ timeout: 10000 });
    await tokenInputField.click();
    await tokenInputField.setValue(verificationToken);
    await driver.pause(3000);

    // Click ke halaman Kode Referral
    const popUpKodeReferral = await $('//android.view.View[@content-desc="Proses pembuatan akun berhasil, isi kode referral untuk melanjutkan"]');
    await popUpKodeReferral.waitForDisplayed({ timeout: 10000 });
    await $('//android.widget.Button[@content-desc="Input Kode Referral"]').click();
    await driver.pause(3000);
  });

  it('Kode Referral kosong', async () => {
    await $('//android.widget.Button[@content-desc="Kirim"]').click();
    await driver.pause(3000);

    const emptyReferralCodeErrorElement = await $('//android.view.View[@content-desc="Kode referral tidak boleh kosong"]');
    await expect(emptyReferralCodeErrorElement).toBeDisplayed();

    const contentDesc = await emptyReferralCodeErrorElement.getAttribute('content-desc');
    await expect(contentDesc).toBe("Kode referral tidak boleh kosong");
  });

  it('Kode Referral Salah', async () => {
    const wrongReferralCode = "tes2";

    await $('//android.widget.EditText').click();
    await $('//android.widget.EditText').setValue(wrongReferralCode);
    await $('//android.widget.Button[@content-desc="Kirim"]').click();
    await driver.pause(3000);

    const wrongReferralCodeErrorElement = await $('//android.view.View[@content-desc="Kode referral tidak sesuai"]');
    await expect(wrongReferralCodeErrorElement).toBeDisplayed();

    const contentDesc = await wrongReferralCodeErrorElement.getAttribute('content-desc');
    await expect(contentDesc).toBe("Kode referral tidak sesuai");
  });

  it('Kode Referral Benar', async () => {
    const correctReferralCode = "tes1";
    // Input Kode Referral benar
    await $('//android.widget.EditText').click();
    await $('//android.widget.EditText').setValue(correctReferralCode);
    await $('//android.widget.Button[@content-desc="Kirim"]').click();
    await driver.pause(5000);
  });

  it('Aktifkan Notifikasi', async () => {
    await driver.pause(3000);
    await $('//android.widget.Button[@content-desc="Izinkan"]').click();
    await driver.pause(3000);

    //Sukses Register
    const elementSuccess = await $('//android.view.View[@content-desc="Kenapa Noriba Powered by Speedpay ?"]');
    await expect(elementSuccess).toBeDisplayed();

    const contentDesc = await elementSuccess.getAttribute('content-desc');
    await expect(contentDesc).toBe("Kenapa Noriba Powered by Speedpay ?");
    await driver.pause(3000)
  });

  it('logout', async () => {
    const profileTab = await $('//android.widget.ImageView[@content-desc="Profile\nTab 4 of 4"]');
    await profileTab.waitForDisplayed({ timeout: 10000 });
    await profileTab.click();
    await driver.pause(2000)
    await $('//android.widget.Button[@content-desc="Keluar"]').click()
    await page.pressBackButtonMultiple(1)
  });

  after(async () => {
    if (emailHelper instanceof ImapEmailHelper) {
      await emailHelper.disconnect();
    }
    console.log('🧹 Cleanup completed');
  });
})

