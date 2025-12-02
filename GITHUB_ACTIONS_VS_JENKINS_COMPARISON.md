# 🔄 GitHub Actions vs Jenkins: Side-by-Side Comparison

Perbandingan detail implementasi CI/CD antara GitHub Actions dan Jenkins untuk proyek ini.

---

## 📊 High-Level Overview

| Feature | GitHub Actions | Jenkins |
|---------|----------------|---------|
| **Configuration File** | `.github/workflows/*.yml` | `Jenkinsfile` |
| **Trigger on Push** | `on: push` | Webhook + `githubPush()` |
| **Trigger on Schedule** | `on: schedule: cron` | `triggers { cron() }` |
| **Manual Trigger** | `on: workflow_dispatch` | Build with Parameters |
| **Secrets Management** | GitHub Secrets | Jenkins Credentials |
| **Artifacts** | `actions/upload-artifact` | `archiveArtifacts` |
| **Matrix Builds** | `strategy.matrix` | Pipeline matrix/parallel |
| **Deployment** | Separate jobs | Pipeline stages |

---

## 🔍 Detailed Comparison

### 1. Appium Android Tests

#### GitHub Actions (`appium-android.yml`)
```yaml
name: Appium Android Tests
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
  workflow_dispatch:

jobs:
  appium-android-test:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20.x'
      - run: npm ci
      - uses: reactivecircus/android-emulator-runner@v2
        with:
          api-level: 30
          script: npm run wdio:appium
```

#### Jenkins (`Jenkinsfile` or `Jenkinsfile.appium`)
```groovy
pipeline {
    agent { label 'macos' }
    
    triggers {
        githubPush()  // Push trigger via webhook
    }
    
    parameters {
        choice(name: 'ANDROID_API_LEVEL', choices: ['30', '29', '31'])
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Setup') {
            steps {
                sh 'npm ci'
            }
        }
        
        stage('Run Tests') {
            steps {
                sh '''
                    # Start emulator
                    emulator -avd test_avd_30 -no-window &
                    adb wait-for-device
                    
                    # Start Appium
                    appium &
                    
                    # Run tests
                    npm run wdio:appium
                '''
            }
        }
    }
    
    post {
        always {
            archiveArtifacts artifacts: 'appium/logs/**'
        }
    }
}
```

**Key Differences:**
- ✅ GitHub Actions: Menggunakan pre-built action (`android-emulator-runner`)
- ✅ Jenkins: Manual setup emulator (lebih control)
- ✅ GitHub Actions: Otomatis cleanup
- ✅ Jenkins: Perlu explicit cleanup

---

### 2. Cypress Tests

#### GitHub Actions (`cypress.yml`)
```yaml
name: Cypress E2E Tests
on:
  push:
    branches: [main, develop]

jobs:
  cypress-run:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        browser: [chrome, firefox, edge]
    
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - uses: cypress-io/github-action@v6
        with:
          browser: ${{ matrix.browser }}
```

#### Jenkins (`Jenkinsfile.cypress`)
```groovy
pipeline {
    agent any
    
    parameters {
        choice(name: 'BROWSER', choices: ['chrome', 'firefox', 'edge'])
    }
    
    stages {
        stage('Checkout') {
            steps { checkout scm }
        }
        
        stage('Test') {
            steps {
                sh 'npm ci'
                sh "npx cypress run --browser ${params.BROWSER}"
            }
        }
    }
    
    post {
        always {
            archiveArtifacts 'cypress/videos/**,cypress/screenshots/**'
        }
    }
}
```

**Matrix Build Alternative (Jenkins):**
```groovy
stage('Cypress Tests') {
    matrix {
        axes {
            axis {
                name 'BROWSER'
                values 'chrome', 'firefox', 'edge'
            }
        }
        stages {
            stage('Test') {
                steps {
                    sh "npx cypress run --browser ${BROWSER}"
                }
            }
        }
    }
}
```

---

### 3. Scheduled/Nightly Tests

#### GitHub Actions (`nightly-tests.yml`)
```yaml
name: Nightly Full Test Suite
on:
  schedule:
    - cron: '0 2 * * *'  # 2 AM UTC daily
  workflow_dispatch:

jobs:
  full-test-suite:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run cypress:run
      - run: npm run wdio:appium
```

#### Jenkins (`Jenkinsfile`)
```groovy
pipeline {
    agent any
    
    triggers {
        cron('H 2 * * *')  // 2 AM daily (H = hash for load distribution)
    }
    
    stages {
        stage('Checkout') {
            steps { checkout scm }
        }
        
        stage('Setup') {
            steps { sh 'npm ci' }
        }
        
        stage('Tests') {
            parallel {
                stage('Cypress') {
                    steps { sh 'npm run cypress:run' }
                }
                stage('Appium') {
                    agent { label 'macos' }
                    steps { sh 'npm run wdio:appium' }
                }
            }
        }
    }
}
```

