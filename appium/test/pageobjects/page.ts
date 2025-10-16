import { browser } from '@wdio/globals'
import type { ChainablePromiseElement } from 'webdriverio'

/**
* main page object containing all methods, selectors and functionality
* that is shared across all page objects
*/
export default class Page {
    /**
    * Opens a sub page of the page
    * @param path path of the sub page (e.g. /path/to/page.html)
    */
    public open (path: string) {
        return browser.url(`https://the-internet.herokuapp.com/${path}`)
    }

    /**
    * Press the Android home button to return to home screen
    * Uses Android key code 3 (KEYCODE_HOME)
    */
    public async pressHomeButton() {
        console.log('Pressing Android home button...')
        await browser.pressKeyCode(3) // KEYCODE_HOME
        await browser.pause(2000) // Wait for transition
    }

    /**
    * Press the Android home button using alternative method
    * Uses browser.pressKey method
    */
    public async pressHomeButtonAlternative() {
        console.log('Pressing Android home button (alternative method)...')
        await browser.pressKeyCode(3) // KEYCODE_HOME
        await browser.pause(2000) // Wait for transition
    }

    /**
    * Press the Android home button using execute method
    * Uses mobile: pressKey command
    */
    public async pressHomeButtonExecute() {
        console.log('Pressing Android home button (execute method)...')
        await browser.execute('mobile: pressKey', { keycode: 3 })
        await browser.pause(2000) // Wait for transition
    }

    /**
    * Press the Android back button
    * Uses Android key code 4 (KEYCODE_BACK)
    */
    public async pressBackButton() {
        console.log('Pressing Android back button...')
        await browser.pressKeyCode(4) // KEYCODE_BACK
        await browser.pause(1000) // Wait for transition
    }

    /**
    * Press the Android menu button
    * Uses Android key code 82 (KEYCODE_MENU)
    */
    public async pressMenuButton() {
        console.log('Pressing Android menu button...')
        await browser.pressKeyCode(82) // KEYCODE_MENU
        await browser.pause(1000) // Wait for transition
    }

    /**
    * Press the Android IME action "Next" (Gboard label: "Brkt")
    * Uses mobile: performEditorAction with fallback keycodes
    */
    public async pressImeNext() {
        try {
            await browser.execute('mobile: performEditorAction', { action: 'next' })
        } catch (_e) {
            // Fallbacks: TAB (61) or ENTER (66)
            try {
                await browser.pressKeyCode(61) // KEYCODE_TAB
            } catch (_e2) {
                await browser.pressKeyCode(66) // KEYCODE_ENTER
            }
        }
        await browser.pause(300)
    }

	/**
	* Pick a date on Android Material date picker using an ISO string (YYYY-MM-DD)
	* Works by navigating month/year then tapping the day, and pressing OK
	*/
	public async pickCalendarDateISO(iso: string) {
		const target = new Date(iso)
		if (Number.isNaN(target.getTime())) throw new Error(`Invalid date: ${iso}`)
		const year = target.getFullYear()
		const monthName = target.toLocaleString('en-US', { month: 'long' })
		const day = target.getDate()

		// Move to the desired month/year (try at most 24 clicks)
		for (let i = 0; i < 24; i++) {
			const headerSel = `//*[@content-desc and contains(@content-desc, '${monthName}') and contains(@content-desc, '${year}')]|//*[@text and contains(@text, '${monthName}') and contains(@text, '${year}')]`
			if (await $(headerSel).isDisplayed()) break

			// Try clicking "next month"; if not found, try "previous"
			const nextSel = `//*[@content-desc='Next month' or @content-desc='Next' or @content-desc='Go to next month']`
			const prevSel = `//*[@content-desc='Previous month' or @content-desc='Previous' or @content-desc='Go to previous month']`
			if (await $(nextSel).isExisting()) {
				await $(nextSel).click()
			} else if (await $(prevSel).isExisting()) {
				await $(prevSel).click()
			} else {
				// As a fallback, try the right-most ImageButton (click last)
				const lastButton = await $('(//android.widget.ImageButton)[last()]')
				if (await lastButton.isExisting()) await lastButton.click()
			}
			await browser.pause(150)
		}

		// Select the exact day cell
		const daySel = `//*[@content-desc and contains(@content-desc, '${monthName}') and contains(@content-desc, ' ${day} ') and contains(@content-desc, '${year}')]|//*[@text='${day}']`
		await $(daySel).click()

		// Confirm
		const okSel = `//*[@text='OK' or @content-desc='OK' or @resource-id='android:id/button1']`
		if (await $(okSel).isExisting()) {
			await $(okSel).click()
		}
	}

    /**
    * Press the Android back button multiple times
    * @param count Number of times to press the back button
    */
    public async pressBackButtonMultiple(count: number = 1) {
        console.log(`Pressing Android back button ${count} times...`)
        for (let i = 0; i < count; i++) {
            await browser.pressKeyCode(4) // KEYCODE_BACK
            await browser.pause(500) // Short pause between presses
            console.log(`Back button pressed ${i + 1}/${count} times`)
        }
        await browser.pause(1000) // Final pause after all presses
    }

    /**
    * Press the Android home button multiple times
    * @param count Number of times to press the home button
    */
    public async pressHomeButtonMultiple(count: number = 1) {
        console.log(`Pressing Android home button ${count} times...`)
        for (let i = 0; i < count; i++) {
            await browser.pressKeyCode(3) // KEYCODE_HOME
            await browser.pause(500) // Short pause between presses
            console.log(`Home button pressed ${i + 1}/${count} times`)
        }
        await browser.pause(1000) // Final pause after all presses
    }

    /**
    * Press any Android key code multiple times
    * @param keyCode The Android key code to press
    * @param count Number of times to press the key
    * @param delayBetweenPresses Delay between each press in milliseconds
    */
    public async pressKeyCodeMultiple(keyCode: number, count: number = 1, delayBetweenPresses: number = 500) {
        console.log(`Pressing key code ${keyCode} ${count} times...`)
        for (let i = 0; i < count; i++) {
            await browser.pressKeyCode(keyCode)
            await browser.pause(delayBetweenPresses)
            console.log(`Key code ${keyCode} pressed ${i + 1}/${count} times`)
        }
        await browser.pause(1000) // Final pause after all presses
    }

    /**
     * Get current activity name
     * Useful for verification after navigation
     */
    public async getCurrentActivity() {
        try {
            return await browser.getCurrentActivity()
        } catch (error) {
            console.log('Could not get current activity:', error)
            return null
        }
    }

