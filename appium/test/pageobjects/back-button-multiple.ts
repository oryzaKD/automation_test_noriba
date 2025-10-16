import { expect } from '@wdio/globals'
import { browser } from '@wdio/globals'
import Page from './page'

describe('Android Back Button Multiple Presses', () => {
    let page: Page

    before(async () => {
        page = new Page()
    })

    it('should press back button 5 times using loop method', async () => {
        // Wait for the app to load
        await browser.pause(2000)
        
        console.log('=== Method 1: Using for loop ===')
        
        // Method 1: Using simple for loop
        for (let i = 0; i < 5; i++) {
            await browser.pressKeyCode(4) // KEYCODE_BACK
            await browser.pause(500) // Delay between presses
            console.log(`Back button pressed ${i + 1}/5 times`)
        }
        
        console.log('✓ Completed 5 back button presses using for loop')
        await browser.pause(2000)
    })

    it('should press back button 5 times using page object method', async () => {
        console.log('=== Method 2: Using Page Object Method ===')
        
        // Method 2: Using page object method
        await page.pressBackButtonMultiple(5)
        
        console.log('✓ Completed 5 back button presses using page object method')
        await browser.pause(2000)
    })

    it('should press back button 5 times using generic key code method', async () => {
        console.log('=== Method 3: Using Generic Key Code Method ===')
        
        // Method 3: Using generic key code method
        await page.pressKeyCodeMultiple(4, 5, 300) // keyCode=4, count=5, delay=300ms
        
        console.log('✓ Completed 5 back button presses using generic method')
        await browser.pause(2000)
    })

    it('should press back button 5 times with different delays', async () => {
        console.log('=== Method 4: With Custom Delays ===')
        
        // Method 4: With different delays between presses
        const delays = [200, 400, 600, 800, 1000] // Different delays for each press
        
        for (let i = 0; i < 5; i++) {
            await browser.pressKeyCode(4)
            console.log(`Back button pressed ${i + 1}/5 times with ${delays[i]}ms delay`)
            await browser.pause(delays[i])
        }
        
        console.log('✓ Completed 5 back button presses with custom delays')
        await browser.pause(2000)
    })

    it('should press back button 5 times using array methods', async () => {
        console.log('=== Method 5: Using Array Methods ===')
        
        // Method 5: Using array methods (more functional approach)
        const pressCount = Array.from({ length: 5 }, (_, i) => i + 1)
        
        for (const count of pressCount) {
            await browser.pressKeyCode(4)
            console.log(`Back button pressed ${count}/5 times`)
            await browser.pause(400)
        }
        
        console.log('✓ Completed 5 back button presses using array methods')
        await browser.pause(2000)
    })

    it('should demonstrate error handling for multiple back presses', async () => {
        console.log('=== Method 6: With Error Handling ===')
        
        try {
            // Method 6: With proper error handling
            const maxPresses = 5
            let successfulPresses = 0
            
            for (let i = 0; i < maxPresses; i++) {
                try {
                    await browser.pressKeyCode(4)
                    successfulPresses++
                    console.log(`✓ Back button pressed successfully ${successfulPresses}/${maxPresses}`)
                    await browser.pause(500)
                } catch (error) {
                    console.error(`✗ Failed to press back button at attempt ${i + 1}:`, error)
                    break
                }
            }
            
            console.log(`✓ Successfully completed ${successfulPresses} back button presses`)
            
        } catch (error) {
            console.error('Error in multiple back button press test:', error)
        }
        
        await browser.pause(2000)
    })

    it('should demonstrate different key codes for Android navigation', async () => {
        console.log('=== Demonstrating Different Android Key Codes ===')
        
        // Demonstrate different Android key codes
        const keyCodes = [
            { code: 3, name: 'HOME' },
            { code: 4, name: 'BACK' },
            { code: 82, name: 'MENU' },
            { code: 187, name: 'RECENT_APPS' }
        ]
        
        for (const keyCode of keyCodes) {
            console.log(`Pressing ${keyCode.name} button (keyCode: ${keyCode.code})`)
            await browser.pressKeyCode(keyCode.code)
            await browser.pause(1000)
        }
        
        console.log('✓ Demonstrated different Android navigation key codes')
    })
})
