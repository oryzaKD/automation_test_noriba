#!/bin/bash

# Script untuk check Jenkins credentials yang sudah ada
# Note: Ini hanya check apakah credentials ID exists, tidak bisa lihat password/token

echo "🔍 Checking Jenkins Credentials..."
echo ""

JENKINS_URL="http://localhost:8080"

# Check if Jenkins is running
if ! curl -s -o /dev/null -w "%{http_code}" "$JENKINS_URL" | grep -q "200\|403"; then
    echo "❌ Jenkins is not running or not accessible"
    echo "Start Jenkins with: brew services start jenkins-lts"
    exit 1
fi

echo "✅ Jenkins is running"
echo ""

# List of required credentials
echo "📋 Required Credentials for This Project:"
echo ""
echo "1. GitHub Credentials:"
echo "   ID: github-credentials"
echo "   Type: Username with password"
echo "   Username: oryzaKD"
echo "   Password: <GitHub PAT>"
echo ""
echo "2. Email Credentials (4 items):"
echo "   - EMAIL_USER (Secret text)"
echo "   - EMAIL_PASS (Secret text)"
echo "   - IMAP_HOST (Secret text)"
echo "   - IMAP_PORT (Secret text)"
echo ""

echo "📍 To view credentials in Jenkins:"
echo "   → Open: $JENKINS_URL/manage/credentials/"
echo ""
echo "   Or run: open $JENKINS_URL/manage/credentials/"
echo ""

echo "⚠️  Note: For security reasons, passwords/tokens cannot be viewed"
echo "   after they are saved in Jenkins."
echo ""

echo "🔗 Quick Links:"
echo "   Jenkins Credentials: $JENKINS_URL/manage/credentials/"
echo "   GitHub Tokens: https://github.com/settings/tokens"
echo "   Your GitHub Profile: https://github.com/oryzaKD"
echo "   Your Repository: https://github.com/oryzaKD/automation_test_noriba"
echo ""