    /**
     * Scroll down to the bottom of the screen
     * Uses swipe gesture from center to top
     */
    public async scrollToBottom() {
        console.log('Scrolling to bottom of screen...')
        const { width, height } = await browser.getWindowSize()
        const startX = width / 2
        const startY = height * 0.8  // Start from 80% of screen height
        const endY = height * 0.2    // End at 20% of screen height
        
        await browser.touchAction([
            { action: 'press', x: startX, y: startY },
            { action: 'wait', ms: 500 },
            { action: 'moveTo', x: startX, y: endY },
            { action: 'release' }
        ])
        await browser.pause(1000)
    }

    /**
     * Scroll up to the top of the screen
     * Uses swipe gesture from center to bottom
     */
    public async scrollToTop() {
        console.log('Scrolling to top of screen...')
        const { width, height } = await browser.getWindowSize()
        const startX = width / 2
        const startY = height * 0.2  // Start from 20% of screen height
        const endY = height * 0.8    // End at 80% of screen height
        
        await browser.touchAction([
            { action: 'press', x: startX, y: startY },
            { action: 'wait', ms: 500 },
            { action: 'moveTo', x: startX, y: endY },
            { action: 'release' }
        ])
        await browser.pause(1000)
    }

    /**
     * Scroll down multiple times until bottom is reached
     * @param maxScrolls Maximum number of scroll attempts (default: 10)
     */
    public async scrollToBottomMultiple(maxScrolls: number = 10) {
        console.log(`Scrolling to bottom with maximum ${maxScrolls} attempts...`)
        
        for (let i = 0; i < maxScrolls; i++) {
            try {
                console.log(`Scroll attempt ${i + 1}/${maxScrolls}`)
                
                // Try different scroll methods for better compatibility
                if (i % 3 === 0) {
                    // Use mobile: scroll command
                    await this.scrollMobile('down', 0.8)
                } else if (i % 3 === 1) {
                    // Use touch action
                    await this.scrollToBottom()
                } else {
                    // Use key events
                    await this.scrollDownWithKeys()
                }
                
                await browser.pause(1500) // Wait between scrolls
                
                // Check if we've reached the bottom by comparing page source
                const previousPageSource = await browser.getPageSource()
                await browser.pause(500)
                const currentPageSource = await browser.getPageSource()
                
                if (previousPageSource === currentPageSource) {
                    console.log(`Reached bottom after ${i + 1} scrolls`)
                    break
                }
                
            } catch (error) {
                console.log(`Scroll attempt ${i + 1} failed:`, error)
                // Continue with next attempt
            }
        }
        
        console.log('Finished scrolling to bottom')
    }

    /**
     * Scroll up multiple times until top is reached
     * @param maxScrolls Maximum number of scroll attempts (default: 10)
     */
    public async scrollToTopMultiple(maxScrolls: number = 10) {
        console.log(`Scrolling to top with maximum ${maxScrolls} attempts...`)
        
        for (let i = 0; i < maxScrolls; i++) {
            const previousPageSource = await browser.getPageSource()
            await this.scrollToTop()
            
            // Check if we've reached the top by comparing page source
            const currentPageSource = await browser.getPageSource()
            if (previousPageSource === currentPageSource) {
                console.log(`Reached top after ${i + 1} scrolls`)
                break
            }
            
            console.log(`Scroll attempt ${i + 1}/${maxScrolls}`)
        }
    }

    /**
     * Scroll down using mobile: scroll command
     * @param direction Direction to scroll ('up', 'down', 'left', 'right')
     * @param percent Percentage of screen to scroll (default: 0.8)
     */
    public async scrollMobile(direction: 'up' | 'down' | 'left' | 'right' = 'down', percent: number = 0.8) {
        console.log(`Scrolling ${direction} using mobile: scroll command...`)
        
        await browser.execute('mobile: scroll', {
            direction: direction,
            percent: percent
        })
        await browser.pause(1000)
    }

    /**
     * Scroll to find a specific element
     * @param selector Element selector to find
     * @param maxScrolls Maximum number of scroll attempts (default: 10)
     * @param scrollDirection Direction to scroll ('up' or 'down', default: 'down')
     */
    public async scrollToFindElement(selector: string, maxScrolls: number = 10, scrollDirection: 'up' | 'down' = 'down') {
        console.log(`Scrolling to find element: ${selector}`)
        
        for (let i = 0; i < maxScrolls; i++) {
            try {
                const element = await $(selector)
                if (await element.isDisplayed()) {
                    console.log(`Element found after ${i + 1} scrolls`)
                    return element
                }
            } catch (error) {
                // Element not found, continue scrolling
            }
            
            if (scrollDirection === 'down') {
                await this.scrollToBottom()
            } else {
                await this.scrollToTop()
            }
            
            console.log(`Scroll attempt ${i + 1}/${maxScrolls}`)
        }
        
        throw new Error(`Element not found after ${maxScrolls} scroll attempts`)
    }

    /**
     * Scroll using swipe with custom coordinates
     * @param startX Start X coordinate
     * @param startY Start Y coordinate
     * @param endX End X coordinate
     * @param endY End Y coordinate
     * @param duration Duration of swipe in milliseconds (default: 1000)
     */
    public async customSwipe(startX: number, startY: number, endX: number, endY: number, _duration: number = 1000) {
        console.log(`Custom swipe from (${startX}, ${startY}) to (${endX}, ${endY})`)
        
        await browser.touchAction([
            { action: 'press', x: startX, y: startY },
            { action: 'wait', ms: 100 },
            { action: 'moveTo', x: endX, y: endY },
            { action: 'release' }
        ])
        await browser.pause(500)
    }

    /**
     * Scroll down using Android key events (Page Down)
     */
    public async scrollDownWithKeys() {
        console.log('Scrolling down using Page Down key...')
        await browser.pressKeyCode(93) // KEYCODE_PAGE_DOWN
        await browser.pause(1000)
    }

    /**
     * Scroll up using Android key events (Page Up)
     */
    public async scrollUpWithKeys() {
        console.log('Scrolling up using Page Up key...')
        await browser.pressKeyCode(92) // KEYCODE_PAGE_UP
        await browser.pause(1000)
    }

    /**
     * Scroll to bottom using multiple methods
     * Tries different scrolling approaches for maximum compatibility
     */
    public async scrollToBottomComprehensive() {
        console.log('Comprehensive scroll to bottom...')
        
        // Method 1: Try mobile: scroll command
        try {
            await this.scrollMobile('down', 0.9)
            console.log('Used mobile: scroll command')
        } catch (error) {
            console.log('mobile: scroll failed, trying touch action...')
            
            // Method 2: Try touch action
            try {
                await this.scrollToBottom()
                console.log('Used touch action')
            } catch (error) {
                console.log('Touch action failed, trying key events...')
                
                // Method 3: Try key events
                await this.scrollDownWithKeys()
                console.log('Used key events')
            }
        }
    }