**Cron Syntax:**
- GitHub Actions: Standard cron (`0 2 * * *`)
- Jenkins: Same, but `H` untuk hash-based distribution (`H 2 * * *`)

---

### 4. Deployment Pipeline

#### GitHub Actions (`ci.yml`)
```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: npm test
  
  deploy-staging:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploy to staging"
  
  deploy-production:
    needs: test
    if: startsWith(github.ref, 'refs/tags/v')
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploy to production"
```

#### Jenkins (`Jenkinsfile`)
```groovy
pipeline {
    agent any
    
    parameters {
        booleanParam(name: 'ENABLE_DEPLOYMENT', defaultValue: false)
    }
    
    stages {
        stage('Test') {
            steps { sh 'npm test' }
        }
        
        stage('Deploy Staging') {
            when {
                expression { 
                    params.ENABLE_DEPLOYMENT && 
                    env.BRANCH_NAME == 'main' 
                }
            }
            steps {
                sh 'echo "Deploy to staging"'
            }
        }
        
        stage('Deploy Production') {
            when {
                expression { 
                    params.ENABLE_DEPLOYMENT && 
                    env.TAG_NAME != null 
                }
            }
            steps {
                input message: 'Deploy to Production?'
                sh 'echo "Deploy to production"'
            }
        }
    }
}
```

**Key Differences:**
- ✅ GitHub Actions: Auto-deploy based on branch/tag
- ✅ Jenkins: Requires parameter + manual approval (safer!)

---

### 5. Secrets/Credentials

#### GitHub Actions
```yaml
jobs:
  test:
    steps:
      - name: Setup env
        run: |
          echo "EMAIL_USER=${{ secrets.EMAIL_USER }}" >> config/email.env
          echo "EMAIL_PASS=${{ secrets.EMAIL_PASS }}" >> config/email.env
```

**Setup:**
- GitHub Repo → Settings → Secrets → Add

#### Jenkins
```groovy
stage('Setup') {
    steps {
        withCredentials([
            string(credentialsId: 'EMAIL_USER', variable: 'EMAIL_USER'),
            string(credentialsId: 'EMAIL_PASS', variable: 'EMAIL_PASS')
        ]) {
            sh '''
                cat > config/email.env << EOF
EMAIL_USER=${EMAIL_USER}
EMAIL_PASS=${EMAIL_PASS}
EOF
            '''
        }
    }
}
```

**Setup:**
- Jenkins → Credentials → Add → Secret text

---

### 6. Artifacts & Logs

#### GitHub Actions
```yaml
jobs:
  test:
    steps:
      - run: npm test
      
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: test-results
          path: |
            logs/**
            screenshots/**
```

#### Jenkins
```groovy
pipeline {
    stages {
        stage('Test') {
            steps { sh 'npm test' }
        }
    }
    
    post {
        always {
            archiveArtifacts artifacts: 'logs/**,screenshots/**', 
                           allowEmptyArchive: true
        }
    }
}
```

**Access:**
- GitHub Actions: Actions tab → Workflow run → Artifacts
- Jenkins: Build page → Artifacts

---

### 7. Parallel Execution

#### GitHub Actions
```yaml
jobs:
  test:
    strategy:
      matrix:
        node: [18, 20]
        browser: [chrome, firefox]
    runs-on: ubuntu-latest
    steps:
      - run: npm test
```
**Result:** 4 jobs (2 nodes × 2 browsers)

#### Jenkins (Option 1: Matrix)
```groovy
pipeline {
    agent any
    stages {
        stage('Test') {
            matrix {
                axes {
                    axis { name 'NODE_VERSION'; values '18', '20' }
                    axis { name 'BROWSER'; values 'chrome', 'firefox' }
                }
                stages {
                    stage('Run') {
                        steps {
                            sh "nvm use ${NODE_VERSION} && npm test"
                        }
                    }
                }
            }
        }
    }
}
```

#### Jenkins (Option 2: Parallel)
```groovy
stage('Tests') {
    parallel {
        stage('Chrome') {
            steps { sh 'npm test -- --browser=chrome' }
        }
        stage('Firefox') {
            steps { sh 'npm test -- --browser=firefox' }
        }
    }
}
```

---

### 8. Conditional Execution

#### GitHub Actions
```yaml
jobs:
  deploy:
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    steps:
      - run: deploy.sh
```

