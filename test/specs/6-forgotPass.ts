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

  it("Mengosongkan no handphone", async () => {
    const noribaElement = await $('//android.widget.TextView[@content-desc="Noriba"]');

    if (await noribaElement.isDisplayed()) {
      await noribaElement.click();
      console.log('Noriba element clicked!');

      //Click button masuk
      await $('//android.widget.Button[@content-desc="Buat Akun/Masuk"]').click()

      //Click Lupa Kata Sandi
      await $('//android.view.View[@content-desc="Lupa Kata Sandi?"]').click()

      //Klik button lanjut
      await $('//android.widget.Button[@content-desc="Lanjut"]').click()
      await driver.pause(3000)

      // Verify error message appears for invalid password
      const inputanKosong = await $('//android.view.View[@content-desc="Tidak boleh kosong"]');
      await expect(inputanKosong).toBeDisplayed();

      // Verify the content-desc attribute contains the expected text
      const contentDesc = await inputanKosong.getAttribute('content-desc');
      await expect(contentDesc).toBe("Tidak boleh kosong");

    } else {
      console.log('Noriba element is not visible!');
    }
  });

  it("Input nomor handphone yang tidak valid", async () => {
    const testPhone = "038905450111";

    await $('//android.widget.EditText').click();
    await $('//android.widget.EditText').setValue(testPhone);

    //Click Lanjut
    await $('//android.widget.Button[@content-desc="Lanjut"]').click()
    await driver.pause(3000)

    // Verify error message appears for invalid password
    const passwordErrorElement = await $('//android.view.View[@content-desc="No Handphone harus terdiri 10-13 digit numerik dan diawali dengan (08)"]');
    await expect(passwordErrorElement).toBeDisplayed();

    // Verify the content-desc attribute contains the expected text
    const contentDesc = await passwordErrorElement.getAttribute('content-desc');
    await expect(contentDesc).toBe("No Handphone harus terdiri 10-13 digit numerik dan diawali dengan (08)");
  });

  it("Mengosongkan field reset Password", async () => {
    const testPhone = "088905450134";

    await $('//android.widget.EditText').click();
    await $('//android.widget.EditText').setValue(testPhone);

    //Click Lanjut
    await $('//android.widget.Button[@content-desc="Lanjut"]').click()
    await driver.pause(3000)

    // Verify error message appears for invalid password
    const passwordresetElement = await $('//android.view.View[@content-desc="Lupa password berhasil, tolong cek email anda"]');
    await expect(passwordresetElement).toBeDisplayed();

    // Verify the content-desc attribute contains the expected text
    const contentDesc = await passwordresetElement.getAttribute('content-desc');
    await expect(contentDesc).toBe("Lupa password berhasil, tolong cek email anda");

    //Klik button Oke
    await $('//android.widget.Button[@content-desc="Oke"]').click()

    //Reset password
    await $('//android.widget.Button[@content-desc="Reset Password"]').click()
    await driver.pause(3000)

    // Verify error message appears for invalid password
    const emptyPasswordErrorElement = await $('(//android.view.View[@content-desc="Tidak boleh kosong"])[1]');
    await expect(emptyPasswordErrorElement).toBeDisplayed();

    // Verify the content-desc attribute contains the expected text
    const contentDesc2 = await emptyPasswordErrorElement.getAttribute('content-desc');
    await expect(contentDesc2).toBe("Tidak boleh kosong");
  });

  it("Konfirmasi password berbeda dengan password baru", async () => {
    const newPassword = "Test123!";
    const konfirmasiPassword = "Test123!%";

    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.widget.EditText[1]').click();
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.widget.EditText[1]').setValue(newPassword)
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.widget.ImageView[1]').click();

    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.widget.EditText[2]').click();
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.widget.EditText[2]').setValue(konfirmasiPassword);
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.widget.ImageView[2]').click();

    //Click Reset Password
    await $('//android.widget.Button[@content-desc="Reset Password"]').click()
    await driver.pause(3000)

    // Verify error message appears for invalid password
    const passwordErrorElement = await $('//android.view.View[@content-desc="Ulangi password anda dengan benar"]');
    await expect(passwordErrorElement).toBeDisplayed();

    // Verify the content-desc attribute contains the expected text
    const contentDesc = await passwordErrorElement.getAttribute('content-desc');
    await expect(contentDesc).toBe("Ulangi password anda dengan benar");
  });

  it("Kode OTP kosong", async () => {
    const konfirmasiPassword = "Test123!";

    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.widget.EditText[2]').click();
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.widget.EditText[2]').setValue(konfirmasiPassword);
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.widget.ImageView[2]').click();
    //Click Reset Password
    await $('//android.widget.Button[@content-desc="Reset Password"]').click()
    await driver.pause(3000)

    // Verify error message appears for invalid password
    const passwordErrorElement = await $('//android.view.View[@content-desc="OTP terdiri dari 6 digit"]');
    await expect(passwordErrorElement).toBeDisplayed();

    // Verify the content-desc attribute contains the expected text
    const contentDesc = await passwordErrorElement.getAttribute('content-desc');
    await expect(contentDesc).toBe("OTP terdiri dari 6 digit");
  });

  it("Kode OTP salah", async () => {
    const kodeOTP = "123456";

    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.widget.EditText[3]').click();
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.widget.EditText[3]').setValue(kodeOTP);
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.widget.ImageView[3]').click();

    //Click Reset Password
    await $('//android.widget.Button[@content-desc="Reset Password"]').click()
    await driver.pause(3000)

    // Verify error message appears for invalid password
    const passwordErrorElement = await $('//android.view.View[@content-desc="Kode OTP salah"]');
    await expect(passwordErrorElement).toBeDisplayed();

    // Verify the content-desc attribute contains the expected text
    const contentDesc = await passwordErrorElement.getAttribute('content-desc');
    await expect(contentDesc).toBe("Kode OTP salah");
  });

  it('Berhasil melakukan Lupa Password', async function () {
    this.timeout(480000);
    const testEmail = `odew.odew12+demo1@gmail.com`;

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

    // Enter verification token in the app
    console.log('⌨️  Entering real token in app...');
    const tokenInputField = await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.widget.EditText[3]');
    await tokenInputField.waitForDisplayed({ timeout: 10000 });
    await tokenInputField.click();
    await tokenInputField.clearValue();

    // Ambil OTP berdasar email terbaru dengan subjek Reset Password
    const tokenFetchOptions: any = { subjectKeyword: 'Reset Password', timeout: 180000 };
    if (typeof emailAnchorUid === 'number') {
      tokenFetchOptions.anchorUid = emailAnchorUid;
    }
    if (typeof emailAnchorTs === 'number') {
      tokenFetchOptions.anchorTs = emailAnchorTs;
    }
    const verificationToken = await (emailHelper as any).getVerificationToken(
      testEmail,
      tokenFetchOptions
    );

    console.log(`✅ Real token extracted: ${verificationToken}`);

    // Enter verification token in the app
    console.log('⌨️  Entering real token in app...');
    await tokenInputField.waitForDisplayed({ timeout: 10000 });
    await tokenInputField.click();
    await tokenInputField.setValue(verificationToken);
    await $('//android.widget.Button[@content-desc="Reset Password"]').click()
    await driver.pause(3000);

    // Click ke halaman Kode Referral
    const passwordResetSuccessElement = await $('//android.view.View[@content-desc="Reset password berhasil"]');
    await expect(passwordResetSuccessElement).toBeDisplayed();

    // Verify the content-desc attribute contains the expected text
    const contentDesc = await passwordResetSuccessElement.getAttribute('content-desc');
    await expect(contentDesc).toBe("Reset password berhasil");

    await $('//android.widget.Button[@content-desc="Oke"]').click();
    await page.pressBackButtonMultiple(3)
  });

  after(async () => {
    if (emailHelper instanceof ImapEmailHelper) {
      await emailHelper.disconnect();
    }
  });
})

