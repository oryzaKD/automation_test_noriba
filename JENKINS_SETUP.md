# 🚀 Jenkins Setup Guide untuk Noriba Test

Panduan lengkap untuk setup Jenkins CI/CD dengan GitHub repository.

---

## 📋 Prerequisites

### 1. Jenkins Server
- Jenkins versi 2.x atau lebih baru
- Akses admin ke Jenkins
- URL Jenkins (contoh: `http://jenkins.company.com:8080`)

### 2. Plugins yang Dibutuhkan
Install plugins berikut di Jenkins (Manage Jenkins → Plugin Manager):

**Required:**
- ✅ Git plugin
- ✅ GitHub plugin
- ✅ Pipeline plugin
- ✅ Credentials Binding plugin
- ✅ NodeJS plugin

**Optional (Recommended):**
- 📧 Email Extension plugin (untuk notifikasi)
- 💬 Slack Notification plugin
- 📊 Blue Ocean plugin (untuk UI yang lebih baik)
- 🔐 GitHub Branch Source plugin (untuk Multibranch Pipeline)

### 3. Node.js Setup di Jenkins
1. Go to: **Manage Jenkins → Tools → NodeJS installations**
2. Click **Add NodeJS**
3. Name: `Node-20`
4. Version: `20.x`
5. Install automatically: ✅ Checked

---

## 🔐 Step 1: Setup GitHub Integration

### A. Generate GitHub Personal Access Token (PAT)

1. **Login ke GitHub** → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. **Generate new token** dengan permissions:
   ```
   ✅ repo (Full control of private repositories)
   ✅ admin:repo_hook (Read and write access to hooks)
   ✅ admin:org_hook (if using Organization)
   ```
3. **Copy token** - simpan di tempat aman (hanya muncul sekali!)

### B. Add GitHub Credentials di Jenkins

1. Go to: **Jenkins Dashboard → Manage Jenkins → Credentials → System → Global credentials**
2. Click **Add Credentials**
3. Fill in:
   ```
   Kind: Username with password
   Username: <your-github-username>
   Password: <paste-github-PAT>
   ID: github-credentials
   Description: GitHub Access Token
   ```
4. **Save**

---

## 📧 Step 2: Setup Email Credentials

Add email credentials untuk email testing:

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
   Secret: <your-email-password-or-app-password>
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

---

## 🏗️ Step 3: Create Jenkins Pipeline

### Option A: Single Branch Pipeline (Recommended untuk Mulai)

1. **Jenkins Dashboard → New Item**
2. **Enter name:** `Noriba-Test-Pipeline`
3. **Select:** Pipeline
4. **Click OK**

5. **Configure Pipeline:**

   **General:**
   - ✅ GitHub project
   - Project url: `https://github.com/<username>/noriba_test`

   **Build Triggers:**
   - ✅ GitHub hook trigger for GITScm polling (untuk auto-trigger dari GitHub)
   - ✅ Poll SCM (optional): `H/5 * * * *` (check every 5 minutes)

   **Pipeline:**
   - Definition: `Pipeline script from SCM`
   - SCM: `Git`
   - Repository URL: `https://github.com/<username>/noriba_test.git`
   - Credentials: Select `github-credentials`
   - Branch: `*/main` (atau `*/master`)
   - Script Path: `Jenkinsfile`

6. **Save**

### Option B: Multibranch Pipeline (untuk Multiple Branches)

1. **Jenkins Dashboard → New Item**
2. **Enter name:** `Noriba-Test-Multibranch`
3. **Select:** Multibranch Pipeline
4. **Click OK**

5. **Configure:**

   **Branch Sources:**
   - Add source → GitHub
   - Credentials: `github-credentials`
   - Repository HTTPS URL: `https://github.com/<username>/noriba_test`
   
   **Build Configuration:**
   - Mode: `by Jenkinsfile`
   - Script Path: `Jenkinsfile`
   
   **Scan Multibranch Pipeline Triggers:**
   - ✅ Periodically if not otherwise run
   - Interval: `1 day`

