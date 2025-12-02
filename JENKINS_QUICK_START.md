# ⚡ Jenkins Quick Start Guide

Panduan singkat untuk memulai Jenkins CI/CD dengan proyek ini.

---

## 🎯 5 Menit Quick Setup

### 1️⃣ Add GitHub Credentials
```
Jenkins → Manage Jenkins → Credentials → Add
- Username: <github-username>
- Password: <github-personal-access-token>
- ID: github-credentials
```

### 2️⃣ Add Email Credentials
```
Add 4 credentials (Secret text):
- EMAIL_USER: your-email@gmail.com
- EMAIL_PASS: your-app-password
- IMAP_HOST: imap.gmail.com
- IMAP_PORT: 993
```

### 3️⃣ Create Pipeline Job
```
New Item → Pipeline
- Name: Noriba-Test
- Pipeline from SCM → Git
- Repository: https://github.com/<username>/noriba_test.git
- Credentials: github-credentials
- Branch: */main
- Script Path: Jenkinsfile
```

### 4️⃣ Setup Webhook (Optional - Auto Trigger)
```
GitHub Repo → Settings → Webhooks → Add
Payload URL: http://<jenkins-url>:8080/github-webhook/
Content type: application/json
```

### 5️⃣ Run First Build
```
Build with Parameters:
- TEST_TYPE: basic-checks-only
- Click Build
```

---

## 📝 Pipeline Parameters

### TEST_TYPE Options:
- `all` - Run semua test (Appium + Cypress + Basic checks)
- `appium-only` - Hanya Appium Android tests
- `cypress-only` - Hanya Cypress web tests
- `basic-checks-only` - Hanya TypeScript checks & audit

### ANDROID_API_LEVEL:
- `30` (Recommended)
- `29`, `31`, `33`

### CYPRESS_BROWSER:
- `chrome` (Recommended)
- `firefox`, `edge`

### ENABLE_DEPLOYMENT:
- `false` (Default - No deployment)
- `true` (Enable staging/prod deployment)

---

## 🚀 Running Tests

### Manual Trigger:
1. Go to Jenkins job
2. Click "Build with Parameters"
3. Select options
4. Click "Build"

### Auto Trigger:
Just push to GitHub:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

### Specific Test Files:
Use dedicated pipelines:
- **Jenkinsfile.appium** - For specific Appium tests
- **Jenkinsfile.cypress** - For specific Cypress tests

---

## 📁 Available Jenkinsfiles

| File | Purpose | Agent Required |
|------|---------|----------------|
| `Jenkinsfile` | All-in-one pipeline | Any (macOS for Appium) |
| `Jenkinsfile.appium` | Android testing only | macOS |
| `Jenkinsfile.cypress` | Web testing only | Any |

---

## 🔍 View Results

### Build Output:
- Click build number → Console Output

### Test Artifacts:
- Build → Artifacts
  - `appium.log` - Appium server logs
  - `appium/screenshots/` - Test screenshots
  - `appium/reports/` - Test reports
  - `cypress/videos/` - Cypress recordings

---

## ⚙️ Common Commands

### Check Jenkins Status:
```bash
# macOS/Linux
systemctl status jenkins

# Check if running
curl -I http://localhost:8080
```

### Restart Jenkins:
```bash
# macOS
brew services restart jenkins-lts

# Linux
sudo systemctl restart jenkins

# Via URL
http://localhost:8080/restart
```

### View Jenkins Logs:
```bash
# macOS
tail -f /usr/local/var/log/jenkins/jenkins.log

# Linux
journalctl -u jenkins -f
```

---

## 🐛 Quick Troubleshooting

### Build Fails Immediately
✅ Check credentials are set correctly
✅ Verify GitHub repository URL

### Cannot Connect to GitHub
✅ Test credentials with: `git ls-remote <repo-url>`
✅ Check network/firewall

### Android Emulator Issues
✅ Ensure using macOS agent
✅ Check ANDROID_HOME is set
✅ Verify emulator installed: `emulator -list-avds`

### npm ci Fails
✅ Delete `node_modules/`
✅ Check Node.js version: `node --version`
✅ Try `npm install` instead

---

## 📚 Next Steps

1. ✅ Setup complete? → Read [JENKINS_SETUP.md](./JENKINS_SETUP.md) for detailed config
2. 🔔 Want notifications? → Setup Email/Slack (see JENKINS_SETUP.md)
3. ⏰ Want scheduled runs? → Configure cron triggers
4. 🚀 Ready for deployment? → Enable ENABLE_DEPLOYMENT parameter

---

## 🆘 Need More Help?

Full documentation: [JENKINS_SETUP.md](./JENKINS_SETUP.md)

Check Jenkins logs and console output for detailed error messages.

---

**Start Testing! 🎉**

