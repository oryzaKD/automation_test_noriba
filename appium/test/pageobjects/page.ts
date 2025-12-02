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

    /**
     * Find EditText by index (0-based) with automatic scroll
     * More stable than XPath as it doesn't depend on view hierarchy
     * @param index Index of EditText (0 for first, 1 for second, etc.)
     * @param scrollable Whether to scroll to find the element (default: true)
     */
    public async findEditTextByIndex(index: number, scrollable: boolean = true): Promise<ChainablePromiseElement> {
        if (scrollable) {
            const selector = `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().className("android.widget.EditText").instance(${index}))`
            return $(selector)
        } else {
            const selector = `android=new UiSelector().className("android.widget.EditText").instance(${index})`
            return $(selector)
        }
    }

    /**
     * Find element by className and index with automatic scroll
     * @param className Android class name (e.g., "android.widget.Button", "android.widget.EditText")
     * @param index Index of element (0-based)
     * @param scrollable Whether to scroll to find the element (default: true)
     */
    public async findElementByClassAndIndex(
        className: string, 
        index: number, 
        scrollable: boolean = true
    ): Promise<ChainablePromiseElement> {
        if (scrollable) {
            const selector = `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().className("${className}").instance(${index}))`
            return $(selector)
        } else {
            const selector = `android=new UiSelector().className("${className}").instance(${index})`
            return $(selector)
        }
    }

    /**
     * Find element inside ScrollView by child index
     * More reliable alternative to XPath like //android.widget.ScrollView/android.widget.EditText[1]
     * @param childClassName Child element class name (e.g., "android.widget.EditText")
     * @param childIndex Child index (0-based)
     */
    public async findScrollViewChild(childClassName: string, childIndex: number): Promise<ChainablePromiseElement> {
        // First try with UiSelector
        try {
            const selector = `android=new UiSelector().className("android.widget.ScrollView").childSelector(new UiSelector().className("${childClassName}").instance(${childIndex}))`
            const element = await $(selector)
            if (await element.isDisplayed()) {
                return element
            }
        } catch (e) {
            console.log('UiSelector childSelector failed, trying alternative...')
        }

        // Fallback: Find all children and get by index
        const selector = `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().className("${childClassName}").instance(${childIndex}))`
        return $(selector)
    }

    /**
     * Input value to EditText by index attribute from Appium Inspector
     * Uses the actual index attribute value shown in Appium Inspector
     * @param index Index attribute value from Appium Inspector (e.g., 5)
     * @param value Value to input
     * @param hideKeyboard Auto-hide keyboard (default: true)
     * @param keyboardMethod Method to hide keyboard (default: 'back')
     */
    public async setEditTextByIndex(
        index: number, 
        value: string, 
        hideKeyboard: boolean = true,
        keyboardMethod: 'back' | 'native' | 'tap' | 'all' = 'back'
    ) {
        console.log(`📝 Setting value to EditText with index=${index}`)
        
        // Use XPath with index attribute directly from Appium Inspector
        const xpath = `//android.widget.EditText[@index='${index}']`
        console.log(`   XPath selector: ${xpath}`)
        
        const element = await $(xpath)
        await element.waitForDisplayed({ timeout: 7000 })
        await element.click()
        await browser.pause(300)
        await element.setValue(value)
        await browser.pause(500)
        
        console.log(`✅ Value "${value}" set to EditText with index=${index}`)
        
        if (hideKeyboard) {
            await this.hideKeyboard(keyboardMethod)
        }
    }

    /**
     * Get element using stored element reference (from element cache)
     * This is useful when you want to reuse element that was already found
     * @param cachedElement Previously found element
     */
    public async reuseElement(cachedElement: WebdriverIO.Element) {
        try {
            // Check if element is still valid
            if (await cachedElement.isDisplayed()) {
                return cachedElement
            }
        } catch (e) {
            throw new Error('Cached element is no longer valid or displayed')
        }
        return cachedElement
    }

    /**
     * Find EditText by looking for nearby label/anchor text
     * More robust than index-based approach as it doesn't break when fields are added/removed
     * @param labelText The label text near the input field
     * @param position Position relative to label: 'after' (default) or 'before'
     */
    public async findEditTextByLabel(labelText: string, position: 'after' | 'before' = 'after'): Promise<ChainablePromiseElement> {
        const safeLabel = this.escapeUiSelectorString(labelText)
        
        // Strategy 1: Find by following-sibling (most common pattern)
        if (position === 'after') {
            try {
                const xpath = `//*[contains(@text, "${labelText}") or contains(@content-desc, "${labelText}")]/following-sibling::android.widget.EditText[1]`
                const element = await $(xpath)
                if (await element.isDisplayed()) {
                    return element
                }
            } catch (e) {
                console.log('Following-sibling strategy failed, trying alternative...')
            }
        }

        // Strategy 2: Find by preceding-sibling
        if (position === 'before') {
            try {
                const xpath = `//*[contains(@text, "${labelText}") or contains(@content-desc, "${labelText}")]/preceding-sibling::android.widget.EditText[1]`
                const element = await $(xpath)
                if (await element.isDisplayed()) {
                    return element
                }
            } catch (e) {
                console.log('Preceding-sibling strategy failed, trying alternative...')
            }
        }

        // Strategy 3: UiAutomator - find label then find next EditText
        try {
            const selector = `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().textContains("${safeLabel}"));` +
                            `new UiSelector().className("android.widget.EditText")`
            return await $(selector)
        } catch (e) {
            console.log('UiAutomator label strategy failed, trying XPath...')
        }

        // Strategy 4: Fallback - find in parent hierarchy
        const xpath = `//*[contains(@text, "${labelText}") or contains(@content-desc, "${labelText}")]/ancestor::android.view.View[1]//android.widget.EditText`
        return await $(xpath)
    }

    /**
     * Find EditText by placeholder/hint text
     * Works if EditText has a hint attribute
     * @param hintText The hint/placeholder text
     * @param scrollable Whether to scroll to find element (default: true)
     */
    public async findEditTextByHint(hintText: string, scrollable: boolean = true): Promise<ChainablePromiseElement> {
        const safeHint = this.escapeUiSelectorString(hintText)
        
        console.log(`🔍 Searching EditText by hint: "${hintText}"`)
        
        // ✅ Strategy 1: Try finding by content-desc (most reliable for Flutter/React Native apps)
        // Many frameworks expose hint via content-desc
        try {
            console.log('  → Strategy 1: Trying content-desc...')
            const xpath = scrollable 
                ? `//android.widget.EditText[@content-desc="${hintText}"]`
                : `//android.widget.EditText[@content-desc="${hintText}"]`
            
            const element = await $(xpath)
            await element.waitForExist({ timeout: 3000 })
            if (await element.isDisplayed()) {
                console.log('  ✅ Found by content-desc (exact match)')
                return element
            }
        } catch (e) {
            console.log('  ❌ Content-desc exact match not found')
        }

        // ✅ Strategy 2: Try content-desc with contains
        try {
            console.log('  → Strategy 2: Trying content-desc contains...')
            const xpath = `//android.widget.EditText[contains(@content-desc, "${hintText}")]`
            const element = await $(xpath)
            await element.waitForExist({ timeout: 3000 })
            if (await element.isDisplayed()) {
                console.log('  ✅ Found by content-desc (contains)')
                return element
            }
        } catch (e) {
            console.log('  ❌ Content-desc contains not found')
        }

        // ✅ Strategy 3: Try UiAutomator with content-desc
        if (scrollable) {
            try {
                console.log('  → Strategy 3: Trying UiAutomator scrollable content-desc...')
                const selector = `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().className("android.widget.EditText").descriptionContains("${safeHint}"))`
                const element = await $(selector)
                await element.waitForExist({ timeout: 3000 })
                console.log('  ✅ Found by UiAutomator scrollable')
                return element
            } catch (e) {
                console.log('  ❌ UiAutomator scrollable not found')
            }
        }

        // ✅ Strategy 4: Try finding by text attribute (some apps show hint as initial text)
        try {
            console.log('  → Strategy 4: Trying text attribute...')
            const xpath = `//android.widget.EditText[@text="${hintText}"]`
            const element = await $(xpath)
            await element.waitForExist({ timeout: 2000 })
            if (await element.isDisplayed()) {
                console.log('  ✅ Found by text attribute')
                return element
            }
        } catch (e) {
            console.log('  ❌ Text attribute not found')
        }

        // ✅ Strategy 5: Try UiAutomator with text
        if (scrollable) {
            try {
                console.log('  → Strategy 5: Trying UiAutomator scrollable text...')
                const selector = `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().className("android.widget.EditText").textContains("${safeHint}"))`
                const element = await $(selector)
                await element.waitForExist({ timeout: 3000 })
                console.log('  ✅ Found by UiAutomator text')
                return element
            } catch (e) {
                console.log('  ❌ UiAutomator text not found')
            }
        }

        // ✅ Strategy 6: Manual scroll and search (last resort)
        if (scrollable) {
            console.log('  → Strategy 6: Manual scroll + search...')
            for (let i = 0; i < 10; i++) {
                try {
                    // Try both content-desc and text
                    const xpath = `//android.widget.EditText[@content-desc="${hintText}" or @text="${hintText}" or contains(@content-desc, "${hintText}")]`
                    const element = await $(xpath)
                    if (await element.isExisting() && await element.isDisplayed()) {
                        console.log(`  ✅ Found after ${i} scrolls`)
                        return element
                    }
                } catch (e) {
                    // Not found, continue scrolling
                }
                
                // Scroll down
                await this.performReliableScroll()
                await browser.pause(500)
            }
        }

        console.log('  ❌ All strategies failed')
        throw new Error(`EditText with hint "${hintText}" not found after trying all strategies`)
    }

    /**
     * Input value to EditText by finding it with nearby label
     * Most robust approach - doesn't depend on index or position
     * @param labelText Label text near the input field
     * @param value Value to input
     * @param position Position of field relative to label (default: 'after')
     * @param hideKeyboard Auto-hide keyboard (default: true)
     * @param keyboardMethod Method to hide keyboard (default: 'back')
     */
    public async setEditTextByLabel(
        labelText: string, 
        value: string, 
        position: 'after' | 'before' = 'after',
        hideKeyboard: boolean = true,
        keyboardMethod: 'back' | 'native' | 'tap' | 'all' = 'back'
    ) {
        const element = await this.findEditTextByLabel(labelText, position)
        await element.waitForDisplayed({ timeout: 5000 })
        await element.click()
        await element.setValue(value)
        await browser.pause(500)
        
        if (hideKeyboard) {
            await this.hideKeyboard(keyboardMethod)
        }
    }

    /**
     * Find EditText with multiple fallback strategies
     * Tries multiple approaches to find the field, from most stable to least stable
     * 
     * 🎯 Priority Order (most to least reliable):
     * 1. Resource-ID (if app provides it)
     * 2. Hint/Placeholder (unique identifier from Appium Inspector)
     * 3. Content-Desc (if different from hint)
     * 4. Label (nearby anchor text)
     * 5. Custom XPath (explicit selector)
     * 6. Index (LEAST RELIABLE - avoid if possible!)
     * 
     * @param options Search options with multiple fallback strategies
     */
    public async findEditTextRobust(options: {
        resourceId?: string,
        contentDesc?: string,
        label?: string,
        hint?: string,
        index?: number,
        xpath?: string
    }): Promise<ChainablePromiseElement> {
        const { resourceId, contentDesc, label, hint, index, xpath } = options

        console.log('🔍 findEditTextRobust called with options:', JSON.stringify(options, null, 2))

        // Strategy 1: Resource-ID (most stable if available)
        if (resourceId) {
            try {
                console.log('→ Strategy 1: Trying resource-id...')
                const element = await this.scrollAndFindElement(resourceId, 'resourceId')
                if (await element.isDisplayed()) {
                    console.log('✅ Found by resource-id')
                    return element
                }
            } catch (e) {
                console.log('❌ Resource-ID not found, trying next strategy...')
            }
        }

        // Strategy 2: By Hint/Placeholder (PRIORITIZED - unique from Appium Inspector)
        // ⭐ Hint is MORE RELIABLE than index because it's semantic, not positional
        if (hint) {
            try {
                console.log('→ Strategy 2: Trying hint (PRIORITIZED)...')
                const element = await this.findEditTextByHint(hint)
                if (await element.isDisplayed()) {
                    console.log('✅ Found by hint - MOST RELIABLE METHOD!')
                    return element
                }
            } catch (e) {
                console.log('❌ Hint not found, trying next strategy...')
            }
        }

        // Strategy 3: Content-Desc (if different from hint)
        if (contentDesc && contentDesc !== hint) {
            try {
                console.log('→ Strategy 3: Trying content-desc...')
                const element = await this.scrollAndFindElement(contentDesc, 'description')
                if (await element.isDisplayed()) {
                    console.log('✅ Found by content-desc')
                    return element
                }
            } catch (e) {
                console.log('❌ Content-desc not found, trying next strategy...')
            }
        }

        // Strategy 4: By Label (anchor element)
        if (label) {
            try {
                console.log('→ Strategy 4: Trying label...')
                const element = await this.findEditTextByLabel(label)
                if (await element.isDisplayed()) {
                    console.log('✅ Found by label')
                    return element
                }
            } catch (e) {
                console.log('❌ Label not found, trying next strategy...')
            }
        }

        // Strategy 5: Custom XPath (explicit selector)
        if (xpath) {
            try {
                console.log('→ Strategy 5: Trying XPath...')
                const element = await $(xpath)
                if (await element.isDisplayed()) {
                    console.log('✅ Found by XPath')
                    return element
                }
            } catch (e) {
                console.log('❌ XPath not found, trying next strategy...')
            }
        }

        // Strategy 6: By Index (LEAST RELIABLE - only as last resort)
        // ⚠️ WARNING: Index-based selection is fragile and can break when UI changes!
        if (index !== undefined) {
            console.log(`⚠️  WARNING: Falling back to index ${index} - THIS IS UNRELIABLE!`)
            console.log('    Consider using hint, label, or content-desc instead.')
            try {
                const element = await this.findEditTextByIndex(index)
                if (await element.isDisplayed()) {
                    console.log(`⚠️  Found by index ${index} (FRAGILE - may break on UI changes)`)
                    return element
                }
            } catch (e) {
                console.log('❌ Index not found')
            }
        }

        // All strategies failed
        const availableStrategies = Object.keys(options).filter(k => options[k as keyof typeof options] !== undefined)
        throw new Error(`Element not found with any strategy. Tried: ${availableStrategies.join(', ')}`)
    }

    /**
     * Hide Android keyboard using multiple methods
     * Tries different approaches to ensure keyboard is hidden
     * @param method Method to hide keyboard: 'back' (default), 'native', 'tap', 'all'
     */
    public async hideKeyboard(method: 'back' | 'native' | 'tap' | 'all' = 'back') {
        try {
            if (method === 'native' || method === 'all') {
                // Method 1: Native Appium hideKeyboard
                await driver.hideKeyboard()
                console.log('✅ Keyboard hidden using native method')
                if (method !== 'all') return
            }
        } catch (e) {
            console.log('Native hideKeyboard failed, trying alternative...')
        }

        try {
            if (method === 'back' || method === 'all') {
                // Method 2: Press back button
                await this.pressBackButtonMultiple(1)
                console.log('✅ Keyboard hidden using back button')
                if (method !== 'all') return
            }
        } catch (e) {
            console.log('Back button failed, trying alternative...')
        }

        try {
            if (method === 'tap' || method === 'all') {
                // Method 3: Tap outside keyboard area
                const { width, height } = await driver.getWindowSize()
                await driver.touchPerform([{
                    action: 'tap',
                    options: { x: Math.floor(width / 2), y: Math.floor(height * 0.1) }
                }])
                console.log('✅ Keyboard hidden using tap outside')
            }
        } catch (e) {
            console.log('Tap outside failed')
        }
    }

    /**
     * Input value to EditText with multiple fallback strategies and auto-hide keyboard
     * @param value Value to input
     * @param options Search options with multiple fallback strategies
     */
    public async setEditTextRobust(value: string, options: {
        resourceId?: string,
        contentDesc?: string,
        label?: string,
        hint?: string,
        index?: number,
        xpath?: string,
        hideKeyboard?: boolean,           // Auto-hide keyboard (default: true)
        keyboardMethod?: 'back' | 'native' | 'tap' | 'all'  // Method to hide keyboard
    }) {
        const { hideKeyboard = true, keyboardMethod = 'back', ...searchOptions } = options
        
        const element = await this.findEditTextRobust(searchOptions)
        await element.waitForDisplayed({ timeout: 5000 })
        await element.click()
        await element.setValue(value)
        await browser.pause(500)
        
        // Auto-hide keyboard if enabled
        if (hideKeyboard) {
            await this.hideKeyboard(keyboardMethod)
        }
    }

    /**
     * ⭐ STRICT HINT-BASED METHOD - NO INDEX FALLBACK
     * 
     * Find EditText ONLY by hint attribute (no index fallback)
     * Use this when you want to ensure your test is maintainable and won't break
     * from UI position changes.
     * 
     * ✅ Benefits:
     * - Semantic identification (based on meaning, not position)
     * - Resistant to UI changes (adding/removing fields won't break tests)
     * - Self-documenting (hint text shows what field you're targeting)
     * 
     * ⚠️ Requirement:
     * - Element MUST have hint/content-desc attribute in Appium Inspector
     * - Will throw error if not found (no silent fallback to unreliable methods)
     * 
     * @param hintText Exact hint text from Appium Inspector
     * @param scrollable Whether to scroll while searching (default: true)
     * @returns Promise<ChainablePromiseElement>
     * @throws Error if element not found by hint
     * 
     * @example
     * // Find field by hint "Jumlah Anak"
     * const field = await page.findEditTextByHintStrict("Jumlah Anak")
     * await field.setValue("2")
     */
    public async findEditTextByHintStrict(hintText: string, scrollable: boolean = true): Promise<ChainablePromiseElement> {
        console.log(`🔒 STRICT MODE: Finding EditText by hint ONLY: "${hintText}"`)
        console.log('    No index fallback - will fail if hint not found')
        
        try {
            const element = await this.findEditTextByHint(hintText, scrollable)
            console.log(`✅ SUCCESS: Found element by hint "${hintText}"`)
            return element
        } catch (error) {
            console.error(`❌ STRICT MODE FAILED: Element with hint "${hintText}" not found`)
            console.error('    💡 Tips to fix:')
            console.error('       1. Verify hint text in Appium Inspector is exactly: ' + hintText)
            console.error('       2. Check if hint is exposed as content-desc or text attribute')
            console.error('       3. Try using findEditTextByHintPartial() for partial matches')
            throw new Error(`[STRICT MODE] EditText with hint "${hintText}" not found. No fallback to index allowed.`)
        }
    }

    /**
     * ⭐ STRICT HINT-BASED METHOD WITH PARTIAL MATCH
     * 
     * Find EditText by partial hint text (contains) - NO INDEX FALLBACK
     * Useful when hint text is long or has dynamic parts
     * 
     * @param hintPartial Partial hint text to search for
     * @param scrollable Whether to scroll while searching (default: true)
     * @returns Promise<ChainablePromiseElement>
     * @throws Error if element not found
     * 
     * @example
     * // Find field containing "Jumlah" in hint
     * const field = await page.findEditTextByHintPartial("Jumlah")
     */
    public async findEditTextByHintPartial(hintPartial: string, scrollable: boolean = true): Promise<ChainablePromiseElement> {
        console.log(`🔍 Finding EditText by partial hint: "${hintPartial}"`)
        
        // Try content-desc contains
        try {
            const xpath = `//android.widget.EditText[contains(@content-desc, "${hintPartial}")]`
            const element = await $(xpath)
            await element.waitForExist({ timeout: 3000 })
            if (await element.isDisplayed()) {
                console.log(`✅ Found by content-desc contains "${hintPartial}"`)
                return element
            }
        } catch (e) {
            console.log('❌ Content-desc partial match not found')
        }

        // Try text contains
        try {
            const xpath = `//android.widget.EditText[contains(@text, "${hintPartial}")]`
            const element = await $(xpath)
            await element.waitForExist({ timeout: 3000 })
            if (await element.isDisplayed()) {
                console.log(`✅ Found by text contains "${hintPartial}"`)
                return element
            }
        } catch (e) {
            console.log('❌ Text partial match not found')
        }

        // Try UiAutomator scrollable if requested
        if (scrollable) {
            try {
                const safeHint = this.escapeUiSelectorString(hintPartial)
                const selector = `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().className("android.widget.EditText").descriptionContains("${safeHint}"))`
                const element = await $(selector)
                await element.waitForExist({ timeout: 3000 })
                console.log(`✅ Found by UiAutomator scrollable`)
                return element
            } catch (e) {
                console.log('❌ UiAutomator scrollable not found')
            }
        }

        throw new Error(`EditText with partial hint "${hintPartial}" not found`)
    }

    /**
     * ⭐ SET VALUE USING HINT ONLY - MOST MAINTAINABLE METHOD
     * 
     * Input value to EditText using ONLY hint attribute (no index)
     * This is the RECOMMENDED method for maintainable, robust tests
     * 
     * @param hintText Exact hint text from Appium Inspector  
     * @param value Value to input
     * @param options Additional options
     * 
     * @example
     * // Recommended usage - semantic and maintainable
     * await page.setEditTextByHintStrict("Jumlah Anak", "2")
     * 
     * // With options
     * await page.setEditTextByHintStrict("Email", "test@example.com", {
     *   scrollable: true,
     *   hideKeyboard: true,
     *   keyboardMethod: 'back'
     * })
     */
    public async setEditTextByHintStrict(
        hintText: string,
        value: string,
        options: {
            scrollable?: boolean,
            hideKeyboard?: boolean,
            keyboardMethod?: 'back' | 'native' | 'tap' | 'all'
        } = {}
    ) {
        const { scrollable = true, hideKeyboard = true, keyboardMethod = 'back' } = options
        
        console.log(`📝 Setting value "${value}" to field with hint "${hintText}"`)
        
        const element = await this.findEditTextByHintStrict(hintText, scrollable)
        await element.waitForDisplayed({ timeout: 5000 })
        await element.click()
        await browser.pause(300)
        await element.setValue(value)
        await browser.pause(500)
        
        if (hideKeyboard) {
            await this.hideKeyboard(keyboardMethod)
        }
        
        console.log(`✅ Successfully set value to field with hint "${hintText}"`)
    }
}
