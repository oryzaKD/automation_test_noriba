# 🎯 Setup Jenkins untuk Proyek Noriba Test

Jenkins sudah terinstall dan running! Sekarang mari setup pipeline untuk proyek ini.

---

## ✅ Status Installation

- ✅ Jenkins LTS 2.528.2 - Running
- ✅ Java 21 - Active
- ✅ Port: http://localhost:8080
- 🔐 Initial Password: `469e752d57ba4394a77b5ffa52f900e7`

---

## 📝 Setup Checklist

### Step 1: Install Required Plugins ✅

1. Buka Jenkins: http://localhost:8080
2. Login dengan admin account
3. Go to: **Manage Jenkins → Plugins**
4. Install plugins berikut (jika belum terinstall):

**Required:**
- ✅ Git plugin
- ✅ GitHub plugin  
- ✅ Pipeline plugin
- ✅ Credentials Binding plugin
- ✅ **NodeJS plugin** ⭐ PENTING

**Optional (Recommended):**
- ✅ Email Extension plugin
- ✅ Blue Ocean (UI modern)
- ✅ GitHub Branch Source plugin

5. Klik **Download now and install after restart**
6. Centang **Restart Jenkins when installation is complete**

---

### Step 2: Configure Node.js 🔧

Setelah NodeJS plugin terinstall:

1. **Manage Jenkins → Tools**
2. Scroll ke **NodeJS installations**
3. Klik **Add NodeJS**
4. Configure:
   ```
   Name: Node-20
   Version: NodeJS 20.x (pilih latest 20.x)
   ☑ Install automatically
   ```
5. **Save**

---

### Step 3: Add GitHub Credentials 🔐

#### A. Generate GitHub Personal Access Token (PAT)

1. Login ke **GitHub**
2. Go to: **Settings → Developer settings → Personal access tokens → Tokens (classic)**
3. Click **Generate new token (classic)**
4. Set permissions:
   ```
   ✅ repo (Full control)
   ✅ admin:repo_hook
   ✅ workflow
   ```
5. **Generate token** dan copy (simpan di tempat aman!)

#### B. Add Credentials ke Jenkins

1. **Jenkins → Manage Jenkins → Credentials → System → Global credentials**
2. Click **Add Credentials**
3. Fill in:
   ```
   Kind: Username with password
   Username: <github-username-anda>
   Password: <paste-github-PAT>
   ID: github-credentials
   Description: GitHub Access Token
   ```
4. **Save**

---

### Step 4: Add Email Credentials 📧

Add 4 credentials (Secret text) untuk email testing:

1. **Manage Jenkins → Credentials → Global → Add Credentials**

2. **Email User:**
   ```
   Kind: Secret text
   Secret: <your-email@gmail.com>
   ID: EMAIL_USER
   Description: Test Email User
   ```

3. **Email Password:**
   ```
   Kind: Secret text
   Secret: <your-gmail-app-password>
   ID: EMAIL_PASS
   Description: Test Email Password
   ```

4. **IMAP Host:**
   ```
   Kind: Secret text
   Secret: imap.gmail.com
   ID: IMAP_HOST
   Description: IMAP Server Host
   ```

5. **IMAP Port:**
   ```
   Kind: Secret text
   Secret: 993
   ID: IMAP_PORT
   Description: IMAP Server Port
   ```

💡 **Catatan:** Untuk Gmail, gunakan App Password, bukan password biasa:
- Google Account → Security → 2-Step Verification → App passwords

---

### Step 5: Create Pipeline Job 🏗️

#### Option A: Pipeline untuk All Tests

1. **Jenkins Dashboard → New Item**
2. **Enter name:** `Noriba-Test-All`
3. **Select:** Pipeline
4. **Click OK**
5. Configure:

   **General:**
   - ✅ GitHub project
   - Project url: `https://github.com/<username>/noriba_test`

   **Build Triggers:**
   - ✅ GitHub hook trigger for GITScm polling
   - ✅ Poll SCM: `H/5 * * * *` (optional)

   **Pipeline:**
   - Definition: `Pipeline script from SCM`
   - SCM: `Git`
   - Repository URL: `https://github.com/<username>/noriba_test.git`
   - Credentials: `github-credentials`
   - Branch: `*/main`
   - Script Path: `Jenkinsfile`

6. **Save**

#### Option B: Pipeline untuk Appium Only

Ulangi step di atas dengan:
- Name: `Noriba-Test-Appium`
- Script Path: `Jenkinsfile.appium`

#### Option C: Pipeline untuk Cypress Only

Ulangi step di atas dengan:
- Name: `Noriba-Test-Cypress`
- Script Path: `Jenkinsfile.cypress`

---

### Step 6: Setup Webhook (⚠️ SKIP untuk Local Development) 🔗

> **💡 Untuk Local Development:** Step ini bisa di-SKIP!
> 
> Webhook membutuhkan Jenkins yang bisa diakses dari internet publik.
> Untuk local development, gunakan **Manual Trigger** atau **Poll SCM** sebagai alternatif.

#### ✅ Alternatif 1: Manual Trigger (Recommended untuk Local)

Cukup klik **"Build Now"** atau **"Build with Parameters"** di Jenkins setiap kali ingin menjalankan test.

