#!/bin/bash

# GitHub Push Script
# This script helps push your code to GitHub with proper authentication

echo "==================================="
echo "GitHub Push Helper"
echo "==================================="
echo ""
echo "To push your code, you'll need:"
echo "1. GitHub username with write access to aiborg-ai/empty-page-play"
echo "2. Personal Access Token (PAT) with 'repo' scope"
echo ""
echo "To create a PAT:"
echo "  1. Go to: https://github.com/settings/tokens"
echo "  2. Click 'Generate new token (classic)'"
echo "  3. Name it (e.g., 'InnoSpot Push')"
echo "  4. Select the 'repo' checkbox"
echo "  5. Click 'Generate token' and copy it"
echo ""
read -p "Enter your GitHub username: " GITHUB_USER
read -s -p "Enter your Personal Access Token: " GITHUB_TOKEN
echo ""

# Construct the authenticated URL
AUTH_URL="https://${GITHUB_USER}:${GITHUB_TOKEN}@github.com/aiborg-ai/empty-page-play.git"

echo ""
echo "Pushing to GitHub..."
git push $AUTH_URL main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo "Your changes are now live on the main branch."
else
    echo ""
    echo "❌ Push failed. Please check your credentials and try again."
    echo "Make sure your account has write access to the repository."
fi