6. **Save**

---

## 🪝 Step 4: Setup GitHub Webhook (untuk Auto-Trigger)

### Automatic (Recommended):

Jenkins dapat membuat webhook otomatis jika:
1. GitHub plugin terinstall
2. Jenkins URL accessible dari internet
3. Credentials sudah di-setup

### Manual Setup:

1. **Go to GitHub Repository:** `https://github.com/<username>/noriba_test`
2. **Settings → Webhooks → Add webhook**
3. **Configure:**
   ```
   Payload URL: http://<jenkins-url>:8080/github-webhook/
   Content type: application/json
   Secret: (optional, kosongkan jika tidak perlu)
   
   Which events?
   ✅ Just the push event
   ✅ Active
   ```
4. **Add webhook**

**Test Webhook:**
- Push commit ke repository
- Jenkins pipeline akan auto-trigger

---

## 🖥️ Step 5: Setup Jenkins Agent (untuk Android Testing)

### Untuk Appium Android Tests, Anda butuh macOS agent:

1. **Prepare macOS Machine:**
   ```bash
   # Install Homebrew
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   
   # Install Java
   brew install openjdk@11
   
   # Install Android SDK
   brew install --cask android-sdk
   brew install --cask android-platform-tools
   
   # Setup ANDROID_HOME
   export ANDROID_HOME=/usr/local/share/android-sdk
   export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
   
   # Install system images
   sdkmanager "system-images;android-30;google_apis;x86_64"
   sdkmanager "platform-tools" "platforms;android-30"
   ```

2. **Connect Agent to Jenkins:**

   **Method 1: SSH (Recommended)**
   - Manage Jenkins → Nodes → New Node
   - Node name: `macos-agent`
   - Type: Permanent Agent
   - Remote root directory: `/Users/jenkins`
   - Launch method: Launch agents via SSH
   - Host: `<macos-ip-address>`
   - Credentials: Add SSH credentials

   **Method 2: JNLP**
   - Download `agent.jar` dari Jenkins
   - Run pada macOS machine:
     ```bash
     java -jar agent.jar -jnlpUrl http://<jenkins-url>/computer/<node-name>/jenkins-agent.jnlp
     ```

3. **Label the Agent:**
   - Label: `macos`
   - Usage: Use this node as much as possible

---

## 🎯 Step 6: Test Pipeline

### Test Manual Trigger:

1. Go to pipeline job
2. Click **Build with Parameters**
3. Select parameters:
   - TEST_TYPE: `basic-checks-only` (untuk test cepat)
   - ANDROID_API_LEVEL: `30`
   - CYPRESS_BROWSER: `chrome`
   - ENABLE_DEPLOYMENT: `false`
4. Click **Build**

### Test Auto-Trigger:

1. Make a small change di repository
2. Commit dan push ke GitHub:
   ```bash
   git add .
   git commit -m "Test Jenkins auto-trigger"
   git push origin main
   ```
3. Check Jenkins - pipeline akan auto-start

---

## 📁 Pipeline Files Available

Proyek ini menyediakan 3 Jenkinsfile:

### 1. **Jenkinsfile** (Main - All-in-One)
- Menjalankan semua test (Appium, Cypress, Basic checks)
- Support deployment
- Flexible dengan parameters

**Usage:**
```groovy
Script Path: Jenkinsfile
```

### 2. **Jenkinsfile.appium** (Appium Only)
- Hanya untuk Appium Android tests
- Membutuhkan macOS agent
- Lebih cepat jika hanya perlu test Android

**Usage:**
```groovy
Script Path: Jenkinsfile.appium
```

### 3. **Jenkinsfile.cypress** (Cypress Only)
- Hanya untuk Cypress web tests
- Bisa run di agent manapun
- Cocok untuk quick web testing

**Usage:**
```groovy
Script Path: Jenkinsfile.cypress
```

---

