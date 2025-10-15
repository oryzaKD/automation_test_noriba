# GitHub Actions CI/CD Documentation

## 📋 Overview

Proyek ini menggunakan GitHub Actions untuk CI/CD automation testing dengan beberapa workflow:

1. **CI - Basic Checks** - Linting dan type checking
2. **Cypress E2E Tests** - Testing web dengan Cypress
3. **Appium Android Tests** - Testing mobile Android dengan emulator
4. **Nightly Full Test Suite** - Regression testing lengkap yang berjalan setiap malam

## 🔧 Workflows

### 1. CI - Basic Checks (`ci-basic.yml`)

**Trigger:**
- Push ke branch `main` atau `develop`
- Pull request ke branch `main` atau `develop`

**Jobs:**
- ✅ Type checking TypeScript untuk Appium dan Cypress
- ✅ Verifikasi dependencies
- ✅ Security audit dengan `npm audit`
- ✅ Check outdated dependencies

**Matrix Testing:**
- Node.js 18.x
- Node.js 20.x

### 2. Cypress E2E Tests (`cypress.yml`)

**Trigger:**
- Push ke branch `main` atau `develop`
- Pull request ke branch `main` atau `develop`
- Manual trigger via workflow_dispatch

**Jobs:**
- 🌐 Run Cypress tests pada multiple browsers (Chrome, Firefox, Edge)
- 📸 Upload screenshots jika test gagal
- 🎥 Upload videos untuk semua test runs

**Matrix Testing:**
- Chrome
- Firefox
- Edge

### 3. Appium Android Tests (`appium-android.yml`)

**Trigger:**
- Push ke branch `main` atau `develop`
- Pull request ke branch `main` atau `develop`
- Manual trigger dengan pilihan API level

**Jobs:**
- 📱 Setup Android emulator di macOS runner
- 🤖 Install Appium dan UiAutomator2 driver
- ▶️ Jalankan Appium tests pada Android emulator
- 💾 Cache AVD untuk mempercepat workflow berikutnya
- 📊 Upload logs, screenshots, dan reports

**Matrix Testing:**
- Android API Level 30 (default)
- Google APIs target

**Timeout:** 60 menit

### 4. Nightly Full Test Suite (`nightly-tests.yml`)

**Trigger:**
- Scheduled: Setiap hari pukul 2 AM UTC (9 AM WIB)
- Manual trigger via workflow_dispatch

**Jobs:**
- 🌐 Run semua Cypress tests
- 📱 Run semua Appium tests
- 📈 Generate test summary
- 📧 Send notification jika ada failure (optional)

**Timeout:** 120 menit

## 🔐 Secrets Configuration

Untuk menjalankan workflow dengan fitur email testing, tambahkan secrets berikut di repository settings:

### Required Secrets

1. **EMAIL_USER** - Email address untuk testing
2. **EMAIL_PASS** - Password atau App Password untuk email
3. **IMAP_HOST** - IMAP server host (e.g., imap.gmail.com)
4. **IMAP_PORT** - IMAP server port (e.g., 993)

### Cara Menambahkan Secrets

1. Buka repository di GitHub
2. Navigate ke **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Tambahkan secret dengan name dan value yang sesuai

```
Repository Settings → Secrets and variables → Actions → New repository secret
```

## 🚀 Setup & Usage

### Menjalankan Workflow Manual

Untuk workflow yang mendukung `workflow_dispatch`, Anda bisa menjalankannya secara manual:

1. Buka tab **Actions** di repository GitHub
2. Pilih workflow yang ingin dijalankan
3. Click **Run workflow**
4. Pilih branch dan parameter (jika ada)
5. Click **Run workflow** button

### Local Development

Pastikan semua checks akan pass di CI dengan menjalankan command berikut sebelum push:

```bash
# Type checking
npx tsc --noEmit -p appium/tsconfig.json
npx tsc --noEmit -p cypress/tsconfig.json
npx tsc --noEmit -p appium/test/tsconfig.json

# Dependency check
npm audit --audit-level=moderate

# Run Cypress locally
npm run cypress:run

# Run Appium locally (requires emulator)
npm run wdio:appium
```

