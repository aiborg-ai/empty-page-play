#!/bin/bash

echo "======================================"
echo "🔍 Checking Deployment Status"
echo "======================================"
echo ""

# Check if the site is accessible
echo "Testing current live site..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" https://appinnospot.vercel.app)

if [ "$RESPONSE" = "200" ]; then
    echo "✅ Site is LIVE at: https://appinnospot.vercel.app"
    echo ""
    
    # Get the last modified header to see when it was last updated
    LAST_MODIFIED=$(curl -sI https://appinnospot.vercel.app | grep -i "last-modified" || echo "Unable to determine")
    echo "Last deployment info: $LAST_MODIFIED"
else
    echo "⚠️  Site returned status code: $RESPONSE"
fi

echo ""
echo "======================================"
echo "📋 Next Steps:"
echo "======================================"
echo ""
echo "1. CHECK VERCEL DASHBOARD (Recommended):"
echo "   → Go to: https://vercel.com/dashboard"
echo "   → Look for 'appinnospot' or 'empty-page-play' project"
echo "   → Check if there's a deployment in progress"
echo ""
echo "2. IF NOT AUTO-DEPLOYING:"
echo "   a) Connect GitHub to Vercel:"
echo "      → In Vercel Dashboard, go to your project"
echo "      → Settings → Git → Connect GitHub repo"
echo "      → Repository: aiborg-ai/empty-page-play"
echo "      → Branch: main"
echo ""
echo "   b) OR Manual Deploy:"
echo "      → Visit: https://vercel.com/new"
echo "      → Import from GitHub"
echo "      → Select: aiborg-ai/empty-page-play"
echo ""
echo "3. VERIFY NEW FEATURES:"
echo "   Once deployed, check for:"
echo "   ✓ Decision Engines in the menu"
echo "   ✓ Enhanced security features"
echo "   ✓ Updated UI components"
echo ""
echo "======================================"
echo "🎯 Important URLs:"
echo "======================================"
echo "Live App:     https://appinnospot.vercel.app"
echo "GitHub Repo:  https://github.com/aiborg-ai/empty-page-play"
echo "Vercel:       https://vercel.com/dashboard"
echo ""

# Try to detect if there's a recent commit
echo "======================================"
echo "📦 Recent Git Activity:"
echo "======================================"
git log --oneline -5 2>/dev/null || echo "Unable to fetch git history"
echo ""
echo "Your latest commit (90a0dac) with 78,600+ lines"
echo "should trigger auto-deployment if GitHub is connected."