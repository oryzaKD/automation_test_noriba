#!/bin/bash

# Script untuk verify GitHub credentials
# Jalankan setelah add credentials ke Jenkins

echo "🔍 Verifying GitHub Credentials..."
echo ""

# Get GitHub username
read -p "Enter your GitHub username: " GITHUB_USERNAME

# Get GitHub PAT
read -sp "Enter your GitHub Personal Access Token: " GITHUB_PAT
echo ""
echo ""

# Test 1: Verify PAT is valid
echo "📝 Test 1: Verifying GitHub token..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: token $GITHUB_PAT" https://api.github.com/user)

if [ "$RESPONSE" = "200" ]; then
    echo "✅ GitHub token is VALID"
else
    echo "❌ GitHub token is INVALID (HTTP $RESPONSE)"
    echo "Please check your token and try again."
    exit 1
fi

# Test 2: Test repository access
echo ""
echo "📝 Test 2: Testing repository access..."
read -p "Enter your GitHub repository name (e.g., username/noriba_test): " REPO_NAME

RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: token $GITHUB_PAT" "https://api.github.com/repos/$REPO_NAME")

if [ "$RESPONSE" = "200" ]; then
    echo "✅ Repository access is VALID"
else
    echo "❌ Cannot access repository (HTTP $RESPONSE)"
    echo "Please check repository name and token permissions."
    exit 1
fi

# Test 3: Test clone access
echo ""
echo "📝 Test 3: Testing git clone access..."
TEMP_DIR=$(mktemp -d)
cd "$TEMP_DIR"

if git ls-remote "https://${GITHUB_USERNAME}:${GITHUB_PAT}@github.com/${REPO_NAME}.git" &> /dev/null; then
    echo "✅ Git clone access is VALID"
else
    echo "❌ Git clone access FAILED"
    exit 1
fi

cd - > /dev/null
rm -rf "$TEMP_DIR"

echo ""
echo "🎉 All tests passed!"
echo ""
echo "✅ GitHub credentials are properly configured"
echo "✅ You can now use these credentials in Jenkins"
echo ""
echo "Next step: Create Pipeline Job in Jenkins"

