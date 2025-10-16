import { expect } from '@wdio/globals'
import Page from '../pageobjects/page';

describe('My Login application', () => {
  let page: Page

  before(async () => {
    page = new Page()
  })

  it("Login Noriba", async () => {
    const noribaElement = await $('//android.widget.TextView[@content-desc="Noriba"]');
    const noHp = "088905450134";
    const password = "Ubah123!";

    if (await noribaElement.isDisplayed()) {
      await noribaElement.click();
      console.log('Noriba element clicked!');
      await driver.pause(3000)

      // Allow permission notification
      await $('//android.widget.Button[@resource-id="com.android.permissioncontroller:id/permission_allow_button"]').click()

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
      await $('//android.widget.Button[@content-desc="Masuk"]').click()
      await driver.pause(3000)

      //Izinkan notifikasi
      await $('//android.widget.Button[@content-desc="Izinkan"]').click()

      const profileTab = await $('//android.widget.ImageView[@content-desc="Profile\nTab 4 of 4"]');
      await profileTab.waitForDisplayed({ timeout: 10000 });
      await profileTab.click();
      await driver.pause(2000)

    } else {
      console.log('Noriba element is not visible!');
    }
  });

  it('Mengosongi semua field', async () => {
    await $('//android.view.View[@content-desc="Ubah Password"]').click();
    
    //Klik button ubah password
    await $('//android.widget.Button[@content-desc="Ubah Password"]').click()
    await driver.pause(3000)

    // Verify error message appears for invalid password
    const inputanKosong = await $('(//android.view.View[@content-desc="Tidak boleh kosong"])[1]');
    await expect(inputanKosong).toBeDisplayed();

    // Verify the content-desc attribute contains the expected text
    const contentDesc = await inputanKosong.getAttribute('content-desc');
    await expect(contentDesc).toBe("Tidak boleh kosong");
  })

  it('Password lama tidak sesuai atau salah', async () => {
    const passwordLama = "Ubah123!$";
    const passwordBaru = "Test123!";
    const passwordBaruConfirm = "Test123!";

    //password lama
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.widget.EditText[1]').click();
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.widget.EditText[1]').setValue(passwordLama);
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.widget.ImageView[1]').click();
    //password baru
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.widget.EditText[2]').click();
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.widget.EditText[2]').setValue(passwordBaru);
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.widget.ImageView[2]').click();
    //password baru confirm
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.widget.EditText[3]').click();
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.widget.EditText[3]').setValue(passwordBaruConfirm);
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.widget.ImageView[3]').click();

    //Klik button ubah password
    await $('//android.widget.Button[@content-desc="Ubah Password"]').click()
    await driver.pause(3000)

    const inputanKosong = await $('//android.view.View[@content-desc="Password lama tidak cocok"]');
    await expect(inputanKosong).toBeDisplayed();

    // Verify the content-desc attribute contains the expected text
    const contentDesc = await inputanKosong.getAttribute('content-desc');
    await expect(contentDesc).toBe("Password lama tidak cocok");
  })

  it('Password baru dengan konfirmasi password berbeda', async () => {
    const passwordLama = "Ubah123!";
    const passwordBaru = "Test123!";
    const passwordBaruConfirm = "Test123!$";

    //password lama
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.widget.EditText[1]').click();
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.widget.EditText[1]').setValue(passwordLama);
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.widget.ImageView[1]').click();
    //password baru
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.widget.EditText[2]').click();
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.widget.EditText[2]').setValue(passwordBaru);
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.widget.ImageView[2]').click();
    //password baru confirm
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.widget.EditText[3]').click();
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.widget.EditText[3]').setValue(passwordBaruConfirm);
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.widget.ImageView[3]').click();

    //Klik button ubah password
    await $('//android.widget.Button[@content-desc="Ubah Password"]').click()
    await driver.pause(3000)

    const inputanKosong = await $('//android.view.View[@content-desc="Ulangi password anda dengan benar"]');
    await expect(inputanKosong).toBeDisplayed();

    // Verify the content-desc attribute contains the expected text
    const contentDesc = await inputanKosong.getAttribute('content-desc');
    await expect(contentDesc).toBe("Ulangi password anda dengan benar");
  })

  it('Ubah password dengan password yang sama dengan password sebelumnya', async () => {
    const passwordBaru = "Ubah123!";
    const passwordBaruConfirm = "Ubah123!";

    //password baru
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.widget.EditText[2]').click();
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.widget.EditText[2]').setValue(passwordBaru);
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.widget.ImageView[2]').click();
    //password baru confirm
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.widget.EditText[3]').click();
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.widget.EditText[3]').setValue(passwordBaruConfirm);
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.widget.ImageView[3]').click();

    //Klik button ubah password
    await $('//android.widget.Button[@content-desc="Ubah Password"]').click()
    await driver.pause(3000)

    const inputanKosong = await $('//android.view.View[@content-desc="Password baru sama dengan password lama!"]');
    await expect(inputanKosong).toBeDisplayed();

    // Verify the content-desc attribute contains the expected text
    const contentDesc = await inputanKosong.getAttribute('content-desc');
    await expect(contentDesc).toBe("Password baru sama dengan password lama!");
  })

  it('Berhasil melakukan Ubah Password', async () => {
    const passwordBaru = "Test123!";
    const passwordBaruConfirm = "Test123!";

    //password baru
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.widget.EditText[2]').click();
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.widget.EditText[2]').setValue(passwordBaru);
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.widget.ImageView[2]').click();
    //password baru confirm
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.widget.EditText[3]').click();
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.widget.EditText[3]').setValue(passwordBaruConfirm);
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.widget.ImageView[3]').click();

    //Klik button ubah password
    await $('//android.widget.Button[@content-desc="Ubah Password"]').click()
    await driver.pause(3000)

    const inputanKosong = await $('//android.view.View[@content-desc="Selamat password anda telah berhasil diubah"]');
    await expect(inputanKosong).toBeDisplayed();

    // Verify the content-desc attribute contains the expected text
    const contentDesc = await inputanKosong.getAttribute('content-desc');
    await expect(contentDesc).toBe("Selamat password anda telah berhasil diubah");

    await $('//android.widget.Button[@content-desc="Oke"]').click()
    await driver.pause(2000)

    //logout
    await $('//android.widget.Button[@content-desc="Keluar"]').click()
    await page.pressBackButtonMultiple(2)
  })
})

