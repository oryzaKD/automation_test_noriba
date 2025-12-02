import { expect } from '@wdio/globals'
import Page from '../pageobjects/page';

describe('Request Product', () => {
  let page: Page

  before(async () => {
    page = new Page()
  })

  it("login App Noriba", async () => {
    const noribaElement = await $('//android.widget.TextView[@content-desc="Noriba"]');
    const noHp = "088905450134";
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

    } else {
      console.log('Noriba element is not visible!');
      console.log('OKEEE');
    }
  });

  it('Masuk ke step pengajuan produk', async () => {
    await $('//android.widget.ImageView[@content-desc="Request Produk"]').click()
    //  Button "Lanjutkan" mengarah ke halaman selanjutnya
    await $('//android.widget.Button[@content-desc="Lanjutkan"]').click()
    //  Button Previous (Arrow Left) mengarah ke halaman sebelumnya
    await $('//android.view.View[@content-desc="Cara Belanja"]').click()
    //  Button Close (X) mengarah ke Home
    await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[2]').click()
    await $('//android.widget.ImageView[@content-desc="Request Produk"]').click()
    //  Button Skip mengarah ke halaman terakhir tutorial
    await $('//android.widget.Button[@content-desc="Skip"]').click()
    //  Button Tanya CS mengarah ke Whatsapp Noriba
    await $('//android.widget.Button[@content-desc="Tanya CS"]').click()
    await driver.pause(3000)
    await page.pressBackButtonMultiple(2)
    //  Button Buat Pesanan untuk mengajukan produk
    await $('//android.widget.Button[@content-desc="Buat Pesanan"]').click()
    //  Button "Lihat Disini"
    //  User ingin melihat syarat pemesanan sebelum pengajuan produk
    await $('//android.widget.Button[@content-desc=" Lihat disini"]').click()
    await $('//android.view.View[@content-desc="Lihat persyaratan pemesanan"]').click()
    await $('//android.widget.Button').click()
    await page.pressBackButtonMultiple(1)
    //  Button "Butuh Bantuan"
    await $('//android.widget.ImageView[@content-desc="Butuh Bantuan"]').click()
    await driver.pause(3000)
    await page.pressBackButtonMultiple(2)
  })

  it("Mengajukan produk dengan data valid", async () => {
    //  Saat pengajuan produk, pada field link input selain format url
    await $(`//android.widget.ImageView[@content-desc="Produk 1\nBerikan detail produk yang ingin kamu pesan\nLink Katalog Produk\n*\nFoto Katalog Produk\n*\nPenjelasan Tambahan"]/android.widget.EditText[1]`).setValue("www.shopee.com");
    // Mengajukan produk dengan data valid
    await $(`//android.widget.ImageView[@content-desc="Produk 1\nBerikan detail produk yang ingin kamu pesan\nLink Katalog Produk\n*\nFoto Katalog Produk\n*\nPenjelasan Tambahan"]/android.widget.EditText[1]`).setValue("https://id.shp.ee/7WG121Q");
    //  Mengajukan produk dengan tidak mengisi penjelasan tambahan (opsional)
    //  Mengajukan produk dengan pilih gambar dari galeri
    await $(`//android.view.View[@content-desc="Tekan untuk upload"]`).click();
    await $('//android.widget.Button[@content-desc="Galeri"]').click();
    await $('//androidx.compose.ui.platform.ComposeView/android.view.View/android.view.View/android.view.View[4]/android.widget.Button').click();
    await $('//androidx.compose.ui.platform.ComposeView/android.view.View/android.view.View/android.view.View[5]/android.view.View[4]/android.view.View').click();
    //  Mengajukan produk dengan 2-5 gambar
    await $(`//androidx.compose.ui.platform.ComposeView/android.view.View/android.view.View/android.view.View[4]/android.view.View[1]/android.view.View[2]/android.view.View`).click();
    await $(`//androidx.compose.ui.platform.ComposeView/android.view.View/android.view.View/android.view.View[4]/android.view.View[2]/android.view.View[2]/android.view.View`).click();
    await $(`//androidx.compose.ui.platform.ComposeView/android.view.View/android.view.View/android.view.View[4]/android.view.View[3]/android.view.View[2]/android.view.View`).click();
    await $(`//androidx.compose.ui.platform.ComposeView/android.view.View/android.view.View/android.view.View[4]/android.view.View[4]/android.view.View[2]/android.view.View`).click();
    await $(`//androidx.compose.ui.platform.ComposeView/android.view.View/android.view.View/android.view.View[5]/android.view.View[3]/android.widget.Button`).click();
    await driver.pause(2000)
    //  Mengajukan produk dengan gambar dari kamera
    await $(`//android.view.View[@content-desc="Tekan untuk upload"]`).click();
    await $('//android.widget.Button[@content-desc="Kamera"]').click();
    await $('//android.widget.Button[@resource-id="com.android.permissioncontroller:id/permission_allow_foreground_only_button"]').click();
    await $('//android.widget.RelativeLayout[@resource-id="com.sec.android.app.camera:id/shutter_area"]').click();
    await driver.pause(2000)
    await $('//android.widget.Button[@content-desc="OK"]').click();
  })

  it("Mengajukan lebih dari 1 produk dengan data yang valid", async () => {
    await page.scrollAndFindElement("Tambah Produk", "description");
    // Tambah Produk
    await $('//android.view.View[@content-desc="Tambah Produk"]').click();
    await page.scrollAndFindElement("Tambah Produk", "description");
    await $(`//android.widget.ImageView[@content-desc="Produk 2\nBerikan detail produk yang ingin kamu pesan\nLink Katalog Produk\n*\nFoto Katalog Produk\n*\nPenjelasan Tambahan"]/android.widget.EditText[1]`).setValue("https://id.shp.ee/7WG121Q");
    //  Mengajukan produk dengan gambar lebih dari 5 mb
    await $(`//android.view.View[@content-desc="Tekan untuk upload"]`).click();
    await $('//android.widget.Button[@content-desc="Galeri"]').click();
    await $('//androidx.compose.ui.platform.ComposeView/android.view.View/android.view.View/android.view.View[4]/android.widget.Button').click();
    await $('//androidx.compose.ui.platform.ComposeView/android.view.View/android.view.View/android.view.View[5]/android.view.View[4]/android.view.View').click();
    await $(`//androidx.compose.ui.platform.ComposeView/android.view.View/android.view.View/android.view.View[4]/android.view.View[1]/android.view.View[2]/android.view.View`).click();
    await $(`//androidx.compose.ui.platform.ComposeView/android.view.View/android.view.View/android.view.View[5]/android.view.View[3]/android.widget.Button`).click();
    await driver.pause(2000)

    
  })

})

