#!/bin/bash

echo "======================================"
echo "Vercel Deployment Helper"
echo "======================================"
echo ""
echo "Your code has been pushed to GitHub."
echo ""
echo "🚀 AUTO-DEPLOYMENT:"
echo "If your GitHub repo is connected to Vercel, the deployment should"
echo "happen automatically. Check: https://vercel.com/dashboard"
echo ""
echo "📊 TO CHECK DEPLOYMENT STATUS:"
echo "1. Go to https://vercel.com/dashboard"
echo "2. Look for the 'appinnospot' project"
echo "3. You should see a new deployment in progress or completed"
echo ""
echo "🔧 IF AUTO-DEPLOY IS NOT WORKING:"
echo ""
echo "Option 1: Connect GitHub to Vercel (Recommended)"
echo "  1. Go to https://vercel.com/dashboard"
echo "  2. Click on your 'appinnospot' project"
echo "  3. Go to Settings → Git"
echo "  4. Connect to GitHub repository: aiborg-ai/empty-page-play"
echo "  5. Set production branch to 'main'"
echo ""
echo "Option 2: Manual Deploy with CLI"
echo "  1. Run: npx vercel login"
echo "  2. Run: npx vercel --prod"
echo ""
echo "🔗 Your app URL: https://appinnospot.vercel.app"
echo ""
echo "Would you like to proceed with manual deployment? (y/n)"
read -r response

if [[ "$response" == "y" || "$response" == "Y" ]]; then
    echo ""
    echo "Starting manual deployment process..."
    echo "First, you need to login to Vercel:"
    npx vercel login
    
    echo ""
    echo "Now deploying to production..."
    npx vercel --prod
else
    echo ""
    echo "Please check your Vercel dashboard for auto-deployment status:"
    echo "https://vercel.com/dashboard"
fi