#### Jenkins
```groovy
stage('Deploy') {
    when {
        expression { 
            env.GIT_BRANCH == 'origin/main' 
        }
    }
    steps {
        sh 'deploy.sh'
    }
}
```

**Other Conditions:**
```groovy
when {
    branch 'main'                    // Specific branch
    tag 'v*'                         // Tag pattern
    environment name: 'DEPLOY', value: 'true'
    expression { return params.DEPLOY }
    anyOf { branch 'main'; branch 'develop' }
    allOf { branch 'main'; environment name: 'PROD', value: 'true' }
}
```

---

### 9. Notifications

#### GitHub Actions
```yaml
jobs:
  notify:
    if: always()
    steps:
      - name: Send Slack notification
        uses: slackapi/slack-github-action@v1
        with:
          webhook-url: ${{ secrets.SLACK_WEBHOOK }}
```

#### Jenkins
```groovy
post {
    success {
        slackSend(
            channel: '#ci-cd',
            color: 'good',
            message: "Build ${env.BUILD_NUMBER} succeeded"
        )
    }
    failure {
        emailext(
            to: 'team@company.com',
            subject: "Build Failed: ${env.JOB_NAME}",
            body: "Check ${env.BUILD_URL}"
        )
    }
}
```

---

## 🎯 Feature Parity Checklist

| Feature | GitHub Actions | Jenkins |
|---------|----------------|---------|
| Auto-trigger on push | ✅ | ✅ (webhook) |
| Scheduled runs | ✅ | ✅ |
| Manual trigger | ✅ | ✅ |
| Matrix builds | ✅ | ✅ |
| Parallel execution | ✅ | ✅ |
| Conditional stages | ✅ | ✅ |
| Secrets management | ✅ | ✅ |
| Artifact storage | ✅ | ✅ |
| Test reporting | ✅ | ✅ (with plugins) |
| Notifications | ✅ | ✅ (with plugins) |
| Environment variables | ✅ | ✅ |
| Multi-platform | ✅ | ✅ (multi-agent) |

---

## 💡 Migration Tips

### 1. Start Simple
Migrate basic checks first, then complex workflows.

### 2. Use Parameters
Convert GitHub Actions `workflow_dispatch` inputs to Jenkins parameters.

### 3. Leverage Plugins
Many GitHub Actions have Jenkins plugin equivalents:
- `actions/checkout` → Built-in `checkout scm`
- `actions/setup-node` → NodeJS plugin
- `actions/cache` → Pipeline Stage View plugin
- `actions/upload-artifact` → Built-in `archiveArtifacts`

### 4. Environment Variables
Map GitHub environment variables:
```
GitHub Actions          → Jenkins
${{ github.sha }}       → ${env.GIT_COMMIT}
${{ github.ref }}       → ${env.GIT_BRANCH}
${{ github.repository }}→ ${env.JOB_NAME}
${{ github.actor }}     → ${env.BUILD_USER}
```

### 5. Testing
Run both pipelines in parallel during transition period.

---

## 📚 Quick Reference

### Trigger Mapping
```yaml
# GitHub Actions
on:
  push:
    branches: [main]
  pull_request:
  schedule:
    - cron: '0 2 * * *'
  workflow_dispatch:
```

```groovy
// Jenkins
triggers {
    githubPush()
    cron('H 2 * * *')
}
// workflow_dispatch = "Build with Parameters" (automatic)
```

### Job/Stage Mapping
```yaml
# GitHub Actions
jobs:
  build:
    steps:
      - run: npm build
```

```groovy
// Jenkins
stages {
    stage('Build') {
        steps {
            sh 'npm build'
        }
    }
}
```

---

## ✅ Conclusion

**GitHub Actions** adalah lebih simple dan terintegrasi, cocok untuk:
- ✅ Small to medium projects
- ✅ Teams yang tidak mau maintain infrastructure
- ✅ Projects yang fully di GitHub

**Jenkins** memberikan lebih banyak control, cocok untuk:
- ✅ Large, complex projects
- ✅ Teams dengan dedicated DevOps
- ✅ Self-hosted infrastructure
- ✅ Multi-platform, multi-tool integration

**Both are powerful!** Pilih berdasarkan kebutuhan team dan infrastructure Anda.

---

**Dokumen ini membantu? Check other guides:**
- [JENKINS_SETUP.md](./JENKINS_SETUP.md)
- [JENKINS_QUICK_START.md](./JENKINS_QUICK_START.md)
- [MIGRATION_GITHUB_TO_JENKINS.md](./MIGRATION_GITHUB_TO_JENKINS.md)