#### ✅ Alternatif 2: Poll SCM (Auto-check berkala)

1. Buka Pipeline job → **Configure**
2. Di **Build Triggers**, centang:
   ```
   ✅ Poll SCM
   Schedule: H/5 * * * *
   ```
   (Jenkins akan check GitHub setiap 5 menit)
3. **Save**

---

#### 🌐 Jika Tetap Ingin Webhook (untuk Production/Server):

Untuk production atau jika Jenkins di server dengan IP publik:

1. **GitHub Repository → Settings → Webhooks → Add webhook**
2. Configure:
   ```
   Payload URL: http://<your-public-ip>:8080/github-webhook/
   Content type: application/json
   Which events: Just the push event
   ☑ Active
   ```
3. **Add webhook**

**Untuk Local dengan Ngrok:**
```bash
# Install ngrok
brew install ngrok

# Expose Jenkins
ngrok http 8080

# Gunakan URL dari ngrok (contoh: https://abc123.ngrok.io/github-webhook/)
```

---

### Step 7: Test Pipeline ✨

#### Test 1: Basic Checks Only (Cepat)

1. Go to pipeline job: **Noriba-Test-All**
2. Click **Build with Parameters**
3. Select:
   ```
   TEST_TYPE: basic-checks-only
   ANDROID_API_LEVEL: 30
   CYPRESS_BROWSER: chrome
   ENABLE_DEPLOYMENT: false
   ```
4. Click **Build**
5. Check **Console Output** untuk melihat progress

#### Test 2: Cypress Only

1. Go to: **Noriba-Test-Cypress** (jika sudah dibuat)
2. Click **Build with Parameters**
3. Check hasil test

#### Test 3: Full Test (Appium + Cypress)

1. Go to: **Noriba-Test-All**
2. Click **Build with Parameters**
3. Select:
   ```
   TEST_TYPE: all
   ANDROID_API_LEVEL: 30
   CYPRESS_BROWSER: chrome
   ENABLE_DEPLOYMENT: false
   ```
4. Click **Build**

---

## 🖥️ Jenkins Commands

```bash
# Start Jenkins
brew services start jenkins-lts

# Stop Jenkins
brew services stop jenkins-lts

# Restart Jenkins
brew services restart jenkins-lts

# Check Status
brew services list | grep jenkins

# View Logs
tail -f ~/.jenkins/logs/jenkins.log

# Access Jenkins
open http://localhost:8080
```

---

## 🐛 Troubleshooting

### Problem: Build fails dengan "npm not found"

**Solution:**
- Pastikan NodeJS plugin terinstall
- Check Node-20 sudah dikonfigurasi di Tools
- Restart Jenkins

### Problem: Cannot clone repository

**Solution:**
- Verify GitHub credentials benar
- Test dengan: `git ls-remote https://github.com/<username>/noriba_test.git`
- Check internet connection

### Problem: Email credentials not found

**Solution:**
- Check semua 4 email credentials sudah ditambahkan
- ID harus exact: `EMAIL_USER`, `EMAIL_PASS`, `IMAP_HOST`, `IMAP_PORT`
- Case sensitive!

### Problem: Android Emulator tidak start

**Solution:**
- Untuk Appium tests, butuh macOS dengan Android SDK
- Install Android SDK: `brew install --cask android-sdk`
- Setup ANDROID_HOME environment variable
- Atau gunakan Cypress-only pipeline

---

## 📊 Pipeline Parameters

### TEST_TYPE:
- `all` - Run semua tests (Appium + Cypress + Basic)
- `appium-only` - Hanya Android tests
- `cypress-only` - Hanya Web tests  
- `basic-checks-only` - Hanya TypeScript & security audit

### ANDROID_API_LEVEL:
- `30` (Recommended)
- `29`, `31`, `33`

### CYPRESS_BROWSER:
- `chrome` (Recommended)
- `firefox`, `edge`

### ENABLE_DEPLOYMENT:
- `false` (Default)
- `true` (Enable staging/prod deployment)

---

## 📁 Available Jenkinsfiles

| File | Purpose | Best For |
|------|---------|----------|
| `Jenkinsfile` | All-in-one | Complete testing |
| `Jenkinsfile.appium` | Android only | Mobile testing |
| `Jenkinsfile.cypress` | Web only | Quick web testing |

---

## ✅ Setup Complete Checklist

- [ ] Jenkins accessible di http://localhost:8080
- [ ] Plugins terinstall (Git, GitHub, Pipeline, NodeJS)
- [ ] Node-20 configured di Tools
- [ ] GitHub credentials added
- [ ] Email credentials added (4 items)
- [ ] Pipeline job created
- [ ] Test build berhasil (basic-checks-only)
- [ ] GitHub webhook configured (optional)

---

## 🎉 Selamat!

Jenkins setup untuk project Noriba Test sudah complete!

**Langkah selanjutnya:**
- ✅ Run builds regularly
- ✅ Monitor test results  
- ✅ Setup notifications (email/slack)
- ✅ Configure scheduled builds

**Documentation:**
- [JENKINS_QUICK_START.md](./JENKINS_QUICK_START.md) - Quick reference
- [JENKINS_SETUP.md](./JENKINS_SETUP.md) - Detailed setup guide

---

**Happy Testing! 🚀**

