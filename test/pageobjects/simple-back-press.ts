import { browser } from '@wdio/globals'

describe('Simple Back Button Press 5 Times', () => {
    it('should press back button 5 times - Simple Method', async () => {
        console.log('=== Menekan tombol Back sebanyak 5 kali ===')
        
        // Method 1: Simple loop dengan pressKeyCode
        for (let i = 0; i < 5; i++) {
            await browser.pressKeyCode(4) // KEYCODE_BACK = 4
            await browser.pause(500) // Jeda 500ms antar penekanan
            console.log(`Back button ditekan ${i + 1}/5 kali`)
        }
        
        console.log('✓ Selesai menekan back button 5 kali')
        await browser.pause(2000)
    })

    it('should press back button 5 times - One Liner Method', async () => {
        console.log('=== Method One Liner ===')
        
        // Method 2: One liner dengan Promise.all (tidak disarankan karena terlalu cepat)
        // await Promise.all([
        //     browser.pressKeyCode(4), browser.pressKeyCode(4), browser.pressKeyCode(4),
        //     browser.pressKeyCode(4), browser.pressKeyCode(4)
        // ])
        
        // Method 2 yang lebih baik: Sequential dengan delay
        await browser.pressKeyCode(4); await browser.pause(500)
        await browser.pressKeyCode(4); await browser.pause(500)
        await browser.pressKeyCode(4); await browser.pause(500)
        await browser.pressKeyCode(4); await browser.pause(500)
        await browser.pressKeyCode(4); await browser.pause(500)
        
        console.log('✓ Selesai menekan back button 5 kali dengan one liner')
    })

    it('should press back button 5 times with driver reference', async () => {
        console.log('=== Menggunakan driver reference ===')
        
        // Method 3: Menggunakan driver reference (seperti di file Anda)
        const driver = browser
        
        for (let i = 0; i < 5; i++) {
            await driver.pressKeyCode(4)
            await driver.pause(500)
            console.log(`Driver pressed back button ${i + 1}/5 times`)
        }
        
        console.log('✓ Selesai menggunakan driver reference')
    })
})