## 🔧 Advanced Configuration

### A. Email Notifications

1. **Install Email Extension Plugin**
2. **Configure SMTP:**
   - Manage Jenkins → System → Extended E-mail Notification
   - SMTP server: `smtp.gmail.com`
   - SMTP Port: `587`
   - Credentials: Add email/app-password
   - Use TLS: ✅

3. **Uncomment email sections di Jenkinsfile:**
   ```groovy
   post {
       success {
           emailext (
               subject: "Build Success: ${env.JOB_NAME}",
               body: "Build succeeded",
               to: "team@company.com"
           )
       }
   }
   ```

### B. Slack Notifications

1. **Install Slack Notification Plugin**
2. **Get Slack Token** dari Slack workspace
3. **Configure:**
   - Manage Jenkins → System → Slack
   - Workspace: `your-workspace`
   - Credential: Add Slack token

4. **Add to Jenkinsfile:**
   ```groovy
   post {
       success {
           slackSend (
               channel: '#ci-cd',
               color: 'good',
               message: "Build Success: ${env.JOB_NAME}"
           )
       }
   }
   ```

### C. Scheduled Builds (Nightly Tests)

Di Pipeline configuration:
```
Build Triggers:
✅ Build periodically
Schedule: H 2 * * *  (runs at 2 AM daily)
```

Atau di Jenkinsfile:
```groovy
triggers {
    cron('H 2 * * *')  // Daily at 2 AM
}
```

---

## 🐛 Troubleshooting

### Problem: Jenkins tidak bisa clone repository
**Solution:**
- Pastikan GitHub credentials benar
- Test dengan: `git ls-remote -h https://github.com/<username>/noriba_test.git`
- Check firewall/proxy settings

### Problem: Android Emulator tidak start
**Solution:**
- Pastikan running di macOS agent
- Check ANDROID_HOME environment variable
- Verify system image installed: `sdkmanager --list`

### Problem: Webhook tidak trigger build
**Solution:**
- Pastikan Jenkins URL accessible dari internet (gunakan ngrok untuk local)
- Check webhook delivery di GitHub Settings
- Verify "GitHub hook trigger" enabled di Jenkins job

### Problem: npm ci failed
**Solution:**
- Delete `node_modules` dan `package-lock.json`
- Run `npm install` lagi
- Check Node.js version compatibility

---

## 🔒 Security Best Practices

1. ✅ **Gunakan Credentials Store** - Jangan hardcode secrets
2. ✅ **Restrict Pipeline Access** - Setup role-based access
3. ✅ **Use HTTPS** untuk Jenkins URL
4. ✅ **Secure Webhooks** dengan secret token
5. ✅ **Regular Updates** - Update Jenkins dan plugins
6. ✅ **Backup Jenkins** - Setup backup untuk JENKINS_HOME

---

## 📚 Additional Resources

- [Jenkins Documentation](https://www.jenkins.io/doc/)
- [Pipeline Syntax Reference](https://www.jenkins.io/doc/book/pipeline/syntax/)
- [GitHub Integration](https://plugins.jenkins.io/github/)
- [Best Practices](https://www.jenkins.io/doc/book/pipeline/pipeline-best-practices/)

---

## ✅ Setup Checklist

- [ ] Jenkins installed dan running
- [ ] Plugins installed (Git, GitHub, Pipeline, NodeJS)
- [ ] GitHub PAT created dan added ke Jenkins
- [ ] Email credentials added
- [ ] Pipeline job created
- [ ] GitHub webhook configured
- [ ] macOS agent setup (untuk Appium)
- [ ] Test pipeline berhasil
- [ ] Email/Slack notifications configured (optional)
- [ ] Scheduled builds configured (optional)

---

## 🆘 Need Help?

Jika ada masalah, check:
1. Jenkins console output untuk error details
2. GitHub webhook delivery logs
3. Jenkins system log: `Manage Jenkins → System Log`

---

**Happy CI/CD with Jenkins! 🚀**