    /**
     * Simple and reliable scroll down method
     * Uses basic touch action with error handling
     */
    public async simpleScrollDown() {
        console.log('Simple scroll down...')
        try {
            const { width, height } = await browser.getWindowSize()
            console.log(`Window size for scroll: ${width}x${height}`)
            
            const startX = width / 2
            const startY = height * 0.7  // Start from 70% of screen height
            const endY = height * 0.3    // End at 30% of screen height
            
            console.log(`Scroll coordinates: from (${startX}, ${startY}) to (${startX}, ${endY})`)
            
            await browser.touchAction([
                { action: 'press', x: startX, y: startY },
                { action: 'wait', ms: 500 },
                { action: 'moveTo', x: startX, y: endY },
                { action: 'release' }
            ])
            await browser.pause(1000)
            console.log('✅ Simple scroll completed successfully')
        } catch (error) {
            console.log('❌ Simple scroll failed:', error)
            throw error
        }
    }

    /**
     * Scroll down multiple times with simple method
     * @param count Number of times to scroll
     */
    public async simpleScrollDownMultiple(count: number = 3) {
        console.log(`Simple scroll down ${count} times...`)
        
        for (let i = 0; i < count; i++) {
            try {
                console.log(`Simple scroll ${i + 1}/${count}`)
                await this.simpleScrollDown()
                await browser.pause(1000) // Wait between scrolls
            } catch (error) {
                console.log(`Simple scroll ${i + 1} failed:`, error)
                // Continue with next scroll
            }
        }
        
        console.log('Simple scroll multiple completed')
    }

    /**
     * Scroll to bottom until no more content can be scrolled
     * Simple method that just scrolls down until it can't scroll anymore
     * @param maxScrolls Maximum number of scroll attempts (default: 10)
     */
    public async scrollToBottomMax(maxScrolls: number = 10) {
        console.log(`=== Starting scrollToBottomMax with ${maxScrolls} attempts ===`)
        
        try {
            // Get initial window size
            const { width, height } = await browser.getWindowSize()
            console.log(`Window size: ${width}x${height}`)
            
            for (let i = 0; i < maxScrolls; i++) {
                try {
                    console.log(`--- Scroll attempt ${i + 1}/${maxScrolls} ---`)
                    
                    // Get page source before scroll
                    const beforeScroll = await browser.getPageSource()
                    console.log(`Page source length before scroll: ${beforeScroll.length}`)
                    
                    // Perform scroll with multiple methods for better reliability
                    try {
                        // Method 1: Try simple scroll down
                        await this.simpleScrollDown()
                        console.log(`Simple scroll down completed`)
                    } catch (scrollError) {
                        console.log(`Simple scroll failed, trying alternative method:`, scrollError)
                        
                        // Method 2: Try mobile scroll command
                        try {
                            await browser.execute('mobile: scroll', {
                                direction: 'down',
                                percent: 0.8
                            })
                            console.log(`Mobile scroll command completed`)
                        } catch (mobileError) {
                            console.log(`Mobile scroll failed, trying touch action:`, mobileError)
                            
                            // Method 3: Try basic touch action
                            const startX = width / 2
                            const startY = height * 0.8
                            const endY = height * 0.2
                            
                            await browser.touchAction([
                                { action: 'press', x: startX, y: startY },
                                { action: 'wait', ms: 500 },
                                { action: 'moveTo', x: startX, y: endY },
                                { action: 'release' }
                            ])
                            console.log(`Touch action scroll completed`)
                        }
                    }
                    
                    await browser.pause(2000) // Wait for scroll to complete
                    
                    // Get page source after scroll
                    const afterScroll = await browser.getPageSource()
                    console.log(`Page source length after scroll: ${afterScroll.length}`)
                    
                    // If page source is the same, we've reached the bottom
                    if (beforeScroll === afterScroll) {
                        console.log(`✅ Reached bottom after ${i + 1} scrolls (page source unchanged)`)
                        break
                    } else {
                        console.log(`📄 Page content changed, continuing scroll...`)
                    }
                    
                } catch (error) {
                    console.log(`❌ Scroll attempt ${i + 1} failed:`, error)
                    // Continue with next attempt
                }
            }
            
            console.log('=== Finished scrolling to bottom maximum ===')
            
        } catch (error) {
            console.log('❌ scrollToBottomMax function failed completely:', error)
            throw error
        }
    }

    /**
     * Simple scroll to bottom - just scroll down a fixed number of times
     * @param times Number of times to scroll down (default: 5)
     */
    public async scrollDown(times: number = 5) {
        console.log(`Scrolling down ${times} times...`)
        
        for (let i = 0; i < times; i++) {
            try {
                console.log(`Scroll ${i + 1}/${times}`)
                await this.simpleScrollDown()
                await browser.pause(1000)
            } catch (error) {
                console.log(`Scroll ${i + 1} failed:`, error)
            }
        }
        
        console.log(`Completed ${times} scrolls down`)
    }

    /**
     * Most reliable scroll down method - uses multiple strategies
     * @param times Number of times to scroll down (default: 5)
     */
    public async reliableScrollDown(times: number = 5) {
        console.log(`Reliable scroll down ${times} times...`)
        
        for (let i = 0; i < times; i++) {
            try {
                console.log(`Reliable scroll ${i + 1}/${times}`)
                
                // Get window size
                const { width, height } = await browser.getWindowSize()
                console.log(`Window size: ${width}x${height}`)
                
                // Calculate scroll coordinates
                const startX = width / 2
                const startY = height * 0.8  // Start from 80% of screen height
                const endY = height * 0.2    // End at 20% of screen height
                
                console.log(`Scroll from (${startX}, ${startY}) to (${startX}, ${endY})`)
                
                // Perform scroll with touch action
                await browser.touchAction([
                    { action: 'press', x: startX, y: startY },
                    { action: 'wait', ms: 500 },
                    { action: 'moveTo', x: startX, y: endY },
                    { action: 'release' }
                ])
                
                console.log(`Scroll ${i + 1} completed`)
                await browser.pause(2000) // Wait between scrolls
                
            } catch (error) {
                console.log(`Reliable scroll ${i + 1} failed:`, error)
                
                // Try alternative method
                try {
                    console.log(`Trying alternative scroll method...`)
                    await browser.execute('mobile: scroll', {
                        direction: 'down',
                        percent: 0.8
                    })
                    console.log(`Alternative scroll ${i + 1} completed`)
                } catch (altError) {
                    console.log(`Alternative scroll ${i + 1} also failed:`, altError)
                }
                
                await browser.pause(1000)
            }
        }
        
        console.log(`Completed ${times} reliable scrolls down`)
    }

