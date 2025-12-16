import Page from '../pageobjects/page'

describe('It should update App', () => {
    let page: Page

    before(async () => {
        page = new Page()
    })
    
    it("should update app", async () => {
        const appTesterElement = await $('//android.widget.TextView[@content-desc="App Tester"]');

        if (await appTesterElement.isDisplayed()) {
            await appTesterElement.click();
            await driver.pause(2000); 

            //Click Dev App
            await $('(//android.view.ViewGroup[@resource-id="dev.firebase.appdistribution:id/row"])[3]').click()

            //Click Download Button
            await $('//android.view.ViewGroup[@resource-id="dev.firebase.appdistribution:id/download_button"]').click()
            await driver.pause(10000); 

            //Click Install Button
            await $('//android.widget.Button[@resource-id="android:id/button1"]').click()
            await driver.pause(5000); 

            await page.pressBackButtonMultiple(2)

        } else {
            console.log('Setting element is not visible!');
        }
    });
})

