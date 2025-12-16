pipeline {
    agent any
    
    // NodeJS is already installed on the system (/usr/local/bin/node)
    // Uncomment below if you want to use Jenkins NodeJS tool instead:
    // tools {
    //     nodejs 'Node-20'
    // }
    
    parameters {
        choice(
            name: 'TEST_TYPE',
            choices: ['all', 'appium-only', 'cypress-only', 'basic-checks-only'],
            description: 'Select test type to run'
        )
        choice(
            name: 'ANDROID_API_LEVEL',
            choices: ['30', '29', '31', '33'],
            description: 'Android API Level for Appium tests'
        )
        choice(
            name: 'CYPRESS_BROWSER',
            choices: ['chrome', 'firefox', 'edge'],
            description: 'Browser for Cypress tests'
        )
        booleanParam(
            name: 'ENABLE_DEPLOYMENT',
            defaultValue: false,
            description: 'Enable deployment to staging after tests pass'
        )
    }
    
    environment {
        NODE_VERSION = '20.x'
        JAVA_VERSION = '11'
        APPIUM_VERSION = 'latest'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo "Checking out code from GitHub..."
                checkout scm
                
                script {
                    env.GIT_COMMIT_MSG = sh(
                        script: 'git log -1 --pretty=%B',
                        returnStdout: true
                    ).trim()
                    env.GIT_AUTHOR = sh(
                        script: 'git log -1 --pretty=%an',
                        returnStdout: true
                    ).trim()
                }
                
                echo "Commit: ${env.GIT_COMMIT_MSG}"
                echo "Author: ${env.GIT_AUTHOR}"
            }
        }
        
        stage('Setup Environment') {
            steps {
                echo "Setting up Node.js ${NODE_VERSION}..."
                sh '''
                    node --version
                    npm --version
                '''
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo "Installing npm dependencies..."
                sh 'npm ci'
            }
        }
        
        stage('Basic Checks') {
            when {
                expression { 
                    params.TEST_TYPE == 'all' || params.TEST_TYPE == 'basic-checks-only' 
                }
            }
            parallel {
                stage('TypeScript Check - Appium') {
                    steps {
                        echo "Running TypeScript compilation check for Appium..."
                        sh 'npx tsc --noEmit -p appium/tsconfig.json'
                    }
                }
                stage('TypeScript Check - Cypress') {
                    steps {
                        echo "Running TypeScript compilation check for Cypress..."
                        sh 'npx tsc --noEmit -p cypress/tsconfig.json'
                    }
                }
                stage('TypeScript Check - Test Specs') {
                    steps {
                        echo "Running TypeScript check for test specs..."
                        sh 'npx tsc --noEmit -p appium/test/tsconfig.json'
                    }
                }
                stage('Dependency Audit') {
                    steps {
                        echo "Running npm audit..."
                        sh 'npm audit --audit-level=moderate || true'
                    }
                }
            }
        }
        
        stage('Cypress Tests') {
            when {
                expression { 
                    params.TEST_TYPE == 'all' || params.TEST_TYPE == 'cypress-only' 
                }
            }
            steps {
                echo "Running Cypress tests on ${params.CYPRESS_BROWSER}..."
                sh """
                    npx cypress run --browser ${params.CYPRESS_BROWSER} \
                        --config-file cypress/cypress.config.ts \
                        --spec 'cypress/e2e/**/*.cy.ts'
                """
            }
            post {
                always {
                    archiveArtifacts artifacts: 'cypress/screenshots/**', allowEmptyArchive: true
                    archiveArtifacts artifacts: 'cypress/videos/**', allowEmptyArchive: true
                    archiveArtifacts artifacts: 'cypress/results/**', allowEmptyArchive: true
                }
            }
        }
        
        stage('Appium Android Tests') {
            when {
                expression { 
                    params.TEST_TYPE == 'all' || params.TEST_TYPE == 'appium-only' 
                }
            }
            steps {
                echo "Running Appium Android tests with API Level ${params.ANDROID_API_LEVEL}..."
                
                script {
                    // Create email config (only if credentials exist)
                    try {
                        withCredentials([
                            string(credentialsId: 'EMAIL_USER', variable: 'EMAIL_USER'),
                            string(credentialsId: 'EMAIL_PASS', variable: 'EMAIL_PASS'),
                            string(credentialsId: 'IMAP_HOST', variable: 'IMAP_HOST'),
                            string(credentialsId: 'IMAP_PORT', variable: 'IMAP_PORT')
                        ]) {
                            sh """
                                mkdir -p appium/config
                                cat > appium/config/email.env << EOF
EMAIL_USER=${EMAIL_USER}
EMAIL_PASS=${EMAIL_PASS}
IMAP_HOST=${IMAP_HOST}
IMAP_PORT=${IMAP_PORT}
EOF
                            """
                        }
                    } catch (Exception e) {
                        echo "Warning: Email credentials not found. Email tests may fail."
                        sh """
                            mkdir -p appium/config
                            cat > appium/config/email.env << EOF
EMAIL_USER=test@example.com
EMAIL_PASS=dummy
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
EOF
                        """
                    }
                    
                    // Install and setup Appium
                    sh """
                        npm install -g appium@${APPIUM_VERSION}
                        appium driver install uiautomator2
                        appium --version
                        appium driver list --installed
                    """
                    
                    // Check if running on macOS (for emulator support)
                    def isMacOS = sh(
                        script: 'uname',
                        returnStdout: true
                    ).trim() == 'Darwin'
                    
                    if (isMacOS) {
                        echo "Running on macOS - starting Android Emulator..."
                        
                        // Start Android Emulator
                        sh """
                            echo "Setting up Android Emulator..."
                            
                            # Create AVD if not exists
                            avdmanager create avd -n test_avd_${params.ANDROID_API_LEVEL} \
                                -k "system-images;android-${params.ANDROID_API_LEVEL};google_apis;x86_64" \
                                --force || true
                            
                            # Start emulator in background
                            \$ANDROID_HOME/emulator/emulator -avd test_avd_${params.ANDROID_API_LEVEL} \
                                -no-window -no-audio -no-boot-anim -gpu swiftshader_indirect \
                                -camera-back none -camera-front none > emulator.log 2>&1 &
                            
                            # Wait for device
                            echo "Waiting for emulator to boot..."
                            adb wait-for-device shell 'while [[ -z \$(getprop sys.boot_completed) ]]; do sleep 1; done'
                            sleep 10
                            
                            # Verify device
                            adb devices -l
                            
                            # Get device UDID
                            export DEVICE_UDID=\$(adb devices | grep -w "device" | awk '{print \$1}' | head -n 1)
                            echo "Device UDID: \$DEVICE_UDID"
                        """
                        
                        // Start Appium server
                        sh """
                            echo "Starting Appium server..."
                            appium -p 4725 > appium.log 2>&1 &
                            APPIUM_PID=\$!
                            echo \$APPIUM_PID > appium.pid
                            
                            echo "Waiting for Appium server..."
                            timeout 30 bash -c 'until curl -s http://localhost:4725/status > /dev/null; do echo "Waiting..."; sleep 2; done'
                            echo "Appium server is ready"
                        """
                        
                        // Run tests
                        try {
                            sh 'npm run wdio:appium'
                        } finally {
                            // Cleanup
                            sh """
                                echo "Stopping Appium server..."
                                if [ -f appium.pid ]; then
                                    kill \$(cat appium.pid) || true
                                    rm appium.pid
                                fi
                                
                                echo "Stopping emulator..."
                                adb emu kill || true
                            """
                        }
                    } else {
                        echo "WARNING: Not running on macOS. Skipping Android Emulator tests."
                        echo "Please configure Jenkins agent with macOS for Android testing."
                    }
                }
            }
            post {
                always {
                    archiveArtifacts artifacts: 'appium.log', allowEmptyArchive: true
                    archiveArtifacts artifacts: 'emulator.log', allowEmptyArchive: true
                    archiveArtifacts artifacts: 'appium/logs/**', allowEmptyArchive: true
                    archiveArtifacts artifacts: 'appium/screenshots/**', allowEmptyArchive: true
                    archiveArtifacts artifacts: 'appium/reports/**', allowEmptyArchive: true
                }
            }
        }
        
        stage('Deploy to Staging') {
            when {
                expression { 
                    params.ENABLE_DEPLOYMENT && 
                    (env.BRANCH_NAME == 'main' || env.BRANCH_NAME == 'master')
                }
            }
            steps {
                echo "Deploying to staging environment..."
                sh '''
                    echo "Staging deployment placeholder"
                    echo "Commit: $GIT_COMMIT"
                    echo "Branch: $BRANCH_NAME"
                    
                    # Add your deployment commands here:
                    # - SSH to staging server
                    # - Docker deployment
                    # - Kubernetes deployment
                    # - etc.
                '''
            }
        }
        
        stage('Deploy to Production') {
            when {
                expression { 
                    params.ENABLE_DEPLOYMENT && 
                    env.TAG_NAME != null
                }
            }
            steps {
                input message: 'Deploy to Production?', ok: 'Deploy'
                
                echo "Deploying to production environment..."
                sh '''
                    echo "Production deployment placeholder"
                    echo "Tag: $TAG_NAME"
                    echo "Commit: $GIT_COMMIT"
                    
                    # Add your production deployment commands here
                '''
            }
        }
    }
    
    post {
        always {
            echo "Pipeline completed!"
            
            // Clean workspace
            cleanWs()
        }
        success {
            echo "✅ Build succeeded!"
            
            // Send notification (configure email/slack in Jenkins)
            // emailext (
            //     subject: "Jenkins Build Success: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
            //     body: "Build succeeded for ${env.GIT_COMMIT_MSG}",
            //     to: "team@example.com"
            // )
        }
        failure {
            echo "❌ Build failed!"
            
            // Send failure notification
            // emailext (
            //     subject: "Jenkins Build Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
            //     body: "Build failed for ${env.GIT_COMMIT_MSG}",
            //     to: "team@example.com"
            // )
        }
    }
}

