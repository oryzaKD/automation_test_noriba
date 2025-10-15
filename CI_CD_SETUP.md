# 🚀 CI/CD Setup Guide - Noriba Test Automation

## 📖 Pengenalan

Dokumentasi ini menjelaskan langkah-langkah untuk setup CI/CD menggunakan GitHub Actions untuk proyek automation testing Noriba.

## 🏗️ Struktur GitHub Actions

```
.github/
└── workflows/
    ├── ci-basic.yml           # Basic CI checks (linting, type checking)
    ├── cypress.yml            # Cypress E2E tests
    ├── appium-android.yml     # Appium Android tests
    ├── nightly-tests.yml      # Nightly regression tests
    └── README.md              # Workflow documentation
```

## 📋 Prerequisites

### 1. Repository Requirements

- Repository harus di-host di GitHub
- Minimum access level: Write access untuk mengkonfigurasi secrets

### 2. Dependencies

Semua dependencies sudah terdefinisi di `package.json`:
- Node.js 18.x atau 20.x
- Appium
- Cypress
- WebdriverIO

## 🔧 Setup Steps

### Step 1: Push Workflow Files ke Repository

Workflow files sudah dibuat di direktori `.github/workflows/`. Push ke repository:

```bash
git add .github/
git commit -m "Add GitHub Actions CI/CD workflows"
git push origin main
```

### Step 2: Configure Repository Secrets

Untuk email testing, tambahkan secrets di GitHub:

1. **Buka Repository Settings:**
   ```
   Repository → Settings → Secrets and variables → Actions
   ```

2. **Tambahkan Secrets Berikut:**

   | Secret Name | Description | Example Value |
   |-------------|-------------|---------------|
   | `EMAIL_USER` | Email address untuk testing | `test@gmail.com` |
   | `EMAIL_PASS` | Password atau App Password | `your-app-password` |
   | `IMAP_HOST` | IMAP server hostname | `imap.gmail.com` |
   | `IMAP_PORT` | IMAP server port | `993` |

3. **Click "New repository secret"** untuk setiap secret

### Step 3: Enable GitHub Actions

1. Buka tab **Actions** di repository
2. Jika diminta, click **"I understand my workflows, go ahead and enable them"**
3. Verify bahwa workflows sudah terdeteksi

### Step 4: Configure Branch Protection (Optional)

Untuk memastikan code quality, setup branch protection rules:

1. **Navigate ke Settings → Branches**
2. **Add branch protection rule untuk `main`:**
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - Select required checks:
     - `Lint and Type Check`
     - `Run Cypress Tests`

3. **Add branch protection rule untuk `develop`:**
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass before merging

## 🎯 Workflow Details

### 1. CI - Basic Checks

**Runs on:** Every push and PR to `main` or `develop`

**What it does:**
- ✅ TypeScript compilation check
- ✅ Dependency validation
- ✅ Security audit
- ✅ Tests pada Node.js 18.x dan 20.x

**Duration:** ~2-3 menit

### 2. Cypress E2E Tests

**Runs on:** Every push and PR to `main` or `develop`

**What it does:**
- ✅ Run Cypress tests pada Chrome, Firefox, Edge
- ✅ Generate screenshots dan videos
- ✅ Upload artifacts

**Duration:** ~5-10 menit per browser

### 3. Appium Android Tests

**Runs on:** Push to `main`, Manual trigger

**What it does:**
- ✅ Setup Android emulator (API 30)
- ✅ Install Appium dan drivers
- ✅ Run mobile automation tests
- ✅ Upload logs dan screenshots

**Duration:** ~30-45 menit

**Note:** Runs di macOS runner karena memerlukan hardware acceleration untuk emulator

### 4. Nightly Tests

**Runs on:** Scheduled (daily at 2 AM UTC / 9 AM WIB)

**What it does:**
- ✅ Full regression testing
- ✅ Cypress + Appium tests
- ✅ Generate comprehensive reports

**Duration:** ~60-90 menit

## 🚦 Usage Guide

### Automatic Triggers

Workflows akan otomatis berjalan saat:

1. **Push ke branch `main` atau `develop`**
   ```bash
   git push origin main
   ```

2. **Create Pull Request**
   ```bash
   gh pr create --base develop --head feature/new-feature
   ```

3. **Scheduled (Nightly Tests)**
   - Otomatis setiap hari pukul 9 AM WIB

### Manual Triggers

Untuk menjalankan workflow secara manual:

#### Via GitHub Web UI:

1. Buka **Actions** tab
2. Pilih workflow (e.g., "Appium Android Tests")
3. Click **"Run workflow"** button
4. Pilih branch
5. (Optional) Set parameters
6. Click **"Run workflow"**

#### Via GitHub CLI:

```bash
# Run Cypress tests
gh workflow run cypress.yml

# Run Appium tests dengan API level 30
gh workflow run appium-android.yml --field api-level=30

# Run nightly tests
gh workflow run nightly-tests.yml
```

## 📊 Monitoring & Artifacts

### View Workflow Runs

1. Buka **Actions** tab di repository
2. Click pada workflow run untuk melihat details
3. Expand jobs untuk melihat logs

### Download Artifacts

Artifacts tersimpan selama 90 hari (default GitHub):

1. Buka workflow run yang sudah selesai
2. Scroll ke bawah ke section **"Artifacts"**
3. Click untuk download:
   - Cypress screenshots/videos
   - Appium logs/reports
   - Test results

