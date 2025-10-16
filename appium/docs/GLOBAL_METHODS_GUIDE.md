# Global Methods Guide - page.ts Helper Functions

## 📚 Daftar Method Global yang Tersedia

Semua method ini sudah ditambahkan ke file `appium/test/pageobjects/page.ts` dan bisa digunakan di semua test file.

---

## 🎯 Method Baru yang Ditambahkan

### 1. `scrollAndFindElement()` - Universal Scroll & Find

```typescript
public async scrollAndFindElement(
  selector: string, 
  type: 'text' | 'description' | 'resourceId' = 'text'
)
```

**Deskripsi:**
Method universal untuk scroll dan cari element berdasarkan text, content-desc, atau resource-id.

**Parameter:**
- `selector` (string): Text/description/id yang dicari
- `type` (string): Tipe selector
  - `'text'` - untuk text attribute (default)
  - `'description'` - untuk content-desc attribute  
  - `'resourceId'` - untuk resource-id attribute

**Contoh Penggunaan:**

```typescript
// Cari element dengan content-desc "tidak boleh kosong"
const element1 = await page.scrollAndFindElement("tidak boleh kosong", 'description');

// Cari element dengan text "WAHYUNI"
const element2 = await page.scrollAndFindElement("WAHYUNI", 'text');
// atau (karena 'text' adalah default)
const element2 = await page.scrollAndFindElement("WAHYUNI");

// Cari element dengan resource-id
const element3 = await page.scrollAndFindElement("com.example:id/button", 'resourceId');
```

---

### 2. `androidScrollIntoViewByDescription()` - Exact Match Description

```typescript
public androidScrollIntoViewByDescription(description: string): ChainablePromiseElement
```

**Deskripsi:**
Scroll hingga element dengan **exact** content-desc ditemukan (tidak pakai contains).

**Contoh Penggunaan:**

```typescript
// Exact match - harus persis "tidak boleh kosong"
const element = await page.androidScrollIntoViewByDescription('tidak boleh kosong');
await expect(element).toBeDisplayed();
```

---

### 3. `findElementByContentDesc()` - Find by XPath

```typescript
public async findElementByContentDesc(desc: string)
```

**Deskripsi:**
Cari element menggunakan XPath dengan content-desc attribute.  
⚠️ **Tidak auto-scroll**, element harus sudah visible di screen.

**Contoh Penggunaan:**

```typescript
const element = await page.findElementByContentDesc("tidak boleh kosong");
// Sama dengan: await $('//android.view.View[@content-desc="tidak boleh kosong"]')

await expect(element).toBeDisplayed();
```

---

### 4. `findElementByText()` - Find Text by XPath

```typescript
public async findElementByText(text: string)
```

**Deskripsi:**
Cari TextView menggunakan XPath dengan text attribute.  
⚠️ **Tidak auto-scroll**, element harus sudah visible di screen.

**Contoh Penggunaan:**

```typescript
const element = await page.findElementByText("WAHYUNI");
// Sama dengan: await $('//android.widget.TextView[@text="WAHYUNI"]')

await expect(element).toBeDisplayed();
```

---

## 📖 Method yang Sudah Ada Sebelumnya

### 5. `androidScrollIntoViewByText()` - Scroll by Text

```typescript
public androidScrollIntoViewByText(text: string): ChainablePromiseElement
```

**Contoh:**
```typescript
const element = await page.androidScrollIntoViewByText('Lanjut');
```

---

### 6. `androidScrollIntoViewByTextContains()` - Scroll by Partial Text

```typescript
public androidScrollIntoViewByTextContains(textPart: string): ChainablePromiseElement
```

**Contoh:**
```typescript
const element = await page.androidScrollIntoViewByTextContains('tidak boleh');
```

---

### 7. `androidScrollIntoViewByDescriptionContains()` - Scroll by Partial Description

```typescript
public androidScrollIntoViewByDescriptionContains(descPart: string): ChainablePromiseElement
```