    /**
     * Alternative scroll to bottom method - more aggressive approach
     * @param maxScrolls Maximum number of scroll attempts (default: 10)
     */
    public async scrollToBottomAlternative(maxScrolls: number = 10) {
        console.log(`=== Alternative scroll to bottom (${maxScrolls} attempts) ===`)
        
        for (let i = 0; i < maxScrolls; i++) {
            try {
                console.log(`Alternative scroll ${i + 1}/${maxScrolls}`)
                
                // Get window size
                const { width, height } = await browser.getWindowSize()
                
                // Use different scroll patterns for better coverage
                const scrollPatterns = [
                    // Pattern 1: Full screen scroll
                    { startY: height * 0.9, endY: height * 0.1 },
                    // Pattern 2: Medium scroll
                    { startY: height * 0.8, endY: height * 0.2 },
                    // Pattern 3: Small scroll
                    { startY: height * 0.7, endY: height * 0.3 }
                ]
                
                const pattern = scrollPatterns[i % scrollPatterns.length]
                const startX = width / 2
                
                console.log(`Using pattern: from (${startX}, ${pattern.startY}) to (${startX}, ${pattern.endY})`)
                
                await browser.touchAction([
                    { action: 'press', x: startX, y: pattern.startY },
                    { action: 'wait', ms: 300 },
                    { action: 'moveTo', x: startX, y: pattern.endY },
                    { action: 'release' }
                ])
                
                await browser.pause(1500)
                console.log(`✅ Alternative scroll ${i + 1} completed`)
                
            } catch (error) {
                console.log(`❌ Alternative scroll ${i + 1} failed:`, error)
            }
        }
        
        console.log('=== Alternative scroll to bottom completed ===')
    }

    /**
     * Ultra simple scroll method - just swipe down multiple times
     * @param times Number of times to swipe down (default: 5)
     */
    public async ultraSimpleScroll(times: number = 5) {
        console.log(`=== Ultra simple scroll (${times} times) ===`)
        
        for (let i = 0; i < times; i++) {
            try {
                console.log(`Ultra simple scroll ${i + 1}/${times}`)
                
                // Just swipe from bottom to top
                await browser.touchAction([
                    { action: 'press', x: 500, y: 1500 },
                    { action: 'wait', ms: 200 },
                    { action: 'moveTo', x: 500, y: 500 },
                    { action: 'release' }
                ])
                
                await browser.pause(1000)
                console.log(`✅ Ultra simple scroll ${i + 1} completed`)
                
            } catch (error) {
                console.log(`❌ Ultra simple scroll ${i + 1} failed:`, error)
            }
        }
        
        console.log('=== Ultra simple scroll completed ===')
    }

    /**
     * Advanced scroll to bottom with multiple detection methods
     * @param maxScrolls Maximum number of scroll attempts (default: 15)
     */
    public async scrollToBottomAdvanced(maxScrolls: number = 15) {
        console.log(`=== Advanced scroll to bottom (${maxScrolls} attempts) ===`)
        
        let consecutiveNoChange = 0
        let lastPageSource = ''
        
        for (let i = 0; i < maxScrolls; i++) {
            try {
                console.log(`--- Advanced scroll attempt ${i + 1}/${maxScrolls} ---`)
                
                // Get current page source
                const currentPageSource = await browser.getPageSource()
                
                // Check if we've seen this page source before
                if (currentPageSource === lastPageSource) {
                    consecutiveNoChange++
                    console.log(`Page source unchanged (${consecutiveNoChange} times)`)
                    
                    if (consecutiveNoChange >= 3) {
                        console.log('✅ Reached bottom - no changes for 3 consecutive scrolls')
                        break
                    }
                } else {
                    consecutiveNoChange = 0
                    console.log('📄 Page content changed, continuing...')
                }
                
                lastPageSource = currentPageSource
                
                // Try multiple scroll methods in sequence
                await this.performMultipleScrollMethods()
                
                // Wait for content to load
                await browser.pause(2000)
                
            } catch (error) {
                console.log(`❌ Advanced scroll attempt ${i + 1} failed:`, error)
            }
        }
        
        console.log('=== Advanced scroll to bottom completed ===')
    }

    /**
     * Perform multiple scroll methods in sequence for better coverage
     */
    private async performMultipleScrollMethods() {
        const { width, height } = await browser.getWindowSize()
        
        // Method 1: Standard touch action
        try {
            console.log('Trying standard touch action...')
            await browser.touchAction([
                { action: 'press', x: width / 2, y: height * 0.8 },
                { action: 'wait', ms: 500 },
                { action: 'moveTo', x: width / 2, y: height * 0.2 },
                { action: 'release' }
            ])
            console.log('✅ Standard touch action completed')
        } catch (error) {
            console.log('❌ Standard touch action failed:', error)
        }
        
        await browser.pause(1000)
        
        // Method 2: Mobile scroll command
        try {
            console.log('Trying mobile scroll command...')
            await browser.execute('mobile: scroll', {
                direction: 'down',
                percent: 0.9
            })
            console.log('✅ Mobile scroll command completed')
        } catch (error) {
            console.log('❌ Mobile scroll command failed:', error)
        }
        
        await browser.pause(1000)
        
        // Method 3: Swipe gesture
        try {
            console.log('Trying swipe gesture...')
            await browser.touchAction([
                { action: 'press', x: width / 2, y: height * 0.9 },
                { action: 'wait', ms: 300 },
                { action: 'moveTo', x: width / 2, y: height * 0.1 },
                { action: 'release' }
            ])
            console.log('✅ Swipe gesture completed')
        } catch (error) {
            console.log('❌ Swipe gesture failed:', error)
        }
    }

