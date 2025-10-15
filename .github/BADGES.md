# GitHub Actions Badges

Tambahkan badges berikut ke README.md untuk menampilkan status CI/CD:

## 📌 How to Use

Copy dan paste badge code di bawah ini ke bagian atas `README.md`:

```markdown
# Replace {owner} and {repo} with your GitHub username and repository name

[![CI - Basic Checks](https://github.com/{owner}/{repo}/actions/workflows/ci-basic.yml/badge.svg)](https://github.com/{owner}/{repo}/actions/workflows/ci-basic.yml)
[![Cypress E2E Tests](https://github.com/{owner}/{repo}/actions/workflows/cypress.yml/badge.svg)](https://github.com/{owner}/{repo}/actions/workflows/cypress.yml)
[![Appium Android Tests](https://github.com/{owner}/{repo}/actions/workflows/appium-android.yml/badge.svg)](https://github.com/{owner}/{repo}/actions/workflows/appium-android.yml)
```

## 🎨 Available Badges

### Workflow Status Badges

```markdown
<!-- CI - Basic Checks -->
![CI - Basic Checks](https://github.com/{owner}/{repo}/actions/workflows/ci-basic.yml/badge.svg)

<!-- Cypress E2E Tests -->
![Cypress E2E Tests](https://github.com/{owner}/{repo}/actions/workflows/cypress.yml/badge.svg)

<!-- Appium Android Tests -->
![Appium Android Tests](https://github.com/{owner}/{repo}/actions/workflows/appium-android.yml/badge.svg)

<!-- Nightly Tests -->
![Nightly Tests](https://github.com/{owner}/{repo}/actions/workflows/nightly-tests.yml/badge.svg)
```

### Branch-Specific Badges

```markdown
<!-- For specific branch -->
![CI](https://github.com/{owner}/{repo}/actions/workflows/ci-basic.yml/badge.svg?branch=main)
![CI](https://github.com/{owner}/{repo}/actions/workflows/ci-basic.yml/badge.svg?branch=develop)
```

### Custom Badge Styles

```markdown
<!-- Flat style -->
![CI](https://github.com/{owner}/{repo}/actions/workflows/ci-basic.yml/badge.svg?style=flat)

<!-- Flat-square style -->
![CI](https://github.com/{owner}/{repo}/actions/workflows/ci-basic.yml/badge.svg?style=flat-square)

<!-- For-the-badge style -->
![CI](https://github.com/{owner}/{repo}/actions/workflows/ci-basic.yml/badge.svg?style=for-the-badge)
```

## 🏷️ Other Useful Badges

### Node.js Version

```markdown
![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
```

### License

```markdown
![License](https://img.shields.io/badge/license-MIT-blue.svg)
```

### Code Coverage (if using coverage tools)

```markdown
![Coverage](https://img.shields.io/badge/coverage-85%25-green)
```

### Dependencies Status

```markdown
![Dependencies](https://img.shields.io/badge/dependencies-up%20to%20date-brightgreen)
```

### Last Commit

```markdown
![Last Commit](https://img.shields.io/github/last-commit/{owner}/{repo})
```

### Repository Size

```markdown
![Repo Size](https://img.shields.io/github/repo-size/{owner}/{repo})
```

## 📊 Example README Header

```markdown
# 🤖 Noriba Test Automation

[![CI - Basic Checks](https://github.com/{owner}/{repo}/actions/workflows/ci-basic.yml/badge.svg)](https://github.com/{owner}/{repo}/actions/workflows/ci-basic.yml)
[![Cypress E2E Tests](https://github.com/{owner}/{repo}/actions/workflows/cypress.yml/badge.svg)](https://github.com/{owner}/{repo}/actions/workflows/cypress.yml)
[![Appium Android Tests](https://github.com/{owner}/{repo}/actions/workflows/appium-android.yml/badge.svg)](https://github.com/{owner}/{repo}/actions/workflows/appium-android.yml)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)]()

> Automation testing suite for Noriba mobile app using Appium and Cypress
```

## 🎯 Status Badge Results

Badges akan menampilkan status:
- ✅ **passing** - Hijau (all tests passed)
- ❌ **failing** - Merah (some tests failed)
- 🟡 **in progress** - Kuning (workflow running)
- ⚪ **no status** - Abu-abu (workflow not run yet)

## 🔗 Links

- [GitHub Actions Badge Documentation](https://docs.github.com/en/actions/monitoring-and-troubleshooting-workflows/adding-a-workflow-status-badge)
- [Shields.io Custom Badges](https://shields.io/)
- [Simple Icons for Tech Logos](https://simpleicons.org/)

---

Replace `{owner}` and `{repo}` dengan GitHub username dan repository name Anda!

