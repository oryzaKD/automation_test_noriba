import { expect } from '@wdio/globals'
import Page from '../pageobjects/page';

describe('My Login application', () => {
  let page: Page

  before(async () => {
    page = new Page()
  })

  it("login App Noriba", async () => {
    const noribaElement = await $('//android.widget.TextView[@content-desc="Noriba"]');
    const noHp = "088905450134";
    const password = "Test123!";

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

    } else {
      console.log('Noriba element is not visible!');
    }
  });

  it('Login dengan data valid', async () => {
    // const noHp = "088905450134";
    // const password = "Test123!";

    // //Login with right username
    // await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[1]').click();
    // await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[1]').setValue(noHp);

    // //Login with right password
    // await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[2]').click();
    // await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[2]').setValue(password);
    // await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.ImageView[4]').click()

    // await $('//android.widget.Button[@content-desc="Masuk"]').click()
    // await driver.pause(3000)

    // //Izinkan notifikasi
    // await $('//android.widget.Button[@content-desc="Izinkan"]').click()

    // //logout - wait for Profile tab to be available
    // const profileTab = await $('//android.widget.ImageView[@content-desc="Profile\nTab 4 of 4"]');
    // await profileTab.waitForDisplayed({ timeout: 10000 });
    // await profileTab.click();
    // await driver.pause(2000)
    // await $('//android.widget.Button[@content-desc="Keluar"]').click()
    // await page.pressBackButtonMultiple(1)
  })
})