    /**
     * Scroll to bottom using Android-specific methods
     * @param maxScrolls Maximum number of scroll attempts (default: 20)
     */
    public async scrollToBottomAndroid(maxScrolls: number = 20) {
        console.log(`=== Android-specific scroll to bottom (${maxScrolls} attempts) ===`)
        
        for (let i = 0; i < maxScrolls; i++) {
            try {
                console.log(`Android scroll ${i + 1}/${maxScrolls}`)
                
                // Get window size
                const { width, height } = await browser.getWindowSize()
                console.log(`Screen: ${width}x${height}`)
                
                // Use different scroll strategies
                const strategies = [
                    // Strategy 1: Full screen swipe
                    () => this.androidSwipe(width / 2, height * 0.9, width / 2, height * 0.1),
                    // Strategy 2: Half screen swipe
                    () => this.androidSwipe(width / 2, height * 0.8, width / 2, height * 0.2),
                    // Strategy 3: Quarter screen swipe
                    () => this.androidSwipe(width / 2, height * 0.7, width / 2, height * 0.3),
                    // Strategy 4: Key-based scroll
                    () => this.scrollWithKeys(),
                    // Strategy 5: Mobile command
                    () => browser.execute('mobile: scroll', { direction: 'down', percent: 0.8 })
                ]
                
                const strategy = strategies[i % strategies.length]
                await strategy()
                
                console.log(`✅ Android scroll ${i + 1} completed`)
                await browser.pause(1500)
                
            } catch (error) {
                console.log(`❌ Android scroll ${i + 1} failed:`, error)
            }
        }
        
        console.log('=== Android-specific scroll completed ===')
    }

    /**
     * Android-specific swipe method
     */
    private async androidSwipe(startX: number, startY: number, endX: number, endY: number) {
        console.log(`Android swipe: (${startX}, ${startY}) -> (${endX}, ${endY})`)
        
        await browser.touchAction([
            { action: 'press', x: startX, y: startY },
            { action: 'wait', ms: 200 },
            { action: 'moveTo', x: endX, y: endY },
            { action: 'release' }
        ])
    }

    /**
     * Scroll using Android key events
     */
    private async scrollWithKeys() {
        console.log('Using Android key events for scrolling...')
        
        // Try Page Down key
        try {
            await browser.pressKeyCode(93) // KEYCODE_PAGE_DOWN
            console.log('Page Down key pressed')
        } catch (error) {
            console.log('Page Down key failed:', error)
            
            // Try Down Arrow key
            try {
                await browser.pressKeyCode(20) // KEYCODE_DPAD_DOWN
                console.log('Down Arrow key pressed')
            } catch (arrowError) {
                console.log('Down Arrow key failed:', arrowError)
            }
        }
    }

    /**
     * Force scroll to bottom - most aggressive method
     * @param times Number of times to force scroll (default: 10)
     */
    public async forceScrollToBottom(times: number = 10) {
        console.log(`=== Force scroll to bottom (${times} times) ===`)
        
        for (let i = 0; i < times; i++) {
            try {
                console.log(`Force scroll ${i + 1}/${times}`)
                
                // Get screen dimensions
                const { width, height } = await browser.getWindowSize()
                
                // Multiple aggressive scroll attempts
                const scrolls = [
                    // Very aggressive swipe
                    { startY: height * 0.95, endY: height * 0.05 },
                    // Medium aggressive swipe
                    { startY: height * 0.85, endY: height * 0.15 },
                    // Standard swipe
                    { startY: height * 0.75, endY: height * 0.25 }
                ]
                
                for (const scroll of scrolls) {
                    try {
                        await browser.touchAction([
                            { action: 'press', x: width / 2, y: scroll.startY },
                            { action: 'wait', ms: 100 },
                            { action: 'moveTo', x: width / 2, y: scroll.endY },
                            { action: 'release' }
                        ])
                        await browser.pause(500)
                    } catch (scrollError) {
                        console.log('Individual scroll failed:', scrollError)
                    }
                }
                
                console.log(`✅ Force scroll ${i + 1} completed`)
                await browser.pause(1000)
                
            } catch (error) {
                console.log(`❌ Force scroll ${i + 1} failed:`, error)
            }
        }
        
        console.log('=== Force scroll to bottom completed ===')
    }

    /**
     * Smart scroll to bottom with element detection
     * Tries to find specific elements that indicate we've reached the bottom
     * @param maxScrolls Maximum number of scroll attempts (default: 25)
     */
    public async smartScrollToBottom(maxScrolls: number = 25) {
        console.log(`=== Smart scroll to bottom (${maxScrolls} attempts) ===`)
        
        let noChangeCount = 0
        let lastScrollPosition = ''
        
        for (let i = 0; i < maxScrolls; i++) {
            try {
                console.log(`--- Smart scroll attempt ${i + 1}/${maxScrolls} ---`)
                
                // Get current scroll position or page source
                const currentPosition = await this.getScrollPosition()
                console.log(`Current scroll position: ${currentPosition}`)
                
                // Check if position changed
                if (currentPosition === lastScrollPosition) {
                    noChangeCount++
                    console.log(`Position unchanged (${noChangeCount} times)`)
                    
                    if (noChangeCount >= 2) {
                        console.log('✅ Reached bottom - position unchanged for 2 consecutive scrolls')
                        break
                    }
                } else {
                    noChangeCount = 0
                    console.log('📄 Position changed, continuing scroll...')
                }
                
                lastScrollPosition = currentPosition
                
                // Try to find bottom indicators
                const bottomFound = await this.checkForBottomIndicators()
                if (bottomFound) {
                    console.log('✅ Found bottom indicators, stopping scroll')
                    break
                }
                
                // Perform smart scroll
                await this.performSmartScroll(i)
                
                // Wait for content to settle
                await browser.pause(2000)
                
            } catch (error) {
                console.log(`❌ Smart scroll attempt ${i + 1} failed:`, error)
            }
        }
        
        console.log('=== Smart scroll to bottom completed ===')
    }

    /**
     * Get current scroll position or page state
     */
    private async getScrollPosition(): Promise<string> {
        try {
            // Try to get page source hash as position indicator
            const pageSource = await browser.getPageSource()
            return pageSource.substring(pageSource.length - 500) // Last 500 chars
        } catch (error) {
            console.log('Could not get scroll position:', error)
            return `position_${Date.now()}`
        }
    }

    /**
     * Check for elements that indicate we've reached the bottom
     */
    private async checkForBottomIndicators(): Promise<boolean> {
        try {
            // Common bottom indicators in Android apps
            const bottomSelectors = [
                '//android.widget.TextView[contains(@text, "Selesai")]',
                '//android.widget.TextView[contains(@text, "Done")]',
                '//android.widget.TextView[contains(@text, "Finish")]',
                '//android.widget.TextView[contains(@text, "Submit")]',
                '//android.widget.TextView[contains(@text, "Kirim")]',
                '//android.widget.Button[contains(@content-desc, "Daftar")]',
                '//android.widget.Button[contains(@content-desc, "Register")]',
                '//android.widget.Button[contains(@content-desc, "Submit")]',
                '//android.widget.Button[contains(@content-desc, "Kirim")]',
                '//android.widget.TextView[contains(@text, "©")]',
                '//android.widget.TextView[contains(@text, "Copyright")]',
                '//android.widget.TextView[contains(@text, "Hak Cipta")]'
            ]
            
            for (const selector of bottomSelectors) {
                try {
                    const element = await $(selector)
                    if (await element.isDisplayed()) {
                        console.log(`Found bottom indicator: ${selector}`)
                        return true
                    }
                } catch (error) {
                    // Element not found, continue
                }
            }
            
            return false
        } catch (error) {
            console.log('Error checking bottom indicators:', error)
            return false
        }
    }

