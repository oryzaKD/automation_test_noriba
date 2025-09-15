import Page from '../pageobjects/page'

describe('Clear Cache', () => {
    let page: Page

    before(async () => {
        page = new Page()
    })

    it("should clear cache", async () => {
        const settingElement = await $('//android.widget.TextView[@content-desc="Settings"]');

        if (await settingElement.isDisplayed()) {
            await settingElement.click();

            //Click app info
            await $('//androidx.recyclerview.widget.RecyclerView[@resource-id="com.android.settings:id/recycler_view"]/android.widget.LinearLayout[3]/android.widget.RelativeLayout').click()

            // await expect(
            //     $(
            //         '//android.widget.TextView[@resource-id="com.android.settings:id/header_title"]'
            //     )
            // ).toHaveText("Recently opened apps");

            await $('//android.widget.TextView[@content-desc="Search settings"]').click()
            await $('//android.widget.EditText[@resource-id="android:id/search_src_text"]').click()
            await $('//android.widget.EditText[@resource-id="android:id/search_src_text"]').setValue("noriba")

            // await $('//androidx.recyclerview.widget.RecyclerView[@resource-id="com.android.settings:id/apps_list"]/android.widget.LinearLayout/android.widget.LinearLayout[2]').click()

            //CLick app noriba
            await $('//androidx.recyclerview.widget.RecyclerView[@resource-id="com.android.settings.intelligence:id/list_results"]/android.widget.LinearLayout/android.widget.LinearLayout').click()
            
            // await expect(
            //     $(
            //         '//android.widget.TextView[@resource-id="com.android.settings:id/alertTitle"]'
            //     )
            // ).toHaveText("Delete app data?");

            //Delete storage & cache
            await $('//androidx.recyclerview.widget.RecyclerView[@resource-id="com.android.settings:id/recycler_view"]/android.widget.LinearLayout[4]/android.widget.RelativeLayout').click()
            await $('//android.widget.Button[@resource-id="com.android.settings:id/button1"]').click()
            await $('//android.widget.Button[@resource-id="android:id/button1"]').click()
            await driver.pause(2000); 
            // await expect(
            //     $(
            //         '(//android.widget.TextView[@resource-id="android:id/summary"])[3]'
            //     )
            // ).toHaveText("0 B");

            // Menekan tombol Back sebanyak 5 kali menggunakan metode yang lebih efisien
            console.log('Pressing back button 6 times to return to home screen...')
            await page.pressBackButtonMultiple(6)

        } else {
            console.log('Setting element is not visible!');
        }
    });
})

