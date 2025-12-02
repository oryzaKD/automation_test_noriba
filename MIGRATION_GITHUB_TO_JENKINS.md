# 🔄 Migration Guide: GitHub Actions → Jenkins

Panduan lengkap migrasi CI/CD dari GitHub Actions ke Jenkins.

---

## ✅ Apa yang Sudah Dilakukan

### 1. GitHub Actions - Disabled Auto-Triggers ✓

Semua workflow GitHub Actions sudah **dinonaktifkan auto-trigger** tapi **masih tersimpan**:

| Workflow File | Status |
|--------------|--------|
| `appium-android.yml` | Manual only |
| `ci.yml` | Manual only (deployment removed) |
| `cypress.yml` | Manual only |
| `ci-basic.yml` | Manual only |
| `nightly-tests.yml` | Manual only |
| `manual-test-runner.yml` | Already manual only |

**Workflow tidak akan jalan otomatis**, tapi masih bisa dijalankan manual via GitHub Actions tab jika diperlukan.

### 2. Jenkins Files - Created ✓

File-file Jenkins sudah dibuat:

| File | Purpose |
|------|---------|
| `Jenkinsfile` | Main pipeline (all-in-one) |
| `Jenkinsfile.appium` | Dedicated untuk Android testing |
| `Jenkinsfile.cypress` | Dedicated untuk web testing |
| `JENKINS_SETUP.md` | Dokumentasi lengkap setup |
| `JENKINS_QUICK_START.md` | Quick start guide |
| `.jenkinsignore` | Files to ignore di Jenkins |

---

## 🎯 Next Steps

### Step 1: Setup Jenkins Server
Ikuti panduan di [JENKINS_SETUP.md](./JENKINS_SETUP.md):
1. Install Jenkins
2. Install required plugins
3. Setup credentials
4. Create pipeline job
5. Configure webhook

**Quick start**: Lihat [JENKINS_QUICK_START.md](./JENKINS_QUICK_START.md)

### Step 2: Test Jenkins Pipeline
1. Trigger manual build dari Jenkins
2. Verify semua test berjalan
3. Check artifacts dan logs

### Step 3: Setup Auto-Trigger (Optional)
Configure GitHub webhook untuk auto-trigger Jenkins saat push.

### Step 4: Decide on GitHub Actions Workflows

**Pilihan A: Keep as Backup (Recommended)**
- Biarkan workflows GitHub Actions tetap ada
- Gunakan sebagai backup jika Jenkins down
- Manual trigger saja jika diperlukan

**Pilihan B: Delete GitHub Actions**
- Hapus semua file di `.github/workflows/`
- Full migration ke Jenkins
- Lebih clean, tapi kehilangan backup option

---

## 📊 Comparison: GitHub Actions vs Jenkins

### GitHub Actions (Sebelumnya)
✅ Fully managed (no maintenance)
✅ Integrated dengan GitHub
✅ Free untuk public repos
❌ Limited customization
❌ Cost untuk private repos dengan heavy usage
❌ Locked ke GitHub infrastructure

### Jenkins (Sekarang)
✅ Full control dan customization
✅ Self-hosted (no usage costs)
✅ Flexible infrastructure
✅ Support berbagai SCM (not just GitHub)
❌ Requires server maintenance
❌ Need to setup dan manage sendiri
❌ Perlu dedicated resources

---

## 🔄 Migration Mapping

### GitHub Actions → Jenkins Equivalent

| GitHub Actions | Jenkins |
|----------------|---------|
| `on: push` | Webhook trigger |
| `on: schedule` | Pipeline cron trigger |
| `on: workflow_dispatch` | Build with parameters |
| `jobs` | Pipeline stages |
| `steps` | Pipeline steps |
| `runs-on: ubuntu-latest` | Agent label |
| `runs-on: macos-latest` | Agent with label 'macos' |
| `secrets.*` | Jenkins credentials |
| `actions/upload-artifact` | `archiveArtifacts` |
| `matrix` | Pipeline matrix / parallel |

### Trigger Mapping

**GitHub Actions:**
```yaml
on:
  push:
    branches: [main]
  pull_request:
  schedule:
    - cron: '0 2 * * *'
```

**Jenkins Equivalent:**
```groovy
triggers {
    // Push trigger via webhook
    githubPush()
    
    // Scheduled trigger
    cron('H 2 * * *')
}
```

---

## 🗂️ What to Keep/Delete

### ✅ Keep These (Already Created)
```
Jenkinsfile
Jenkinsfile.appium
Jenkinsfile.cypress
JENKINS_SETUP.md
JENKINS_QUICK_START.md
.jenkinsignore
```