    /**
     * Perform smart scroll with varying strategies
     */
    private async performSmartScroll(attempt: number) {
        const { width, height } = await browser.getWindowSize()
        
        // Vary scroll strategy based on attempt number
        const strategies = [
            // Strategy 1: Full screen aggressive
            () => this.androidSwipe(width / 2, height * 0.95, width / 2, height * 0.05),
            // Strategy 2: Medium screen
            () => this.androidSwipe(width / 2, height * 0.8, width / 2, height * 0.2),
            // Strategy 3: Small screen
            () => this.androidSwipe(width / 2, height * 0.7, width / 2, height * 0.3),
            // Strategy 4: Mobile command
            () => browser.execute('mobile: scroll', { direction: 'down', percent: 0.9 }),
            // Strategy 5: Key events
            () => this.scrollWithKeys(),
            // Strategy 6: Multiple small scrolls
            () => this.performMultipleSmallScrolls(width, height)
        ]
        
        const strategy = strategies[attempt % strategies.length]
        await strategy()
    }

    /**
     * Perform multiple small scrolls
     */
    private async performMultipleSmallScrolls(width: number, height: number) {
        console.log('Performing multiple small scrolls...')
        
        for (let i = 0; i < 3; i++) {
            try {
                await browser.touchAction([
                    { action: 'press', x: width / 2, y: height * 0.6 },
                    { action: 'wait', ms: 200 },
                    { action: 'moveTo', x: width / 2, y: height * 0.4 },
                    { action: 'release' }
                ])
                await browser.pause(300)
            } catch (error) {
                console.log(`Small scroll ${i + 1} failed:`, error)
            }
        }
    }

    /**
     * Simple scroll to bottom - scroll down a fixed number of times
     * @param times Number of times to scroll down (default: 5)
     */
    public async scrollToBottomSimple(times: number = 5) {
        console.log(`=== Scroll to bottom simple (${times} times) ===`)
        
        for (let i = 0; i < times; i++) {
            try {
                console.log(`Simple scroll ${i + 1}/${times}`)
                
                // Get window size
                const { width, height } = await browser.getWindowSize()
                console.log(`Window size: ${width}x${height}`)
                
                // Use swipe method instead of touchAction for better compatibility
                const startX = Math.floor(width / 2)
                const startY = Math.floor(height * 0.8)
                const endX = Math.floor(width / 2)
                const endY = Math.floor(height * 0.2)
                
                console.log(`Swipe from (${startX}, ${startY}) to (${endX}, ${endY})`)
                
                // Try multiple methods for better compatibility
                try {
                    // Method 1: Use browser.touchAction with proper format
                    await browser.touchAction([
                        { action: 'press', x: startX, y: startY },
                        { action: 'wait', ms: 500 },
                        { action: 'moveTo', x: endX, y: endY },
                        { action: 'release' }
                    ])
                    console.log(`✅ Touch action scroll ${i + 1} completed`)
                } catch (touchError) {
                    console.log(`Touch action failed, trying swipe method:`, touchError)
                    
                    // Method 2: Use browser.touchAction with different format
                    try {
                        await browser.touchAction([
                            { action: 'press', x: startX, y: startY },
                            { action: 'wait', ms: 300 },
                            { action: 'moveTo', x: endX, y: endY },
                            { action: 'release' }
                        ])
                        console.log(`✅ Alternative touch action scroll ${i + 1} completed`)
                    } catch (altError) {
                        console.log(`Alternative touch action failed, trying mobile scroll:`, altError)
                        
                        // Method 3: Use mobile: scroll command
                        await browser.execute('mobile: scroll', {
                            direction: 'down',
                            percent: 0.8
                        })
                        console.log(`✅ Mobile scroll ${i + 1} completed`)
                    }
                }
                
                await browser.pause(1000) // Wait between scrolls
                
            } catch (error) {
                console.log(`❌ Simple scroll ${i + 1} failed:`, error)
            }
        }
        
        console.log('=== Simple scroll to bottom completed ===')
    }

    /**
     * Scroll to bottom until no more content can be scrolled
     * This function will keep scrolling until it reaches the very bottom
     * @param maxScrolls Maximum number of scroll attempts (default: 20)
     */
    public async scrollToBottomUntilEnd(maxScrolls: number = 20) {
        console.log(`=== Scroll to bottom until end (max ${maxScrolls} attempts) ===`)
        
        let noChangeCount = 0
        
        for (let i = 0; i < maxScrolls; i++) {
            try {
                console.log(`--- Scroll attempt ${i + 1}/${maxScrolls} ---`)
                
                // Get page source before scroll
                const beforeScroll = await browser.getPageSource()
                
                // Perform scroll using reliable method
                await this.performReliableScroll()
                
                await browser.pause(1500) // Wait for scroll to complete
                
                // Get page source after scroll
                const afterScroll = await browser.getPageSource()
                
                // Check if page content changed
                if (beforeScroll === afterScroll) {
                    noChangeCount++
                    console.log(`Page content unchanged (${noChangeCount} times)`)
                    
                    if (noChangeCount >= 2) {
                        console.log('✅ Reached bottom - no changes for 2 consecutive scrolls')
                        break
                    }
                } else {
                    noChangeCount = 0
                    console.log('📄 Page content changed, continuing scroll...')
                }
                
            } catch (error) {
                console.log(`❌ Scroll attempt ${i + 1} failed:`, error)
            }
        }
        
        console.log('=== Scroll to bottom until end completed ===')
    }

    /**
     * Scroll to bottom with element detection
     * Scrolls until a specific element is found or max attempts reached
     * @param elementSelector XPath selector for the target element
     * @param maxScrolls Maximum number of scroll attempts (default: 15)
     */
    public async scrollToBottomFindElement(elementSelector: string, maxScrolls: number = 15) {
        console.log(`=== Scroll to bottom find element: ${elementSelector} ===`)
        
        for (let i = 0; i < maxScrolls; i++) {
            try {
                console.log(`--- Scroll attempt ${i + 1}/${maxScrolls} ---`)
                
                // Check if element is already visible
                try {
                    const element = await $(elementSelector)
                    if (await element.isDisplayed()) {
                        console.log(`✅ Element found after ${i} scrolls`)
                        return element
                    }
                } catch (error) {
                    // Element not found, continue scrolling
                }
                
                // Perform scroll using reliable method
                await this.performReliableScroll()
                
                await browser.pause(1500) // Wait for scroll to complete
                
            } catch (error) {
                console.log(`❌ Scroll attempt ${i + 1} failed:`, error)
            }
        }
        
        throw new Error(`Element not found after ${maxScrolls} scroll attempts`)
    }

