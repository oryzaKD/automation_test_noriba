// import { expect } from '@wdio/globals'
import Page from '../pageobjects/page';

describe('Request Limit', () => {
  let page: Page

  before(async () => {
    page = new Page()
  })

  it("login App Noriba", async () => {
    const noribaElement = await $('//android.widget.TextView[@content-desc="Noriba"]');
    const noHp = "082339582790";
    const password = "Test123!";

    if (await noribaElement.isDisplayed()) {
      await noribaElement.click();
      console.log('Noriba element clicked!');
      await driver.pause(3000)

      // Allow permission notification
      await $('//android.widget.Button[@resource-id="com.android.permissioncontroller:id/permission_allow_button"]').click()

      // Click button masuk
      await $('//android.widget.Button[@content-desc="Buat Akun/Masuk"]').click()
      await driver.pause(3000)

      //Login with wrong username
      await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[1]').click();
      await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[1]').setValue(noHp);
      //Login with wrong password
      await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[2]').click();
      await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.EditText[2]').setValue(password);
      await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.ImageView[4]').click()
      await driver.pause(3000)
      await $('//android.widget.Button[@content-desc="Masuk"]').click()
      await driver.pause(3000)
      const buttonIzinkan = await $('//android.widget.Button[@content-desc="Izinkan"]');
      await buttonIzinkan.click()
      await driver.pause(3000)
      // Button Izinkan tertutup navigasi
      const btn = await $('//android.widget.Button[@content-desc="Izinkan"]');
      await btn.waitForDisplayed({ timeout: 10000 });

      const { x, y } = await btn.getLocation();
      const { width, height } = await btn.getSize();
      const tapX = Math.round(x + width / 2);
      const tapY = Math.round(y + height / 2 - 40); // geser 40px ke atas

      await driver.performActions([{
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: tapX, y: tapY },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: 100 },
          { type: 'pointerUp', button: 0 },
        ],
      }]);
      await driver.releaseActions();
      await driver.pause(5000)

    } else {
      console.log('Noriba element is not visible!');
      console.log('OKEEE');
    }
  });

  it('Berhasil Menggunakan Fitur Kamera dan Melakukan OCR dengan Upload KTP ke app', async () => {
    await $('//android.widget.Button[@content-desc="Ajukan Limit"]').click()

    //Klik button Ajukan Limit ke Funder Visicloud
    await $('(//android.widget.Button[@content-desc="Ajukan"])[1]').click()

    //Klik foto KTP
    await $('//android.widget.ScrollView/android.view.View[6]').click()
    await $('//android.widget.Button[@resource-id="com.android.permissioncontroller:id/permission_allow_foreground_only_button"]').click()
    await $('//android.widget.Button[@content-desc="Lanjutkan"]').click()
    await driver.pause(5000)
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.Button[1]').click()
    await driver.pause(5000)
    // Button centang capture KTP tertutup navigasi
    const btn = await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.Button[2]');
    await btn.waitForDisplayed({ timeout: 10000 });

    const { x, y } = await btn.getLocation();
    const { width, height } = await btn.getSize();
    const tapX = Math.round(x + width / 2);
    const tapY = Math.round(y + height / 2 - 40); // geser 40px ke atas

    await driver.performActions([{
      type: 'pointer',
      id: 'finger1',
      parameters: { pointerType: 'touch' },
      actions: [
        { type: 'pointerMove', duration: 0, x: tapX, y: tapY },
        { type: 'pointerDown', button: 0 },
        { type: 'pause', duration: 100 },
        { type: 'pointerUp', button: 0 },
      ],
    }]);
    await driver.releaseActions();
    await driver.pause(5000)
  })

  it("Melakukan Gesture Active Liveness", async () => {
    //Klik foto Selfie
    await $('//android.widget.ScrollView/android.view.View[7]').click()
    await $('//android.widget.Button[@content-desc="Lanjut"]').click()
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.Button[1]').click()
    await driver.pause(5000)
    // Button centang capture Selfie tertutup navigasi
    const btn = await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.Button[2]');
    await btn.waitForDisplayed({ timeout: 10000 });

    const { x, y } = await btn.getLocation();
    const { width, height } = await btn.getSize();
    const tapX = Math.round(x + width / 2);
    const tapY = Math.round(y + height / 2 - 40); // geser 40px ke atas
    await driver.performActions([{
      type: 'pointer',
      id: 'finger1',
      parameters: { pointerType: 'touch' },
      actions: [
        { type: 'pointerMove', duration: 0, x: tapX, y: tapY },
        { type: 'pointerDown', button: 0 },
        { type: 'pause', duration: 100 },
        { type: 'pointerUp', button: 0 },
      ],
    }]);
    await driver.releaseActions();
    await driver.pause(5000)

    //Klik Active Liveness
    // await $('//android.widget.Button[@content-desc="Lanjutkan"]').click()
    // await driver.pause(8000)
  });

  it("Input Identitas KTP", async () => {
    const elementXPath = '//android.widget.ScrollView/android.widget.EditText[1]'
    const element = await page.scrollToBottomFindElement(elementXPath, 15)
    await element.click()
    await element.setValue("Wahyuni Nur Fauziah")
    await $('//android.widget.ScrollView/android.widget.EditText[2]').click()
    await $('//android.widget.ScrollView/android.widget.EditText[2]').setValue("1805305007930002")
    await $('//android.widget.ScrollView/android.widget.EditText[3]').click()
    await $('//android.widget.ScrollView/android.widget.EditText[3]').setValue("Surabaya")
    await $('//android.view.View[@content-desc="Tanggal Lahir"]').click()
    await driver.pause(1000)
    await $('//android.widget.Button[@content-desc="OK"]').click()
    await $('//android.view.View[@content-desc="Pilih Jenis Kelamin"]').click()
    // Button Perempuan tertutup navigasi
    const btn = await $('//android.view.View[@content-desc="Perempuan"]');
    await btn.waitForDisplayed({ timeout: 10000 });

    const { x, y } = await btn.getLocation();
    const { width, height } = await btn.getSize();
    const tapX = Math.round(x + width / 2);
    const tapY = Math.round(y + height / 2 - 40); // geser 40px ke atas

    await driver.performActions([{
      type: 'pointer',
      id: 'finger1',
      parameters: { pointerType: 'touch' },
      actions: [
        { type: 'pointerMove', duration: 0, x: tapX, y: tapY },
        { type: 'pointerDown', button: 0 },
        { type: 'pause', duration: 100 },
        { type: 'pointerUp', button: 0 },
      ],
    }]);
    await driver.releaseActions();
    await page.pressBackButtonMultiple(1)
  })

  it("Input Alamat KTP", async () => {
    await page.scrollAndFindElement("Lanjut", "description");
    await $('//android.view.View[@content-desc="Pilih Provinsi"]').click()
    await $('//android.view.View[@content-desc="Sumatera Barat"]').click()
    await driver.pause(2000)
    await page.pressBackButtonMultiple(1)
    await $('//android.view.View[@content-desc="Pilih Kota/Kabupaten"]').click()
    await $('//android.view.View[@content-desc="Kabupaten Solok"]').click()
    await driver.pause(2000)
    await page.pressBackButtonMultiple(1)
    await $('//android.view.View[@content-desc="Pilih Kecamatan"]').click()
    await $('//android.view.View[@content-desc="Pantai Cermin"]').click()
    await driver.pause(2000)
    await page.pressBackButtonMultiple(1)
    await $('//android.view.View[@content-desc="Pilih Kelurahan"]').click()
    await $('//android.view.View[@content-desc="Lolo"]').click()
    await driver.pause(2000)
    await page.pressBackButtonMultiple(1)
    await page.scrollAndFindElement("Lanjut", "description");
    await page.setEditTextByIndex(7, "Jl. Raya Surabaya No. 123")
    await $('//android.widget.Button[@content-desc="Lanjut"]').click()
    await driver.pause(2000)
  })

  // it("Ganti Parent Data Dropdown Alamat", async () => {
  //   // Coba metode UiScrollable (lebih stabil & cepat) untuk menemukan "Pilih Kota/Kabupaten"
  //   try {
  //     const penyimpananEl = await page.androidScrollIntoViewByText('Pilih Kota/Kabupaten')
  //     await penyimpananEl.click()
  //   } catch (_e) {
  //     // Fallback: scroll manual hingga elemen ditemukan
  //     const targetSelector = '//android.view.View[@content-desc="Pilih Kota/Kabupaten"]'
  //     const targetElement = await page.scrollToBottomFindElement(targetSelector, 20)
  //     await targetElement.click()
  //   }

  //   await $('//android.view.View[@content-desc="Pilih Kota/Kabupaten"]').click()
  //   await $('//android.view.View[@content-desc="Kabupaten Ponorogo"]').click()
  //   await driver.pause(2000)
  //   await $('//android.view.View[@content-desc="Pilih Kecamatan"]').click()
  //   await $('//android.view.View[@content-desc="Bungkal"]').click()
  //   await driver.pause(2000)
  //   await $('//android.view.View[@content-desc="Pilih Kelurahan"]').click()
  //   await $('//android.view.View[@content-desc="Koripan"]').click()
  //   await driver.pause(2000)

  //   // Ganti Parent Data Dropdown Alamat
  //   await $('//android.view.View[@content-desc="Jawa Timur"]').click()
  //   await $('//android.view.View[@content-desc="Aceh"]').click()
  //   await driver.pause(2000)
  //   await $('//android.view.View[@content-desc="Pilih Kota/Kabupaten"]').click()
  //   await $('//android.view.View[@content-desc="Kabupaten Aceh Tenggara"]').click()
  //   await driver.pause(2000)
  //   await $('//android.view.View[@content-desc="Pilih Kecamatan"]').click()
  //   await $('//android.view.View[@content-desc="Lawe Alas"]').click()
  //   await driver.pause(2000)
  //   await $('//android.view.View[@content-desc="Pilih Kelurahan"]').click()
  //   await $('//android.view.View[@content-desc="Engkeran"]').click()
  // })

  // it("Alamat Domisili Tidak Sesuai KTP", async () => {
  //   await $('//android.widget.Button[@content-desc="Tidak"]').click()

  //   // Coba metode UiScrollable (lebih stabil & cepat) untuk menemukan "Pilih Kota/Kabupaten"
  //   try {
  //     const penyimpananEl = await page.androidScrollIntoViewByText('Pilih Provinsi')
  //     await penyimpananEl.click()
  //   } catch (_e) {
  //     // Fallback: scroll manual hingga elemen ditemukan
  //     const targetSelector = '//android.view.View[@content-desc="Pilih Provinsi"]'
  //     const targetElement = await page.scrollToBottomFindElement(targetSelector, 20)
  //     await targetElement.click()
  //   }

  //   //  Ganti Parent Data Dropdown Alamat
  //   await $('//android.view.View[@content-desc="Sumatera Utara"]').click()
  //   await driver.pause(2000)
  //   await $('//android.view.View[@content-desc="Pilih Kota/Kabupaten"]').click()
  //   await $('//android.view.View[@content-desc="Kabupaten Tapanuli Tengah"]').click()
  //   await driver.pause(2000)
  //   await $('//android.view.View[@content-desc="Pilih Kecamatan"]').click()
  //   await $('//android.view.View[@content-desc="Barus"]').click()
  //   await driver.pause(2000)
  //   await $('//android.view.View[@content-desc="Pilih Kelurahan"]').click()
  //   await $('//android.view.View[@content-desc="Pasar Batu Gerigis"]').click()
  //   await driver.pause(2000)
  // })

  // it("Mengosongkan Form Data KTP & Mengisi Form Data KTP dengan Data Tidak Valid", async () => {
  //   //  Mengosongkan Form Data KTP
  //   await $('//android.widget.Button[@content-desc="Lanjut"]').click()

  //   await page.scrollAndFindElement("tidak boleh kosong", "description");

  //   const inputanKosong = await $('//android.view.View[@content-desc="tidak boleh kosong"]');
  //   await expect(inputanKosong).toBeDisplayed();

  //   // Verify the content-desc attribute contains the expected text
  //   const contentDescInputanKosong = await inputanKosong.getAttribute('content-desc');
  //   await expect(contentDescInputanKosong).toBe("tidak boleh kosong");

  //   // isi form data ktp
  //   await $('//android.widget.ScrollView/android.widget.EditText[2]').click()
  //   await $('//android.widget.EditText').setValue("Jl Pahlawan No 15")
  //   await page.pressImeNext()

  //   //  Mengisi Form Data KTP dengan Data Tidak Valid
  //   await page.scrollAndFindElement("WAHYUNI", "text");
  //   await $('//android.widget.EditText[@text="WAHYUNI"]').click()
  //   await $('//android.widget.EditText[@text="WAHYUNI"]').setValue("WAHYUNI 123")
  //   await page.pressImeNext()

  //   await page.scrollAndFindElement("Lanjut", "description");
  //   await $('//android.widget.Button[@content-desc="Lanjut"]').click()

  //   await page.scrollAndFindElement("Masukkan dengan isian yang benar", "description");

  //   const inputanTidakValid = await $('//android.view.View[@content-desc="Masukkan dengan isian yang benar"]');
  //   await expect(inputanTidakValid).toBeDisplayed();

  //   // Verify the content-desc attribute contains the expected text
  //   const contentDescTidakValid = await inputanTidakValid.getAttribute('content-desc');
  //   await expect(contentDescTidakValid).toBe("Masukkan dengan isian yang benar");

  //   await $('//android.widget.EditText[@text="WAHYUNI 123"]').click()
  //   await $('//android.widget.EditText[@text="WAHYUNI 123"]').setValue("Test WAHYUNI")
  //   await page.pressImeNext()

  //   await page.scrollAndFindElement("Lanjut", "description");
  //   await $('//android.widget.Button[@content-desc="Lanjut"]').click()
  //   await driver.pause(5000)
  // })

  it("Input Data Pribadi", async () => {
    await $('//android.view.View[@content-desc="Pilih Status Pernikahan"]').click()
    await $('//android.view.View[@content-desc="Belum Menikah"]').click()

    await page.setEditTextByIndex(5, "0")
    await page.setEditTextByIndex(7, "Siti Aminah")
    await $('//android.view.View[@content-desc="Pilih Pendidikan Terakhir"]').click()
    await $('//android.view.View[@content-desc="SMA"]').click()
    await driver.pause(1000)
    await page.pressBackButtonMultiple(1)

    // Kontak Darurat
    await $('//android.view.View[@content-desc="Pilih Hubungan Keluarga"]').click()
    await $('//android.view.View[@content-desc="Adik"]').click()
    await driver.pause(1000)
    await page.pressBackButtonMultiple(1)

    await page.setEditTextByIndex(11, "Andi Soraya")
    await page.setEditTextByIndex(7, "083838383838")

    // Kebutuhan Limit
    await page.setEditTextByIndex(8, "1000000")
    await $('//android.view.View[@content-desc="Pilih Jenis Barang yang Dibeli"]').click()
    await $('//android.view.View[@content-desc="Sembako"]').click()
    await driver.pause(1000)
    await page.pressBackButtonMultiple(1)

    await $('//android.widget.Button[@content-desc="Lanjut"]').click()
    await driver.pause(2000)
  })

  // it("Mengosongkan Form Data Diri dan Mengisi Form Data Pekerjaan & Keuangan dengan Data Tidak Valid", async () => {
  //   //  Mengosongkan Form Data Diri
  //   await $('//android.widget.Button[@content-desc="Lanjut"]').click()
  //   await $('//android.widget.ScrollView/android.widget.EditText[3]').click()
  //   await $('//android.widget.ScrollView/android.widget.EditText[3]').setValue("1000000")

  //   await page.scrollAndFindElement("tidak boleh kosong", "description");

  //   const inputanKosong = await $('//android.view.View[@content-desc="Tidak boleh kosong"]');
  //   await expect(inputanKosong).toBeDisplayed();

  //   // Verify the content-desc attribute contains the expected text
  //   const contentDescInputanKosong = await inputanKosong.getAttribute('content-desc');
  //   await expect(contentDescInputanKosong).toBe("Tidak boleh kosong");
  // })

  it("Input Data Pekerjaan dan Keuangan", async () => {
    await $('//android.view.View[@content-desc="Pilih Status Pekerjaan"]').click()
    await $('//android.view.View[@content-desc="Pekerja Penuh Waktu"]').click()

    await $('//android.view.View[@content-desc="Pilih Posisi Pekerjaan"]').click()
    await $('//android.view.View[@content-desc="Staff"]').click()

    await page.setEditTextByIndex(6, "PT Abc")
    
    await $('//android.view.View[@content-desc="Pilih Lama Bekerja"]').click()
    await $('//android.view.View[@content-desc="6 bulan"]').click()
    await driver.pause(1000)
    await page.pressBackButtonMultiple(1)

    // Keuangan
    await page.setEditTextByIndex(9, "8000000")
    await page.setEditTextByIndex(7, "5000000")
    await page.setEditTextByIndex(8, "1000000")

    // Centang Syarat dan Ketentuan
    await $('//android.widget.CheckBox').click()
    await $('//android.widget.Button[@content-desc="Lanjut"]').click()
    await driver.pause(4000)
    await $('//android.widget.Button[@content-desc="Lanjutkan"]').click()
    await driver.pause(4000)
    // await driver.pause(2000)
  })

})

