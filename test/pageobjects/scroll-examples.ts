import { expect } from '@wdio/globals'
import Page from './page';

describe('Scroll Examples', () => {
    let page: Page

    before(async () => {
        page = new Page()
    })

    it('should demonstrate different scroll methods', async () => {
        // Example 1: Scroll to bottom once
        console.log('=== Example 1: Single scroll to bottom ===')
        await page.scrollToBottom()
        await driver.pause(2000)

        // Example 2: Scroll to bottom multiple times until reached
        console.log('=== Example 2: Multiple scrolls to bottom ===')
        await page.scrollToBottomMultiple(5)
        await driver.pause(2000)

        // Example 3: Scroll to top
        console.log('=== Example 3: Scroll to top ===')
        await page.scrollToTop()
        await driver.pause(2000)

        // Example 4: Scroll to top multiple times
        console.log('=== Example 4: Multiple scrolls to top ===')
        await page.scrollToTopMultiple(3)
        await driver.pause(2000)

        // Example 5: Use mobile: scroll command
        console.log('=== Example 5: Mobile scroll command ===')
        await page.scrollMobile('down', 0.8)
        await driver.pause(1000)
        await page.scrollMobile('up', 0.8)
        await driver.pause(2000)

        // Example 6: Scroll to find specific element
        console.log('=== Example 6: Scroll to find element ===')
        try {
            const element = await page.scrollToFindElement('//android.widget.Button[@content-desc="Some Button"]', 5, 'down')
            await element.click()
            console.log('Element found and clicked!')
        } catch (error) {
            console.log('Element not found after scrolling')
        }

        // Example 7: Custom swipe with specific coordinates
        console.log('=== Example 7: Custom swipe ===')
        const { width, height } = await driver.getWindowSize()
        await page.customSwipe(
            width / 2,      // startX (center)
            height * 0.7,   // startY (70% from top)
            width / 2,      // endX (center)
            height * 0.3    // endY (30% from top)
        )
        await driver.pause(2000)

        // Example 8: Scroll using key events
        console.log('=== Example 8: Scroll with key events ===')
        await page.scrollDownWithKeys()
        await driver.pause(1000)
        await page.scrollUpWithKeys()
        await driver.pause(2000)

        // Example 9: Comprehensive scroll (tries multiple methods)
        console.log('=== Example 9: Comprehensive scroll ===')
        await page.scrollToBottomComprehensive()
        await driver.pause(2000)
    })

    it('should scroll in a specific container', async () => {
        // Example: Scroll within a specific element (like a list or container)
        console.log('=== Scroll within specific container ===')
        
        try {
            // Find a scrollable container
            const container = await $('//android.widget.ScrollView')
            if (await container.isDisplayed()) {
                // Get container dimensions
                const containerRect = await container.getLocation()
                const containerSize = await container.getSize()
                
                // Calculate scroll coordinates within the container
                const startX = containerRect.x + (containerSize.width / 2)
                const startY = containerRect.y + (containerSize.height * 0.8)
                const endY = containerRect.y + (containerSize.height * 0.2)
                
                // Perform scroll within container
                await page.customSwipe(startX, startY, startX, endY)
                console.log('Scrolled within container successfully')
            }
        } catch (error) {
            console.log('Container not found or scroll failed:', error)
        }
    })

    it('should scroll and wait for element to be visible', async () => {
        console.log('=== Scroll and wait for element ===')
        
        // Scroll down and wait for a specific element to appear
        const maxAttempts = 10
        let elementFound = false
        
        for (let i = 0; i < maxAttempts; i++) {
            try {
                const targetElement = await $('//android.widget.TextView[@text="Target Text"]')
                if (await targetElement.isDisplayed()) {
                    console.log(`Element found after ${i + 1} scroll attempts`)
                    elementFound = true
                    break
                }
            } catch (error) {
                // Element not found, continue scrolling
            }
            
            await page.scrollToBottom()
            await driver.pause(1000)
            console.log(`Scroll attempt ${i + 1}/${maxAttempts}`)
        }
        
        if (!elementFound) {
            console.log('Element not found after maximum scroll attempts')
        }
    })

    it('should scroll horizontally', async () => {
        console.log('=== Horizontal scroll example ===')
        
        // Example of horizontal scrolling (left to right)
        const { width, height } = await driver.getWindowSize()
        
        // Scroll right
        await page.customSwipe(
            width * 0.2,    // startX (20% from left)
            height / 2,     // startY (center vertically)
            width * 0.8,    // endX (80% from left)
            height / 2      // endY (center vertically)
        )
        await driver.pause(1000)
        
        // Scroll left
        await page.customSwipe(
            width * 0.8,    // startX (80% from left)
            height / 2,     // startY (center vertically)
            width * 0.2,    // endX (20% from left)
            height / 2      // endY (center vertically)
        )
        await driver.pause(1000)
    })
})
