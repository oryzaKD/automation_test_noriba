# GitHub Secrets Configuration Template

## 📋 Required Secrets for CI/CD

Copy secrets berikut ke GitHub Repository Settings → Secrets and variables → Actions

### Email Testing Secrets

```bash
# Gmail Configuration (Recommended)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
IMAP_HOST=imap.gmail.com
IMAP_PORT=993

# Note: Untuk Gmail, gunakan App Password:
# 1. Enable 2-Factor Authentication di Google Account
# 2. Generate App Password: https://myaccount.google.com/apppasswords
# 3. Use App Password sebagai EMAIL_PASS
```

### Optional Secrets

```bash
# Slack Notification (Optional)
SLACK_WEBHOOK=https://hooks.slack.com/services/YOUR/WEBHOOK/URL

# Microsoft Teams Notification (Optional)
TEAMS_WEBHOOK=https://outlook.office.com/webhook/YOUR/WEBHOOK/URL

# BrowserStack (Optional - untuk cloud testing)
BROWSERSTACK_USERNAME=your-browserstack-username
BROWSERSTACK_ACCESS_KEY=your-browserstack-access-key

# Sauce Labs (Optional - untuk cloud testing)
SAUCE_USERNAME=your-sauce-username
SAUCE_ACCESS_KEY=your-sauce-access-key
```

## 🔐 How to Add Secrets

### Via GitHub Web UI:

1. Navigate to your repository on GitHub
2. Click **Settings** tab
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Enter **Name** (e.g., `EMAIL_USER`)
6. Enter **Secret** (the actual value)
7. Click **Add secret**
8. Repeat for each secret

### Via GitHub CLI:

```bash
# Install GitHub CLI if not already installed
# https://cli.github.com/

# Authenticate
gh auth login

# Add secrets
gh secret set EMAIL_USER --body "your-email@gmail.com"
gh secret set EMAIL_PASS --body "your-app-password"
gh secret set IMAP_HOST --body "imap.gmail.com"
gh secret set IMAP_PORT --body "993"

# Verify secrets (will show names only, not values)
gh secret list
```

## 📝 Environment-Specific Secrets

Jika menggunakan multiple environments (staging, production):

### Create Environment Secrets:

1. Go to **Settings** → **Environments**
2. Click **New environment**
3. Name it (e.g., `production`, `staging`)
4. Add environment-specific secrets
5. Optional: Add protection rules

### Use in Workflow:

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production  # Uses production environment secrets
    steps:
      - name: Deploy
        env:
          API_KEY: ${{ secrets.API_KEY }}  # Uses production API_KEY
```

## 🔍 Verifying Secrets

Secrets tidak bisa dibaca setelah dibuat. Untuk verify:

```yaml
# Add temporary step di workflow (REMOVE after verification!)
- name: Verify Secrets (TEMPORARY)
  run: |
    if [ -z "${{ secrets.EMAIL_USER }}" ]; then
      echo "EMAIL_USER is not set"
      exit 1
    fi
    echo "EMAIL_USER is set ✓"
    # DO NOT echo the actual value!
```

## ⚠️ Security Best Practices

1. ✅ **Never commit secrets to code**
   - Add `.env` to `.gitignore`
   - Use secrets only via `${{ secrets.SECRET_NAME }}`

2. ✅ **Rotate secrets regularly**
   - Change passwords every 90 days
   - Update secrets in GitHub after rotation

3. ✅ **Limit access**
   - Only add collaborators who need access
   - Use environment protection rules

4. ✅ **Use scoped tokens**
   - Use App Passwords instead of account passwords
   - Create tokens with minimum required permissions

5. ❌ **Never log secrets**
   ```yaml
   # BAD - Don't do this!
   - run: echo ${{ secrets.EMAIL_PASS }}
   
   # GOOD - GitHub automatically masks secrets in logs
   - run: |
       if [ -z "$EMAIL_USER" ]; then
         echo "Secret not found"
       fi
     env:
       EMAIL_USER: ${{ secrets.EMAIL_USER }}
   ```

## 🗑️ Removing Secrets

### Via Web UI:
1. Settings → Secrets and variables → Actions
2. Click on the secret name
3. Click **Remove secret**

### Via CLI:
```bash
gh secret remove EMAIL_USER
```

## 📋 Checklist

Before running workflows, ensure:

- [ ] All required secrets are added
- [ ] Secret names match exactly (case-sensitive)
- [ ] No typos in secret values
- [ ] App passwords generated (for Gmail)
- [ ] Secrets tested in workflow run
- [ ] Documentation updated if adding new secrets

---

**Note:** This file should NOT be committed with actual secret values!