**Contoh:**
```typescript
const element = await page.androidScrollIntoViewByDescriptionContains('tidak boleh');
```

---

### 8. `centerElementOnScreen()` - Posisikan Element di Tengah

```typescript
public async centerElementOnScreen(el: any, tolerancePx: number = 20, maxTries: number = 8)
```

**Deskripsi:**
Memposisikan element di tengah screen (bukan di atas atau bawah sendiri).

**Contoh:**
```typescript
const element = await page.androidScrollIntoViewByDescriptionContains('tidak boleh kosong');
await page.centerElementOnScreen(element);
// Sekarang element berada di tengah screen!
```

---

## 🚀 Cara Menggunakan di Test File

### Setup di awal test:

```typescript
import Page from '../pageobjects/page';

describe('My Test Suite', () => {
  let page: Page

  before(async () => {
    page = new Page()  // Initialize page object
  })

  it('My test case', async () => {
    // Sekarang bisa gunakan semua method global dari page
    const element = await page.scrollAndFindElement("tidak boleh kosong", 'description');
    await expect(element).toBeDisplayed();
  })
})
```

---

## 💡 Best Practices & Recommendations

### ⭐ RECOMMENDED: Kombinasi Scroll + Center + Verify

```typescript
it("Best practice untuk find element di tengah screen", async () => {
  // 1. Scroll otomatis hingga element ditemukan
  const element = await page.androidScrollIntoViewByDescriptionContains('tidak boleh kosong');
  
  // 2. Posisikan element di tengah screen
  await page.centerElementOnScreen(element);
  
  // 3. Verify element terlihat
  await expect(element).toBeDisplayed();
  
  // 4. Verify content
  const contentDesc = await element.getAttribute('content-desc');
  await expect(contentDesc).toContain('tidak boleh kosong');
  
  console.log('✅ Element verified successfully!');
})
```

### ✅ Kapan Menggunakan Method Apa?

| Kebutuhan | Method yang Digunakan | Alasan |
|-----------|----------------------|---------|
| Cari content-desc + posisikan tengah | `androidScrollIntoViewByDescriptionContains()` + `centerElementOnScreen()` | Paling robust & element tidak tertutup navigation |
| Cari content-desc (simple) | `scrollAndFindElement(text, 'description')` | Universal, 1 method untuk semua type |
| Cari text | `scrollAndFindElement(text, 'text')` atau `androidScrollIntoViewByText()` | Auto-scroll hingga ketemu |
| Element sudah visible | `findElementByContentDesc()` atau `findElementByText()` | Lebih cepat, langsung XPath |
| Exact match content-desc | `androidScrollIntoViewByDescription()` | Tidak pakai contains |

---

## 🔥 Contoh Use Case Real

### Use Case 1: Validasi Error Message

```typescript
it("Verify error 'tidak boleh kosong' muncul", async () => {
  // Trigger error (misal klik submit tanpa isi form)
  await $('//android.widget.Button[@content-desc="Lanjut"]').click();
  await driver.pause(2000);
  
  // Cari error message + posisikan di tengah
  const errorMsg = await page.scrollAndFindElement("tidak boleh kosong", 'description');
  await page.centerElementOnScreen(errorMsg);
  
  // Verify
  await expect(errorMsg).toBeDisplayed();
  const text = await errorMsg.getAttribute('content-desc');
  expect(text).toContain('tidak boleh kosong');
  
  console.log('✅ Error message verified!');
})
```

### Use Case 2: Fill Form dengan Auto-scroll

```typescript
it("Fill form dengan auto scroll", async () => {
  // Cari field nama dan isi
  const namaField = await page.scrollAndFindElement("WAHYUNI", 'text');
  await namaField.click();
  await namaField.setValue("John Doe");
  
  // Cari button lanjut dan klik
  const btnLanjut = await page.scrollAndFindElement("Lanjut", 'description');
  await page.centerElementOnScreen(btnLanjut);
  await btnLanjut.click();
  
  console.log('✅ Form submitted!');
})
```