    /**
     * Perform reliable scroll using multiple fallback methods
     * This method tries different approaches to ensure scroll works
     */
    private async performReliableScroll() {
        const { width, height } = await browser.getWindowSize()
        const startX = Math.floor(width / 2)
        const startY = Math.floor(height * 0.8)
        const endX = Math.floor(width / 2)
        const endY = Math.floor(height * 0.2)
        
        console.log(`Reliable scroll from (${startX}, ${startY}) to (${endX}, ${endY})`)
        
        // Method 0: Try element-scoped scroll on common scrollable containers
        try {
            const didScroll = await this.tryElementScopedScrollDown()
            if (didScroll) {
                console.log('✅ Element-scoped scrollGesture successful')
                return
            }
        } catch (elErr) {
            console.log('Element-scoped scroll failed/none found:', elErr)
        }

        // Method 1: Try Android UiAutomator2 scrollGesture (Appium 2)
        try {
            const canScrollMore = await browser.execute('mobile: scrollGesture', {
                left: 0,
                top: Math.floor(height * 0.1),
                width: width,
                height: Math.floor(height * 0.8),
                direction: 'down',
                percent: 0.9
            })
            console.log(`✅ scrollGesture executed (canScrollMore=${canScrollMore})`)
            return
        } catch (gestureError) {
            console.log('scrollGesture not available/failed, falling back:', gestureError)
        }

        // Method 1b: Try Android UiAutomator2 swipeGesture as fallback
        try {
            await browser.execute('mobile: swipeGesture', {
                left: 0,
                top: Math.floor(height * 0.1),
                width: width,
                height: Math.floor(height * 0.8),
                direction: 'up',
                percent: 0.9
            })
            console.log('✅ swipeGesture executed')
            return
        } catch (swipeErr) {
            console.log('swipeGesture failed, falling back:', swipeErr)
        }

        // Method 2: Try mobile: scroll command (iOS or plugin-specific)
        try {
            await browser.execute('mobile: scroll', {
                direction: 'down',
                percent: 0.8
            })
            console.log('✅ Mobile scroll command successful')
            return
        } catch (mobileError) {
            console.log('Mobile scroll failed, trying touch action:', mobileError)
        }
        
        // Method 3: Try touchAction with correct WebDriverIO format
        try {
            await browser.touchAction([
                { action: 'press', x: startX, y: startY },
                { action: 'wait', ms: 500 },
                { action: 'moveTo', x: endX, y: endY },
                { action: 'release' }
            ])
            console.log('✅ Touch action successful')
            return
        } catch (touchError) {
            console.log('Touch action failed:', touchError)
        }
        
        // Method 4: Try key-based scrolling as last resort
        try {
            await browser.pressKeyCode(93) // KEYCODE_PAGE_DOWN
            console.log('✅ Key-based scroll successful')
        } catch (keyError) {
            console.log('Key-based scroll failed:', keyError)
            throw new Error('All scroll methods failed')
        }
    }

    /**
     * Try to scroll within a specific scrollable container element
     * Returns true if a scroll was performed
     */
    private async tryElementScopedScrollDown(): Promise<boolean> {
        // Common Android scrollable containers
        const containerSelectors = [
            '//androidx.recyclerview.widget.RecyclerView',
            '//android.widget.ScrollView',
            '//android.widget.ListView',
            '//androidx.core.widget.NestedScrollView',
            // Fallback: any view with scrollbars enabled
            "//android.view.View[@scrollable='true']"
        ]
        
        for (const selector of containerSelectors) {
            try {
                const container = await $(selector)
                if (!(await container.isExisting())) {
                    continue
                }
                if (!(await container.isDisplayed())) {
                    continue
                }
                
                const loc = await container.getLocation()
                const size = await container.getSize()
                
                await browser.execute('mobile: scrollGesture', {
                    left: loc.x,
                    top: loc.y,
                    width: size.width,
                    height: size.height,
                    direction: 'down',
                    percent: 0.9
                })
                return true
            } catch (_e) {
                // try next selector
            }
        }
        
        return false
    }

    /**
     * Safe scroll to bottom - uses only mobile: scroll command
     * This is the most reliable method for Android automation
     * @param times Number of times to scroll down (default: 5)
     */
    public async safeScrollToBottom(times: number = 5) {
        console.log(`=== Safe scroll to bottom (${times} times) ===`)
        
        for (let i = 0; i < times; i++) {
            try {
                console.log(`Safe scroll ${i + 1}/${times}`)
                
                // Use only mobile: scroll command - most reliable
                await browser.execute('mobile: scroll', {
                    direction: 'down',
                    percent: 0.8
                })
                
                console.log(`✅ Safe scroll ${i + 1} completed`)
                await browser.pause(1000) // Wait between scrolls
                
            } catch (error) {
                console.log(`❌ Safe scroll ${i + 1} failed:`, error)
            }
        }
        
        console.log('=== Safe scroll to bottom completed ===')
    }

    /**
     * Ultra safe scroll to bottom - uses key events only
     * @param times Number of times to scroll down (default: 5)
     */
    public async ultraSafeScrollToBottom(times: number = 5) {
        console.log(`=== Ultra safe scroll to bottom (${times} times) ===`)
        
        for (let i = 0; i < times; i++) {
            try {
                console.log(`Ultra safe scroll ${i + 1}/${times}`)
                
                // Use Page Down key - most compatible
                await browser.pressKeyCode(93) // KEYCODE_PAGE_DOWN
                
                console.log(`✅ Ultra safe scroll ${i + 1} completed`)
                await browser.pause(1000) // Wait between scrolls
                
            } catch (error) {
                console.log(`❌ Ultra safe scroll ${i + 1} failed:`, error)
            }
        }
        
        console.log('=== Ultra safe scroll to bottom completed ===')
    }

