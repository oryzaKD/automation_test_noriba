import Page from '../pageobjects/page'

describe('Clear Cache', () => {

    it("should clear cache", async () => {
        const page = new Page()
        const settingElement = await $('//android.widget.TextView[@content-desc="Pengaturan"]');

        if (await settingElement.isDisplayed()) {
            await settingElement.click();

            //Click search setting
            await $('//android.widget.Button[@content-desc="Telusuri setelan"]').click()
            await $('//android.widget.AutoCompleteTextView[@resource-id="com.android.settings.intelligence:id/search_src_text"]').click()
            await $('//android.widget.AutoCompleteTextView[@resource-id="com.android.settings.intelligence:id/search_src_text"]').setValue("Aplikasi")
            await driver.pause(2000)
            await $('(//android.widget.LinearLayout[@resource-id="com.android.settings.intelligence:id/result_container"])[2]').click()

            await $('//android.widget.Button[@content-desc="Cari aplikasi"]').click()
            await $('//android.widget.AutoCompleteTextView[@resource-id="com.android.settings:id/search_src_text"]').click()
            await $('//android.widget.AutoCompleteTextView[@resource-id="com.android.settings:id/search_src_text"]').setValue("noriba")

            await $('//android.widget.TextView[@content-desc="Noriba"]').click()

            await page.scrollAndFindElement("Penyimpanan", "text");

            await $('//android.widget.TextView[@resource-id="android:id/title" and @text="Penyimpanan"]').click()

            await $('//android.widget.Button[@resource-id="com.android.settings:id/button1"]').click()
            await $('//android.widget.Button[@resource-id="android:id/button1"]').click()
            await driver.pause(2000)
            await page.pressBackButtonMultiple(8)
        } else {
            console.log('Setting element is not visible!');
        }
    });
})

