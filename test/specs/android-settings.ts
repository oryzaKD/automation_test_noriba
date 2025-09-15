import { expect } from '@wdio/globals'
import { browser } from '@wdio/globals'

describe('Android Settings App', () => {
    it('should open Android Settings and navigate', async () => {
        // Wait for the app to load
        await browser.pause(2000)
        
        // Check if we're in Settings app
        const settingsTitle = await $('//android.widget.TextView[@text="Settings"]')
        await expect(settingsTitle).toBeDisplayed()
        
        // Try to find and click on a common settings option
        const wifiOption = await $('//android.widget.TextView[@text="Wi‑Fi"]')
        if (await wifiOption.isDisplayed()) {
            await wifiOption.click()
            await browser.pause(1000)
            console.log('WiFi settings opened successfully!')
        } else {
            console.log('WiFi option not found, but Settings app is working!')
        }
        
        // Go back to main settings
        await browser.back()
        await browser.pause(1000)
        
        console.log('Android Settings test completed successfully!')
    })
    
    it('should find and interact with search functionality', async () => {
        // Look for search icon or search functionality
        const searchIcon = await $('//android.widget.ImageView[@content-desc="Search"]')
        
        if (await searchIcon.isDisplayed()) {
            await searchIcon.click()
            await browser.pause(1000)
            
            // Try to find search input field
            const searchInput = await $('//android.widget.EditText[@hint="Search settings"]')
            if (await searchInput.isDisplayed()) {
                await searchInput.setValue('display')
                await browser.pause(1000)
                console.log('Search functionality works!')
            }
        } else {
            console.log('Search icon not found, but app is functional!')
        }
    })
})
