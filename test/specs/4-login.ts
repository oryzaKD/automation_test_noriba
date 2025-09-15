import { expect } from '@wdio/globals'
import Page from '../pageobjects/page';

describe('My Login application', () => {
  let page: Page

    before(async () => {
        page = new Page()
    })
    
    it("should not login with invalid credentials", async () => {
        const noribaElement = await $('//android.widget.TextView[@content-desc="Noriba"]');
    
        if (await noribaElement.isDisplayed()) {
          await noribaElement.click();
          console.log('Noriba element clicked!');
          await driver.pause(3000)
    
          //Click button masuk
          await $('//android.widget.Button[@content-desc="Buat Akun/Masuk"]').click()
          await driver.pause(3000)
    
          //Login with wrong username
          await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[1]').click();
          await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[1]').setValue("08239582780");
          //Login with wrong password
          await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[2]').click();
          await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[2]').setValue("Test1234$");
          await driver.pause(3000)
          await $('//android.widget.Button[@content-desc="Masuk"]').click()
    
          await expect(
            $(
              '//android.view.View[@content-desc="No Hp dan Password yang Anda masukkan tidak ditemukan. Periksa dan coba kembali"]'
            )
          )
    
        } else {
          console.log('Noriba element is not visible!');
        }
      });

    it('should login with valid credentials', async () => {
        //Login with right username
        await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[1]').click();
        await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[1]').setValue("088905450134");
        //Login with right password
        await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[2]').click();
        await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[2]').setValue("Test123!");
        await $('//android.widget.Button[@content-desc="Masuk"]').click()
        await driver.pause(3000)
        await $('(//android.widget.Button[@content-desc="Oke"])[2]').click()
        await $('//android.widget.Button[@content-desc="Oke"]').click()

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

