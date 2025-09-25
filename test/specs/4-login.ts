import { expect } from '@wdio/globals'
import Page from '../pageobjects/page';

describe('My Login application', () => {
  let page: Page

  before(async () => {
    page = new Page()
  })

  it("login dengan data kosong", async () => {
    const noribaElement = await $('//android.widget.TextView[@content-desc="Noriba"]');
    const noHp = "";
    const password = "";

    if (await noribaElement.isDisplayed()) {
      await noribaElement.click();
      console.log('Noriba element clicked!');
      await driver.pause(3000)

      //Click button masuk
      await $('//android.widget.Button[@content-desc="Buat Akun/Masuk"]').click()
      await driver.pause(3000)

      //Login with wrong username
      await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[1]').click();
      await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[1]').setValue(noHp);
      //Login with wrong password
      await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[2]').click();
      await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[2]').setValue(password);
      await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.ImageView[4]').click()
      await driver.pause(3000)
      await $('//android.widget.Button[@content-desc="Masuk"]').click()
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

  it('Format Nomor Telepon Salah', async () => {
    const noHp = "0343209432494";
    const password = "Test123!";
    //Login with right username
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[1]').click();
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[1]').setValue(noHp);
    //Login with right password
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[2]').click();
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[2]').setValue(password);
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.ImageView[4]').click()
    await $('//android.widget.Button[@content-desc="Masuk"]').click()
    await driver.pause(3000)

    // Verify error message appears for invalid password
    const inputanKosong = await $('//android.view.View[@content-desc="No Handphone harus terdiri 10-13 digit numerik dan diawali dengan (08)"]');
    await expect(inputanKosong).toBeDisplayed();

    // Verify the content-desc attribute contains the expected text
    const contentDesc = await inputanKosong.getAttribute('content-desc');
    await expect(contentDesc).toBe("No Handphone harus terdiri 10-13 digit numerik dan diawali dengan (08)");
  })

  it('Format Password Salah', async () => {
    const noHp = "088905450134";
    const password = "Test123";
    //Login with right username
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[1]').click();
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[1]').setValue(noHp);
    //Login with right password
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[2]').click();
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[2]').setValue(password);
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.ImageView[4]').click()

    await $('//android.widget.Button[@content-desc="Masuk"]').click()
    await driver.pause(3000)

    const inputanKosong = await $('//android.view.View[@content-desc="Password terdiri dari paduan huruf dan angka minimal 8 digit"]');
    await expect(inputanKosong).toBeDisplayed();

    // Verify the content-desc attribute contains the expected text
    const contentDesc = await inputanKosong.getAttribute('content-desc');
    await expect(contentDesc).toBe("Password terdiri dari paduan huruf dan angka minimal 8 digit");
  })

  it('Input password tidak sesuai dengan password akun', async () => {
    const password = "Test123!$%";
    
    //Login with right password
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[2]').click();
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[2]').setValue(password);
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.ImageView[4]').click()

    await $('//android.widget.Button[@content-desc="Masuk"]').click()

    const inputanKosong = await $('//android.view.View[@content-desc="No Hp dan Password yang Anda masukkan tidak ditemukan. Periksa dan coba kembali"]');
    await expect(inputanKosong).toBeDisplayed();

    // Verify the content-desc attribute contains the expected text
    const contentDesc = await inputanKosong.getAttribute('content-desc');
    await expect(contentDesc).toBe("No Hp dan Password yang Anda masukkan tidak ditemukan. Periksa dan coba kembali");
  })

  it('Akun Belum Terdaftar', async () => {
    const noHp = "0889054501844";
    const password = "Test123!";
    //Login with right username
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[1]').click();
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[1]').setValue(noHp);
    //Login with right password
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[2]').click();
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[2]').setValue(password);
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.ImageView[4]').click()

    await $('//android.widget.Button[@content-desc="Masuk"]').click()

    const inputanKosong = await $('//android.view.View[@content-desc="No Hp dan Password yang Anda masukkan tidak ditemukan. Periksa dan coba kembali"]');
    await expect(inputanKosong).toBeDisplayed();

    // Verify the content-desc attribute contains the expected text
    const contentDesc = await inputanKosong.getAttribute('content-desc');
    await expect(contentDesc).toBe("No Hp dan Password yang Anda masukkan tidak ditemukan. Periksa dan coba kembali");
  })

  it('Login dengan data valid', async () => {
    const noHp = "088905450134";
    //Login with right username
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[1]').click();
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[1]').setValue(noHp);

    await $('//android.widget.Button[@content-desc="Masuk"]').click()
    await driver.pause(3000)

    //Izinkan notifikasi
    await $('//android.widget.Button[@content-desc="Izinkan"]').click()

    //logout - wait for Profile tab to be available
    const profileTab = await $('//android.widget.ImageView[@content-desc="Profile\nTab 4 of 4"]');
    await profileTab.waitForDisplayed({ timeout: 10000 });
    await profileTab.click();
    await driver.pause(2000)
    await $('//android.widget.Button[@content-desc="Keluar"]').click()
    await page.pressBackButtonMultiple(1)
  })
})

