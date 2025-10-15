# 🤖 Noriba Test Automation

> Automation testing suite for Noriba mobile app using Appium and Cypress

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Running Tests Locally](#running-tests-locally)
- [CI/CD Setup](#cicd-setup)
- [Project Structure](#project-structure)
- [Documentation](#documentation)

## 🎯 Overview

This repository contains automated tests for the Noriba application:
- **Appium Tests**: Mobile app testing for Android
- **Cypress Tests**: Web application E2E testing

## 🛠️ Tech Stack

- **Node.js** 18.x or 20.x
- **Appium** 3.x - Mobile automation framework
- **WebdriverIO** 9.x - Test runner
- **Cypress** 15.x - E2E testing framework
- **TypeScript** - Type-safe testing
- **Mocha** - Test framework

## 🚀 Quick Start

### Prerequisites

- Node.js 18.x or higher
- Android Studio (for Appium tests)
- Java JDK 11 or higher
- Appium Inspector (optional, for element inspection)

### Installation

```bash
# Clone repository
git clone <repository-url>
cd noriba_test

# Install dependencies
npm install

# Install Appium globally
npm install -g appium

# Install Appium drivers
appium driver install uiautomator2
```

## 🧪 Running Tests Locally

### Appium Tests (Android)

1. **Start Appium Server**
   ```bash
   appium -p 4723
   ```

2. **Start Android Emulator**
   - Open Android Studio
   - Start an emulator (must match capabilities in `appium/wdio.conf.ts`)
   
   <img width="1512" height="945" alt="Screenshot 2025-09-18 at 10 42 32 AM" src="https://github.com/user-attachments/assets/d849180e-c244-41a2-ae30-fbab971aa89f" />

3. **(Optional) Open Appium Inspector**
   - Connect to the running emulator for element inspection
   
   <img width="1506" height="944" alt="image" src="https://github.com/user-attachments/assets/df1a9fed-3af5-4229-b505-28ceea00cba4" />

4. **Run Tests**
   ```bash
   # Run all Appium tests
   npm run wdio:appium
   
   # Run specific test file
   npx wdio run ./appium/wdio.conf.ts --spec ./appium/test/specs/3-register.ts
   
   # Run all test files in specs directory
   npx wdio run ./appium/wdio.conf.ts --spec ./appium/test/specs/*.ts
   ```

### Cypress Tests (Web)

```bash
# Open Cypress Test Runner (interactive mode)
npm run cypress:open

# Run Cypress tests in headless mode
npm run cypress:run
```

## 🔄 CI/CD Setup

This project uses **GitHub Actions** for continuous integration and deployment.

### Available Workflows

- ✅ **CI - Basic Checks**: Linting, type checking, dependency audit
- 🌐 **Cypress Tests**: E2E web tests on multiple browsers
- 📱 **Appium Android Tests**: Mobile automation with Android emulator
- 🌙 **Nightly Tests**: Full regression suite (runs daily at 9 AM WIB)
- 🎮 **Manual Test Runner**: Run specific tests on-demand

### Quick Setup

1. **Push workflows to repository:**
   ```bash
   git add .github/
   git commit -m "Add CI/CD workflows"
   git push origin main
   ```

2. **Configure GitHub Secrets:**
   - Navigate to: `Repository Settings → Secrets and variables → Actions`
   - Add required secrets (see `.github/SECRETS_TEMPLATE.md`)

3. **Enable GitHub Actions:**
   - Go to `Actions` tab in your repository
   - Enable workflows

### Detailed Documentation

📖 **[Complete CI/CD Setup Guide](./CI_CD_SETUP.md)** - Comprehensive setup instructions

📖 **[Workflow Documentation](./.github/workflows/README.md)** - Detailed workflow information

📖 **[Secrets Configuration](./.github/SECRETS_TEMPLATE.md)** - How to configure secrets

## 📁 Project Structure

```
noriba_test/
├── .github/
│   ├── workflows/              # GitHub Actions workflows
│   │   ├── ci-basic.yml        # Basic CI checks
│   │   ├── cypress.yml         # Cypress E2E tests
│   │   ├── appium-android.yml  # Appium mobile tests
│   │   ├── nightly-tests.yml   # Scheduled full regression
│   │   ├── manual-test-runner.yml  # On-demand test runner
│   │   └── README.md           # Workflow documentation
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── SECRETS_TEMPLATE.md
│
├── appium/                     # Appium test suite
│   ├── config/                 # Configuration files
│   │   └── email.env           # Email testing credentials
│   ├── docs/                   # Documentation
│   ├── test/
│   │   ├── helpers/            # Test utilities
│   │   ├── pageobjects/        # Page object models
│   │   └── specs/              # Test specifications
│   │       ├── 1-updateApp.ts
│   │       ├── 2-clearCache.ts
│   │       ├── 3-register.ts
│   │       ├── 4-login.ts
│   │       ├── 5-changePass.ts
│   │       ├── 6-forgotPass.ts
│   │       ├── 7-requestLimit.ts
│   │       └── 8-requestProduct.ts
│   ├── tsconfig.json
│   └── wdio.conf.ts            # WebdriverIO configuration
│
├── cypress/                    # Cypress test suite
│   ├── e2e/                    # E2E test specs
│   ├── fixtures/               # Test data
│   ├── support/                # Support files
│   └── cypress.config.ts       # Cypress configuration
│
├── CI_CD_SETUP.md              # CI/CD setup guide
├── package.json                # Dependencies & scripts
└── README.md                   # This file
```

## 📚 Documentation

### General Documentation
- [CI/CD Setup Guide](./CI_CD_SETUP.md)
- [GitHub Workflows](./.github/workflows/README.md)
- [Secrets Configuration](./.github/SECRETS_TEMPLATE.md)

### Appium Documentation
- [Element Finding Guide](./appium/docs/ELEMENT_FINDING_GUIDE.md)
- [Email Testing Guide](./appium/docs/EMAIL_TESTING_GUIDE.md)
- [Email Verification Flow](./appium/docs/EMAIL_VERIFICATION_FLOW.md)
- [Global Methods Guide](./appium/docs/GLOBAL_METHODS_GUIDE.md)

## 🤝 Contributing

1. Create a feature branch from `develop`
2. Make your changes
3. Ensure all tests pass locally
4. Create a Pull Request
5. Wait for CI checks to pass
6. Request review from team members

## 📝 Available Scripts

```bash
# Appium tests
npm run wdio:appium              # Run all Appium tests
npm run test                     # Run default test suite

# Cypress tests
npm run cypress:open             # Open Cypress Test Runner
npm run cypress:run              # Run Cypress in headless mode

# Email setup (if needed)
npm run setup:gmail              # Setup Gmail OAuth
npm run test:email-connection    # Test email connection
```

## 🐛 Troubleshooting

### Appium Server Won't Start
```bash
# Check if port 4723 is already in use
lsof -i :4723

# Kill process if needed
kill -9 <PID>
```

### Android Emulator Issues
- Ensure emulator matches capabilities in `appium/wdio.conf.ts`
- Check that emulator has sufficient RAM and storage
- Verify Android SDK is properly installed

### CI/CD Issues
- Check [CI_CD_SETUP.md](./CI_CD_SETUP.md) troubleshooting section
- Verify GitHub secrets are configured correctly
- Review workflow logs in GitHub Actions tab

## 📞 Support

For issues or questions:
1. Check existing documentation
2. Review troubleshooting guides
3. Contact the automation test team

---

**Last Updated:** October 2025  
**Maintained by:** PT Visi Syariah Umat (VisiCloud) - Automation Test Team