### Use Case 3: Try-Catch dengan Multiple Fallbacks

```typescript
it("Robust element finding dengan fallback", async () => {
  let element;
  
  try {
    // Try method 1: scrollAndFindElement
    element = await page.scrollAndFindElement("tidak boleh kosong", 'description');
    console.log('Method 1 success: scrollAndFindElement');
  } catch (e1) {
    try {
      // Fallback method 2: Direct XPath
      element = await page.findElementByContentDesc("tidak boleh kosong");
      console.log('Method 2 success: findElementByContentDesc');
    } catch (e2) {
      // Fallback method 3: Contains + Center
      element = await page.androidScrollIntoViewByDescriptionContains('tidak boleh');
      await page.centerElementOnScreen(element);
      console.log('Method 3 success: androidScrollIntoViewByDescriptionContains');
    }
  }
  
  await expect(element).toBeDisplayed();
})
```

---

## 📊 Comparison Table

| Method | Auto Scroll | Center Screen | Type Support | Speed | Use Case |
|--------|-------------|---------------|--------------|-------|----------|
| `scrollAndFindElement()` | ✅ | ❌ | text, desc, id | Medium | Universal, flexible |
| `androidScrollIntoViewByDescription()` | ✅ | ❌ | desc (exact) | Medium | Exact match needed |
| `androidScrollIntoViewByDescriptionContains()` | ✅ | ❌ | desc (partial) | Medium | Partial match OK |
| `findElementByContentDesc()` | ❌ | ❌ | desc | Fast | Element already visible |
| `centerElementOnScreen()` | ❌ | ✅ | any | Medium | Position element |

---

## 🎯 Summary

**Yang Sudah Ditambahkan ke `page.ts`:**

1. ✅ `scrollAndFindElement()` - Universal scroll & find (text/description/resourceId)
2. ✅ `androidScrollIntoViewByDescription()` - Exact match description
3. ✅ `findElementByContentDesc()` - XPath content-desc (no scroll)
4. ✅ `findElementByText()` - XPath text (no scroll)

**Best Practice:**

```typescript
// Pattern terbaik untuk element di tengah screen:
const el = await page.androidScrollIntoViewByDescriptionContains('text');
await page.centerElementOnScreen(el);
await expect(el).toBeDisplayed();
```

**Untuk Element `//android.view.View[@content-desc="tidak boleh kosong"]`:**

```typescript
// Option 1: scrollAndFindElement (NEW)
const el = await page.scrollAndFindElement("tidak boleh kosong", 'description');

// Option 2: androidScrollIntoViewByDescriptionContains (EXISTING)
const el = await page.androidScrollIntoViewByDescriptionContains('tidak boleh kosong');

// Option 3: findElementByContentDesc jika sudah visible (NEW)
const el = await page.findElementByContentDesc("tidak boleh kosong");

// Best practice: Option 2 + centerElementOnScreen
const el = await page.androidScrollIntoViewByDescriptionContains('tidak boleh kosong');
await page.centerElementOnScreen(el);
```

---

## 📝 File Contoh

Lihat file contoh lengkap di:
- `appium/test/specs/7-requestLimit-example.ts`

Run example test:
```bash
npx wdio run wdio.conf.ts --spec appium/test/specs/7-requestLimit-example.ts
```

---

## 🐛 Troubleshooting

**Error: "scrollAndFindElement is not a function"**
- Pastikan sudah initialize: `page = new Page()` di `before()` hook
- Import: `import Page from '../pageobjects/page'`

**Element tidak ketemu:**
- Cek case sensitivity (HURUF BESAR vs huruf kecil)
- Gunakan `'description'` untuk content-desc, `'text'` untuk text attribute
- Try dengan `contains` version untuk partial match

**Element tertutup navigation bar:**
- Gunakan `centerElementOnScreen()` untuk posisikan di tengah

---

Selamat menggunakan! 🎉