    /**
     * ANDROID: UiScrollable helpers to scroll element into view by various selectors
     */
    private escapeUiSelectorString(input: string): string {
        return input.replace(/"/g, '\\"')
    }

    /**
     * Scrolls until an element with exact text is in view and returns it
     */
    public androidScrollIntoViewByText(text: string): ChainablePromiseElement {
        const safeText = this.escapeUiSelectorString(text)
        const selector = `android=new UiScrollable(new UiSelector().scrollable(true))`
            + `.setAsVerticalList()`
            + `.scrollIntoView(new UiSelector().text("${safeText}"))`
        return $(selector)
    }

    /**
     * Scrolls until an element with partial text is in view and returns it
     */
    public androidScrollIntoViewByTextContains(textPart: string): ChainablePromiseElement {
        const safeText = this.escapeUiSelectorString(textPart)
        const selector = `android=new UiScrollable(new UiSelector().scrollable(true))`
            + `.setAsVerticalList()`
            + `.scrollIntoView(new UiSelector().textContains("${safeText}"))`
        return $(selector)
    }

    /**
     * Scrolls until an element with the given resourceId is in view and returns it
     */
    public androidScrollIntoViewByResourceId(resourceId: string): ChainablePromiseElement {
        const safeId = this.escapeUiSelectorString(resourceId)
        const selector = `android=new UiScrollable(new UiSelector().scrollable(true))`
            + `.setAsVerticalList()`
            + `.scrollIntoView(new UiSelector().resourceId("${safeId}"))`
        return $(selector)
    }

    /**
     * Scrolls until an element with content-desc (description) containing the text is in view and returns it
     */
    public androidScrollIntoViewByDescriptionContains(descPart: string): ChainablePromiseElement {
        const safeText = this.escapeUiSelectorString(descPart)
        const selector = `android=new UiScrollable(new UiSelector().scrollable(true))`
            + `.setAsVerticalList()`
            + `.scrollIntoView(new UiSelector().descriptionContains("${safeText}"))`
        return $(selector)
    }

    /**
     * Scrolls until an element with exact content-desc (description) is in view and returns it
     */
    public androidScrollIntoViewByDescription(description: string): ChainablePromiseElement {
        const safeText = this.escapeUiSelectorString(description)
        const selector = `android=new UiScrollable(new UiSelector().scrollable(true))`
            + `.setAsVerticalList()`
            + `.scrollIntoView(new UiSelector().description("${safeText}"))`
        return $(selector)
    }

    /**
     * Generic scroll and find element helper
     * Can search by text, content-desc, or resource-id
     * @param selector The text/description/id to search for
     * @param type Type of selector: 'text', 'description', 'resourceId' (default: 'text')
     */
    public async scrollAndFindElement(
        selector: string, 
        type: 'text' | 'description' | 'resourceId' = 'text'
    ) {
        const safeSelector = this.escapeUiSelectorString(selector)
        
        let uiSelector: string
        switch (type) {
            case 'description':
                uiSelector = `new UiSelector().descriptionContains("${safeSelector}")`
                break
            case 'resourceId':
                uiSelector = `new UiSelector().resourceId("${safeSelector}")`
                break
            case 'text':
            default:
                uiSelector = `new UiSelector().text("${safeSelector}")`
                break
        }
        
        const element = await $(`android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(${uiSelector})`)
        return element
    }

    /**
     * Find element by XPath with content-desc attribute
     * @param desc The content-desc value to search for
     */
    public async findElementByContentDesc(desc: string) {
        const element = await $(`//android.view.View[@content-desc="${desc}"]`)
        return element
    }

    /**
     * Find element by XPath with text attribute
     * @param text The text value to search for
     */
    public async findElementByText(text: string) {
        const element = await $(`//android.widget.TextView[@text="${text}"]`)
        return element
    }

    /**
     * Find element by content-desc with multiple fallback strategies
     * Tries UiScrollable, direct selector, and manual scroll
     */
    public async findElementByDescription(
        description: string,
        options: { 
            caseSensitive?: boolean, 
            exactMatch?: boolean,
            timeout?: number 
        } = {}
    ) {
        const { caseSensitive = true, exactMatch = true, timeout = 5000 } = options
        
        // Method 1: Try UiScrollable first (fastest if it works)
        try {
            if (exactMatch) {
                const selector = `android=new UiScrollable(new UiSelector().scrollable(true)).setAsVerticalList().scrollIntoView(new UiSelector().description("${this.escapeUiSelectorString(description)}"))`
                const el = $(selector)
                await el.waitForDisplayed({ timeout })
                return el
            } else {
                const el = this.androidScrollIntoViewByDescriptionContains(description)
                await el.waitForDisplayed({ timeout })
                return el
            }
        } catch (e1) {
            // Method 2: Try direct XPath selector
            try {
                const element = $(`//android.view.View[@content-desc="${description}"]`)
                await element.waitForDisplayed({ timeout })
                return element
            } catch (e2) {
                // Method 3: Try case-insensitive if needed
                if (caseSensitive) {
                    try {
                        const lowerDesc = description.toLowerCase()
                        const element = $(`//android.view.View[@content-desc="${lowerDesc}"]`)
                        await element.waitForDisplayed({ timeout })
                        return element
                    } catch (e3) {
                        // Continue to Method 4
                    }
                }
                
                // Method 4: Manual scroll fallback
                const selector = `//android.view.View[@content-desc="${description}"]`
                return this.scrollToBottomFindElement(selector, 20)
            }
        }
    }

    /**
     * Center a visible element roughly in the middle of the viewport using small scroll gestures
     * Useful to avoid elements sticking to the very top/bottom edges before interacting
     */
    public async centerElementOnScreen(
        el: any,
        tolerancePx: number = 20,
        maxTries: number = 8
    ) {
        const win = await browser.getWindowSize()
        const gestureRegion = {
            left: 10,
            top: 10,
            width: win.width - 20,
            height: win.height - 20,
        }
        const targetCenterY = Math.round(gestureRegion.top + gestureRegion.height / 2)

        for (let i = 0; i < maxTries; i++) {
            // Ensure element is on screen first
            if (!(await el.isDisplayed())) {
                await browser.execute('mobile: scrollGesture', {
                    ...gestureRegion,
                    direction: 'down',
                    percent: 0.6,
                })
                continue
            }

            // Use getLocation + getSize for broad driver compatibility
            const loc = await el.getLocation()
            const size = await el.getSize()
            const elCenterY = loc.y + size.height / 2
            const delta = elCenterY - targetCenterY

            if (Math.abs(delta) <= tolerancePx) return

            await browser.execute('mobile: scrollGesture', {
                ...gestureRegion,
                direction: delta > 0 ? 'down' : 'up',
                percent: Math.min(0.6, Math.max(0.2, Math.abs(delta) / gestureRegion.height)),
            })

            await browser.pause(120)
        }

        throw new Error('Failed to center element on screen')
    }
}
