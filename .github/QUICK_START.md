# ⚡ Quick Start Guide - GitHub Actions CI/CD

Panduan cepat untuk setup CI/CD dalam 5 menit!

## ✅ Checklist Setup

### 1️⃣ Push Workflow Files (1 menit)

```bash
# Pastikan semua workflow files sudah ada
ls -la .github/workflows/

# Add dan commit files
git add .github/ CI_CD_SETUP.md README.md
git commit -m "Setup CI/CD with GitHub Actions"
git push origin main
```

### 2️⃣ Enable GitHub Actions (30 detik)

1. Buka repository di GitHub
2. Click tab **Actions**
3. Click **"I understand my workflows, go ahead and enable them"**

### 3️⃣ Add Secrets (2 menit)

**Required untuk email testing:**

1. Go to: **Settings** → **Secrets and variables** → **Actions**
2. Click **"New repository secret"**
3. Add these secrets:

   ```
   EMAIL_USER = your-email@gmail.com
   EMAIL_PASS = your-app-password
   IMAP_HOST = imap.gmail.com
   IMAP_PORT = 993
   ```

**Gmail App Password:**
- Visit: https://myaccount.google.com/apppasswords
- Create app password
- Use it as `EMAIL_PASS`

### 4️⃣ Verify Setup (1 menit)

1. Go to **Actions** tab
2. Check workflows are listed:
   - ✅ CI - Basic Checks
   - ✅ Cypress E2E Tests
   - ✅ Appium Android Tests
   - ✅ Nightly Full Test Suite
   - ✅ Manual Test Runner

### 5️⃣ Test Run (30 detik)

**Trigger manual test:**

1. Click **Actions** tab
2. Select **"Manual Test Runner"**
3. Click **"Run workflow"**
4. Select:
   - Branch: `main`
   - Test type: `cypress-all`
   - Browser: `chrome`
5. Click **"Run workflow"**

## 🎉 Done!

Your CI/CD is now active!

## 🚀 Next Steps

### Automatic Workflows

Workflows akan otomatis run saat:
- ✅ Push ke `main` atau `develop`
- ✅ Create Pull Request
- ✅ Scheduled (nightly tests at 9 AM WIB)

### View Results

1. **Check workflow status:**
   - Actions tab → Click on workflow run
   
2. **Download artifacts:**
   - Scroll down pada completed workflow
   - Click artifact name to download

3. **View logs:**
   - Expand job → Expand step → View logs

## 📋 Common Commands

```bash
# Check workflow status (GitHub CLI)
gh workflow list
gh run list

# Trigger workflow manually
gh workflow run cypress.yml
gh workflow run appium-android.yml

# View latest run
gh run view

# Download artifacts
gh run download <run-id>
```

## 🔍 Quick Troubleshooting

### Workflow tidak berjalan?
✅ Check: Actions enabled di Settings  
✅ Check: Workflow files di `.github/workflows/`  
✅ Check: Branch name sesuai trigger conditions  

### Secret tidak ditemukan?
✅ Check: Secret names exactly sama (case-sensitive)  
✅ Check: Secrets added di repository level (not organization)  
✅ Re-add secret jika perlu  

### Tests fail?
✅ Review logs di Actions tab  
✅ Check artifacts untuk screenshots/reports  
✅ Run tests locally untuk debugging  

## 📚 Full Documentation

Untuk detail lengkap, baca:
- 📖 [CI_CD_SETUP.md](../CI_CD_SETUP.md) - Complete setup guide
- 📖 [.github/workflows/README.md](./workflows/README.md) - Workflow details
- 📖 [README.md](../README.md) - Project overview

## 💡 Tips

1. **Start small:** Test dengan Cypress workflows dulu (lebih cepat)
2. **Use manual runner:** Untuk test specific files
3. **Check costs:** Monitor GitHub Actions minutes usage
4. **Review logs:** Selalu check logs untuk understand failures
5. **Keep updated:** Update actions versions regularly

---

**Setup Time:** ~5 menit  
**Difficulty:** ⭐ Easy  
**Support:** Contact automation test team jika ada issues