## 📊 Artifacts

Workflow akan meng-upload artifacts berikut:

### Cypress Tests
- `cypress-screenshots-{browser}` - Screenshots saat test gagal
- `cypress-videos-{browser}` - Video recordings dari test runs
- `cypress-results-{browser}` - Test results dalam berbagai format

### Appium Tests
- `appium-logs-api-{level}` - Appium server logs
- `appium-screenshots-api-{level}` - Screenshots dari test runs
- `appium-reports-api-{level}` - Test reports

### Nightly Tests
- `nightly-test-results` - Kombinasi semua artifacts dari Cypress dan Appium

## 🎯 Best Practices

### Branch Strategy

- **main** - Production-ready code, semua tests harus pass
- **develop** - Development branch, integration tests
- **feature/** - Feature branches, run basic CI checks

### Pull Request Workflow

1. Create feature branch dari `develop`
2. Make changes dan commit
3. Push ke repository
4. Create Pull Request ke `develop`
5. Wait untuk CI checks (basic checks + Cypress)
6. Review dan merge jika semua checks pass

### Appium Tests Strategy

Karena Appium tests memerlukan waktu lama dan resources yang besar:

- ✅ Run secara manual via `workflow_dispatch` saat diperlukan
- ✅ Run otomatis pada push ke `main` branch
- ✅ Skip pada pull requests untuk mempercepat feedback
- ✅ Full regression via nightly tests

## 🔍 Troubleshooting

### Appium Tests Timeout

Jika Appium tests timeout (>60 menit):

1. Check apakah AVD cache ter-generate dengan benar
2. Reduce jumlah test specs yang dijalankan
3. Increase timeout di workflow file

### Emulator Boot Failure

Jika Android emulator gagal boot:

1. Check API level compatibility
2. Verify emulator options
3. Check macOS runner availability

### Secrets Not Found

Jika mendapat error terkait secrets:

1. Verify secrets sudah ditambahkan di repository settings
2. Check nama secrets sesuai dengan yang digunakan di workflow
3. Untuk fork repository, secrets harus ditambahkan ulang

### Cache Issues

Jika mengalami issues dengan cache:

```yaml
# Clear cache dengan mengubah cache key di workflow
key: avd-${{ matrix.api-level }}-${{ matrix.target }}-v2
```

## 📈 Performance Optimization

### Cache Strategy

- ✅ NPM dependencies di-cache otomatis dengan `actions/setup-node@v4`
- ✅ Android AVD di-cache untuk mempercepat emulator setup
- ✅ Gradle cache (jika menggunakan Android build)

### Parallel Execution

- ✅ Cypress tests run parallel across multiple browsers
- ✅ Basic CI checks run pada multiple Node.js versions
- ✅ Appium tests bisa di-parallelkan dengan multiple API levels (jika diperlukan)

## 🔄 Continuous Improvement

### Monitoring

Monitor workflow runs secara berkala:

1. Check success rate
2. Identify flaky tests
3. Optimize slow tests
4. Review timeout settings

### Notifications (Optional)

Tambahkan notifikasi untuk failures:

- Slack webhook
- Microsoft Teams webhook
- Email notifications
- GitHub Issues auto-creation

## 📚 Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Cypress GitHub Action](https://github.com/cypress-io/github-action)
- [Android Emulator Runner](https://github.com/ReactiveCircus/android-emulator-runner)
- [WebdriverIO Documentation](https://webdriver.io/)
- [Appium Documentation](https://appium.io/)

## 🤝 Contributing

Saat menambahkan test baru atau mengubah workflow:

1. Test locally terlebih dahulu
2. Update dokumentasi jika diperlukan
3. Verify workflow changes pada feature branch
4. Request review sebelum merge

---

**Last Updated:** October 2025
**Maintained by:** Automation Test Team

