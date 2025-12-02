# 🎯 Hint-Based Element Finding - Quick Examples

## 📋 Table of Contents
1. [Basic Usage](#basic-usage)
2. [Advanced Usage](#advanced-usage)
3. [Migration Examples](#migration-examples)
4. [Common Patterns](#common-patterns)
5. [Troubleshooting](#troubleshooting)

---

## Basic Usage

### ✅ Recommended Method - Strict Hint Only

```typescript
// Paling maintainable - HANYA menggunakan hint, tidak fallback ke index
await page.setEditTextByHintStrict("Jumlah Anak", "2")
await page.setEditTextByHintStrict("Email", "test@example.com")
await page.setEditTextByHintStrict("Nomor Telepon", "081234567890")
```

**Kapan menggunakan:**
- ✅ Hint tersedia di Appium Inspector
- ✅ Production tests yang harus maintainable
- ✅ CI/CD tests yang harus stable

---

### ⚡ Flexible Method - With Fallbacks

```typescript
// Punya fallback strategies, tapi hint tetap prioritas
await page.setEditTextRobust("2", {
  hint: "Jumlah Anak",        // Priority 1 (paling reliable)
  contentDesc: "Jumlah Anak", // Priority 2
  label: "Berapa jumlah",     // Priority 3
  index: 0                     // Priority 6 (last resort)
})
```

**Kapan menggunakan:**
- ⚠️  Hint mungkin tidak selalu tersedia
- ⚠️  Development/exploration phase
- ⚠️  Need multiple fallback options

---

## Advanced Usage

### 🔍 Partial Hint Match

Gunakan saat hint text panjang atau punya bagian dynamic:

```typescript
// Cari field yang MENGANDUNG "Email" di hint-nya
await page.findEditTextByHintPartial("Email")

// Cari field yang mengandung "Alamat"
const field = await page.findEditTextByHintPartial("Alamat")
await field.setValue("Jl. Sudirman No. 123")
```

---

### 🎛️ With Custom Options

```typescript
// Control scrolling, keyboard hiding, dan method
await page.setEditTextByHintStrict("Email", "test@example.com", {
  scrollable: true,         // Auto-scroll mencari element (default: true)
  hideKeyboard: true,       // Auto-hide keyboard (default: true)
  keyboardMethod: 'back'    // Method: 'back', 'native', 'tap', 'all'
})
```

---

### 🔄 Manual Control

Jika perlu kontrol penuh setelah find element:

```typescript
// Find dulu, baru action manual
const field = await page.findEditTextByHintStrict("Jumlah Anak")
await field.click()
await field.setValue("2")
await page.hideKeyboard('back')

// Verify
const value = await field.getText()
expect(value).toBe("2")
```

---

## Migration Examples

### ❌ Before: Index-Based (Fragile)

```typescript
it("Fill registration form", async () => {
  // MASALAH: Tidak jelas field apa yang di-isi
  // Akan rusak jika ada field baru ditambah/dihapus
  await page.setEditTextByIndex(0, "John Doe")
  await page.setEditTextByIndex(1, "john@example.com")
  await page.setEditTextByIndex(2, "081234567890")
  await page.setEditTextByIndex(3, "Jakarta")
})
```

**Problems:**
- ❌ Tidak semantic - tidak jelas field mana
- ❌ Fragile - rusak jika posisi berubah
- ❌ Hard to maintain - sulit debug
- ❌ Hard to read - butuh comment banyak

---

### ✅ After: Hint-Based (Maintainable)

```typescript
it("Fill registration form", async () => {
  // JELAS dan SEMANTIC - langsung tahu field apa
  // Resistant terhadap UI changes
  await page.setEditTextByHintStrict("Nama Lengkap", "John Doe")
  await page.setEditTextByHintStrict("Email", "john@example.com")
  await page.setEditTextByHintStrict("Nomor Telepon", "081234567890")
  await page.setEditTextByHintStrict("Kota", "Jakarta")
})
```

**Benefits:**
- ✅ Self-documenting - jelas field mana yang di-target
- ✅ Maintainable - tidak rusak saat UI berubah
- ✅ Easy to debug - error message jelas
- ✅ Easy to read - tidak butuh comment

---

### 🔄 Transition: Robust Method

Saat masih exploring atau hint belum confirm:

```typescript
it("Fill registration form", async () => {
  // Hint prioritized, tapi punya fallback
  await page.setEditTextRobust("John Doe", {
    hint: "Nama Lengkap",     // ✅ Priority 1
    contentDesc: "Nama",      // Fallback 1
    label: "Masukkan nama",   // Fallback 2
    index: 0                   // ⚠️  Last resort
  })
  
  await page.setEditTextRobust("john@example.com", {
    hint: "Email",
    index: 1
  })
})