### Understanding Logs

```bash
# Workflow structure:
Workflow Run
├── Job: Lint and Type Check
│   ├── Step: Checkout code
│   ├── Step: Setup Node.js
│   ├── Step: Install dependencies
│   └── Step: TypeScript check
└── Job: Run Cypress Tests
    ├── ...
```

Click pada setiap step untuk melihat detailed logs.

## 🔍 Troubleshooting

### Common Issues

#### 1. Workflow Tidak Berjalan

**Problem:** Workflow tidak trigger setelah push

**Solutions:**
- Check file workflow ada di `.github/workflows/`
- Verify workflow file valid YAML (tidak ada syntax error)
- Check Actions enabled di repository settings
- Verify branch name sesuai dengan trigger conditions

#### 2. Secrets Not Found Error

**Problem:** `Error: Secret EMAIL_USER not found`

**Solutions:**
```bash
# Verify secrets di repository settings:
Settings → Secrets and variables → Actions

# Pastikan nama secret EXACTLY sama (case-sensitive)
EMAIL_USER ✅
email_user ❌
Email_User ❌
```

#### 3. Appium Tests Failing

**Problem:** Android emulator tidak boot atau tests timeout

**Solutions:**
- Check macOS runner availability (GitHub status)
- Verify API level supported (29-33)
- Review emulator logs di artifacts
- Increase timeout jika diperlukan:
  ```yaml
  timeout-minutes: 90  # Default: 60
  ```

#### 4. Cache Issues

**Problem:** Dependencies install lambat atau gagal

**Solutions:**
```bash
# Di workflow file, ubah cache key:
cache: 'npm'  # Ini akan auto-handle npm cache

# Atau manually clear cache dengan mengubah key:
key: ${{ runner.os }}-npm-v2-${{ hashFiles('**/package-lock.json') }}
```

#### 5. Test Flakiness

**Problem:** Tests kadang pass, kadang fail

**Solutions:**
- Identify flaky tests via test reports
- Add proper waits/timeouts
- Review test isolation
- Consider retry strategy:
  ```yaml
  - name: Run tests with retry
    uses: nick-invision/retry@v2
    with:
      timeout_minutes: 10
      max_attempts: 3
      command: npm run wdio:appium
  ```

## 🎨 Customization

### Modify Triggers

Edit trigger conditions di workflow file:

```yaml
# Tambahkan branches
on:
  push:
    branches: [main, develop, staging]

# Tambahkan paths filter
on:
  push:
    paths:
      - 'appium/**'
      - 'package.json'
```

### Add Notifications

Tambahkan Slack notification saat tests fail:

```yaml
- name: Slack Notification
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'Appium tests failed!'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### Parallel Testing

Untuk run multiple test specs secara parallel:

```yaml
strategy:
  matrix:
    spec:
      - test/specs/3-register.ts
      - test/specs/4-login.ts
      - test/specs/5-changePass.ts

steps:
  - run: npm run wdio:appium -- --spec ${{ matrix.spec }}
```

## 📈 Best Practices

### 1. Keep Workflows Fast

- ✅ Use caching extensively
- ✅ Run expensive tests (Appium) only when needed
- ✅ Parallelize when possible
- ❌ Avoid running all tests on every PR

### 2. Clear Naming

- ✅ Use descriptive workflow names
- ✅ Add comments di workflow files
- ✅ Document custom steps

### 3. Security

- ✅ Never commit secrets to code
- ✅ Use GitHub Secrets untuk sensitive data
- ✅ Limit secret access via environment restrictions
- ❌ Jangan log sensitive information

### 4. Cost Optimization

GitHub Actions free tier:
- 2,000 minutes/month untuk private repos
- Unlimited untuk public repos

Tips menghemat minutes:
- ✅ Cache dependencies
- ✅ Use `if` conditions untuk skip unnecessary jobs
- ✅ Cancel redundant workflow runs
- ✅ Use self-hosted runners untuk heavy workloads (optional)

### 5. Maintenance

- ✅ Update actions versions regularly
- ✅ Review and clean old artifacts
- ✅ Monitor workflow run times
- ✅ Keep documentation updated

## 🔄 Migration from Other CI Tools

### From Jenkins

```yaml
# Jenkins (Jenkinsfile)
pipeline {
  agent any
  stages {
    stage('Test') {
      steps {
        sh 'npm test'
      }
    }
  }
}

# GitHub Actions (equivalent)
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm test
```

### From GitLab CI

```yaml
# .gitlab-ci.yml
test:
  script:
    - npm install
    - npm test

# .github/workflows/test.yml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm install
      - run: npm test
```

## 📞 Support & Resources

### Documentation

- 📚 [GitHub Actions Docs](https://docs.github.com/en/actions)
- 📚 [Workflow Syntax](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)
- 📚 [Cypress GitHub Action](https://github.com/cypress-io/github-action)

### Community

- 💬 [GitHub Community Forum](https://github.community/)
- 💬 [WebdriverIO Discord](https://discord.webdriver.io/)
- 💬 [Cypress Discord](https://discord.gg/cypress)

### Getting Help

Jika ada issues:

1. Check troubleshooting section di dokumentasi ini
2. Review workflow logs untuk error details
3. Search GitHub Actions documentation
4. Ask team atau create issue di repository

---

**Setup Date:** October 2025  
**Last Updated:** October 2025  
**Maintained by:** Automation Test Team - PT Visi Syariah Umat (VisiCloud)

