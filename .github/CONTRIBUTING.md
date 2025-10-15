# 🤝 Contributing to Noriba Test Automation

Thank you for your interest in contributing! This guide will help you get started.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [CI/CD Requirements](#cicd-requirements)

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- Git
- Android Studio (for Appium tests)
- Java JDK 11+

### Setup Development Environment

```bash
# Clone the repository
git clone <repository-url>
cd noriba_test

# Install dependencies
npm install

# Install Appium globally
npm install -g appium

# Install Appium drivers
appium driver install uiautomator2

# Verify setup
npm run wdio:appium -- --spec ./appium/test/specs/4-login.ts
```

## 🔄 Development Workflow

### 1. Create a Branch

```bash
# Create feature branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name

# For bug fixes
git checkout -b fix/bug-description

# For documentation
git checkout -b docs/what-you-are-documenting
```

### Branch Naming Convention

- `feature/` - New features
- `fix/` - Bug fixes
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests
- `docs/` - Documentation changes
- `chore/` - Maintenance tasks

### 2. Make Changes

Follow our [code standards](#code-standards) and ensure:
- Code is properly formatted
- TypeScript types are correct
- Tests are added/updated
- Documentation is updated

### 3. Test Locally

```bash
# Type checking
npx tsc --noEmit -p appium/tsconfig.json
npx tsc --noEmit -p cypress/tsconfig.json

# Run tests
npm run wdio:appium
npm run cypress:run

# Security audit
npm audit --audit-level=moderate
```

### 4. Commit Changes

Use conventional commits:

```bash
# Format: <type>(<scope>): <description>

git commit -m "feat(login): add biometric authentication support"
git commit -m "fix(register): resolve email validation issue"
git commit -m "test(product): add product request flow tests"
git commit -m "docs(readme): update installation instructions"
git commit -m "refactor(helpers): optimize email helper methods"
```

**Commit Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `test` - Tests
- `refactor` - Code refactoring
- `style` - Formatting
- `chore` - Maintenance
- `perf` - Performance improvement

### 5. Push and Create PR

```bash
# Push your branch
git push origin feature/your-feature-name

# Create Pull Request using GitHub CLI
gh pr create --base develop --title "Add new feature" --body "Description"

# Or create PR via GitHub web interface
```

## 📝 Code Standards

### TypeScript

```typescript
// ✅ Good
interface UserCredentials {
  phone: string;
  password: string;
}

async function loginUser(credentials: UserCredentials): Promise<void> {
  await phoneInput.setValue(credentials.phone);
  await passwordInput.setValue(credentials.password);
  await loginButton.click();
}

// ❌ Bad
async function loginUser(phone: any, pass: any) {
  await phoneInput.setValue(phone);
  await passwordInput.setValue(pass);
  await loginButton.click();
}
```

### File Organization

```
test/
├── helpers/          # Utility functions
├── pageobjects/      # Page Object Models
└── specs/            # Test specifications
```

### Naming Conventions

**Files:**
- `kebab-case.ts` for all files
- `PascalCase.ts` for classes

**Variables/Functions:**
- `camelCase` for variables and functions
- `UPPER_SNAKE_CASE` for constants
- Descriptive names (avoid abbreviations)

**Test Descriptions:**
```typescript
// ✅ Good
describe('User Login', () => {
  it('should successfully login with valid credentials', async () => {
    // test code
  });
});

// ❌ Bad
describe('Login', () => {
  it('test 1', async () => {
    // test code
  });
});
```

### Comments

```typescript
// ✅ Good - Explain WHY, not WHAT
// Shift tap position to avoid bottom navigation overlay
const tapY = Math.round(y + height / 2 - 40);

// ❌ Bad - States the obvious
// Set tap Y coordinate
const tapY = Math.round(y + height / 2 - 40);
```

## 🧪 Testing Guidelines

### Writing Tests

**Test Structure:**
```typescript
describe('Feature Name', () => {
  let page: Page;

  before(async () => {
    // Setup
    page = new Page();
  });

  beforeEach(async () => {
    // Run before each test
  });

  it('should do something specific', async () => {
    // Arrange
    const credentials = { phone: '123', password: 'pass' };
    
    // Act
    await loginPage.login(credentials);
    
    // Assert
    await expect(homePage.title).toBeDisplayed();
  });

  afterEach(async () => {
    // Cleanup after each test
  });

  after(async () => {
    // Final cleanup
  });
});
```

### Best Practices

1. **One assertion per test** (when possible)
2. **Independent tests** - Each test should run independently
3. **Descriptive test names** - Clearly state what is being tested
4. **Use Page Objects** - Keep selectors in page objects
5. **Proper waits** - Use explicit waits, avoid hardcoded `pause()`
6. **Clean up** - Reset state after tests

### Page Object Pattern

```typescript
// ✅ Good
class LoginPage extends Page {
  get phoneInput() {
    return $('//android.widget.EditText[1]');
  }
  
  get passwordInput() {
    return $('//android.widget.EditText[2]');
  }
  
  async login(phone: string, password: string): Promise<void> {
    await this.phoneInput.setValue(phone);
    await this.passwordInput.setValue(password);
    await this.loginButton.click();
  }
}

// In test
await loginPage.login('082339582790', 'Test123!');

// ❌ Bad - Selectors in test file
await $('//android.widget.EditText[1]').setValue('082339582790');
```

## 🔀 Pull Request Process

### Before Creating PR

Checklist:
- [ ] Code follows style guidelines
- [ ] All tests pass locally
- [ ] New tests added for new features
- [ ] Documentation updated
- [ ] No console.log statements (use proper logging)
- [ ] TypeScript compiles without errors
- [ ] Commits follow conventional commit format

### PR Template

Use the provided template (`.github/PULL_REQUEST_TEMPLATE.md`):
- Describe your changes
- Link related issues
- Add screenshots/videos if applicable
- Check all applicable boxes

### Review Process

1. **Create PR** to `develop` branch
2. **CI checks run** automatically
3. **Wait for review** from team members
4. **Address feedback** if requested
5. **Merge** after approval and passing checks

### PR Requirements

- ✅ All CI checks must pass
- ✅ At least 1 approval required
- ✅ Branch up to date with base branch
- ✅ No merge conflicts

## 🤖 CI/CD Requirements

### Automated Checks

Every PR triggers:
1. **TypeScript compilation** - Must compile without errors
2. **Dependency check** - No vulnerable dependencies
3. **Cypress tests** - E2E tests must pass
4. **(Optional) Appium tests** - Mobile tests (on main branch)

### Local Verification

Run these before pushing:

```bash
# Quick checks (fast)
npx tsc --noEmit -p appium/tsconfig.json
npx tsc --noEmit -p cypress/tsconfig.json
npx tsc --noEmit -p appium/test/tsconfig.json

# Full test suite (comprehensive)
npm run cypress:run
npm run wdio:appium
```

### Artifacts

If tests fail, check artifacts:
- Screenshots (on test failure)
- Videos (all Cypress runs)
- Logs (Appium server logs)

## 📚 Adding Documentation

### When to Document

Document:
- New features
- Complex logic
- Setup procedures
- API changes
- Breaking changes

### Where to Document

- **Code comments** - Complex logic
- **README.md** - Project overview, setup
- **appium/docs/** - Appium-specific guides
- **CI_CD_SETUP.md** - CI/CD procedures
- **Inline JSDoc** - Functions and classes

### Documentation Style

```typescript
/**
 * Scrolls to find an element by content description
 * @param text - The content description to search for
 * @param attribute - The attribute type (default: 'text')
 * @returns Promise that resolves when element is found
 */
async scrollAndFindElement(
  text: string,
  attribute: string = 'text'
): Promise<void> {
  // Implementation
}
```

## 🐛 Reporting Bugs

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g., macOS, Windows]
- Node version: [e.g., 20.x]
- Appium version: [e.g., 3.0.2]

**Additional context**
Any other context about the problem.
```

## ✨ Suggesting Features

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Any alternative solutions or features.

**Additional context**
Any other context or screenshots.
```

## 🎯 Areas to Contribute

Looking for where to start?

### Good First Issues
- Adding missing test cases
- Improving error messages
- Documentation updates
- Code comments

### Advanced Contributions
- New page objects
- Helper utilities
- Performance optimizations
- CI/CD improvements

## 💬 Communication

### Questions?
- Check existing documentation
- Review closed issues/PRs
- Contact team members

### Discussions
- Use PR comments for code-specific questions
- Use issues for feature discussions
- Tag relevant team members

## 🏆 Recognition

Contributors will be:
- Listed in project documentation
- Mentioned in release notes
- Credited in commit history

## 📜 Code of Conduct

### Our Standards

- ✅ Be respectful and inclusive
- ✅ Accept constructive criticism gracefully
- ✅ Focus on what's best for the project
- ✅ Show empathy towards others

### Not Acceptable

- ❌ Harassment or discriminatory language
- ❌ Personal attacks
- ❌ Spam or trolling

## 🔗 Resources

- [Main README](../README.md)
- [CI/CD Setup Guide](../CI_CD_SETUP.md)
- [Quick Start](.github/QUICK_START.md)
- [WebdriverIO Docs](https://webdriver.io/)
- [Cypress Docs](https://docs.cypress.io/)

## 📞 Contact

For questions or help:
- Create an issue
- Contact automation test team
- Review documentation

---

**Thank you for contributing to Noriba Test Automation!** 🎉

Every contribution, no matter how small, helps improve the quality of our testing suite.