### ⚠️ Optional: Keep or Delete

**GitHub Actions Workflows:**
```
.github/workflows/
  ├── appium-android.yml      ← Manual only now
  ├── ci.yml                  ← Manual only now (no auto-deploy)
  ├── cypress.yml             ← Manual only now
  ├── ci-basic.yml            ← Manual only now
  ├── nightly-tests.yml       ← Manual only now
  └── manual-test-runner.yml  ← Was already manual only
```

**Recommendation:**
- **KEEP** jika ingin backup option
- **DELETE** jika yakin full migrate ke Jenkins

**GitHub Actions Docs:**
```
.github/
  ├── FIX_VISUALIZATION.md
  ├── TROUBLESHOOTING_ADB.md
  └── workflows/README.md
```

**Recommendation:**
- **KEEP** - Dokumentasi berguna untuk referensi

---

## 🚀 Testing Migration

### 1. Test Basic Checks (Tercepat)
```bash
# Di Jenkins: Build with Parameters
TEST_TYPE: basic-checks-only
```

### 2. Test Cypress (Medium)
```bash
# Di Jenkins: Build with Parameters
TEST_TYPE: cypress-only
CYPRESS_BROWSER: chrome
```

### 3. Test Appium (Paling Lama)
```bash
# Di Jenkins: Build with Parameters
TEST_TYPE: appium-only
ANDROID_API_LEVEL: 30
```

### 4. Test Full Suite
```bash
# Di Jenkins: Build with Parameters
TEST_TYPE: all
```

---

## 📋 Checklist Post-Migration

- [ ] Jenkins server running dan accessible
- [ ] All plugins installed
- [ ] GitHub credentials configured
- [ ] Email credentials configured
- [ ] Pipeline job created
- [ ] First build success (basic-checks)
- [ ] Cypress tests pass
- [ ] Appium tests pass (if macOS agent available)
- [ ] Webhook configured (optional)
- [ ] Team trained on Jenkins usage
- [ ] Decide: Keep or delete GitHub Actions workflows
- [ ] Update team documentation
- [ ] Monitor Jenkins for 1 week

---

## 🆘 Rollback Plan

Jika ada masalah dengan Jenkins:

### Quick Rollback:
1. **Re-enable GitHub Actions** (jika masih ada):
   ```bash
   # Edit each workflow file
   # Change back to:
   on:
     push:
       branches: [main, develop]
     pull_request:
       branches: [main, develop]
   ```

2. **Commit dan push**:
   ```bash
   git add .github/workflows/
   git commit -m "Re-enable GitHub Actions"
   git push
   ```

3. **GitHub Actions akan aktif kembali**

### If Deleted:
Restore dari git history:
```bash
git log --all --full-history -- ".github/workflows/*"
git checkout <commit-hash> -- .github/workflows/
```

---

## 📈 Monitoring

### Jenkins Metrics to Monitor:
- ✅ Build success rate
- ✅ Average build time
- ✅ Queue time
- ✅ Agent utilization
- ✅ Failed builds

### Tools:
- Jenkins Blue Ocean plugin
- Prometheus + Grafana
- Jenkins monitoring plugin

---

## 🎓 Learning Resources

### Jenkins:
- [Jenkins Documentation](https://www.jenkins.io/doc/)
- [Pipeline Syntax](https://www.jenkins.io/doc/book/pipeline/syntax/)
- [Best Practices](https://www.jenkins.io/doc/book/pipeline/pipeline-best-practices/)

### Migration:
- [GitHub Actions to Jenkins](https://www.jenkins.io/blog/2020/04/16/github-app-authentication/)
- [Jenkins GitHub Integration](https://plugins.jenkins.io/github/)

---

## 💡 Tips

1. **Start Small**: Test dengan basic checks dulu
2. **Parallel Development**: Jalankan Jenkins dan GitHub Actions parallel selama transition period
3. **Team Training**: Pastikan team familiar dengan Jenkins sebelum full migration
4. **Backup**: Simpan GitHub Actions workflows sebagai backup
5. **Monitor**: Watch Jenkins closely minggu pertama

---

## ✅ Migration Complete When:

- ✅ Jenkins pipeline stable selama 1-2 minggu
- ✅ Team comfortable dengan Jenkins
- ✅ All test types working
- ✅ Auto-trigger working (if needed)
- ✅ Deployment working (if enabled)
- ✅ Monitoring in place

---

**Good luck with your Jenkins migration! 🚀**

Need help? Check [JENKINS_SETUP.md](./JENKINS_SETUP.md) atau [JENKINS_QUICK_START.md](./JENKINS_QUICK_START.md)

