#!/bin/bash

echo "🎭 Playwright Editor Test Script"
echo "================================"
echo ""

# Check if dev server is running
echo "1. Checking if dev server is running..."
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Dev server is running"
else
    echo "❌ Dev server NOT running"
    echo "   Run: npm run dev"
    exit 1
fi

echo ""
echo "2. Checking if files exist..."

# Check if component exists
if [ -f "components/learning/playwright-practice-editor.tsx" ]; then
    echo "✅ PlaywrightPracticeEditor component exists"
else
    echo "❌ Component not found"
    exit 1
fi

# Check if config helper exists
if [ -f "lib/webcontainer/playwright-config.ts" ]; then
    echo "✅ WebContainer config helper exists"
else
    echo "❌ Config helper not found"
    exit 1
fi

# Check if migration exists
if [ -f "supabase/migrations/061_playwright_learning_module.sql" ]; then
    echo "✅ Migration file exists"
    # Count playwright-practice blocks
    COUNT=$(grep -c ":::playwright-practice" supabase/migrations/061_playwright_learning_module.sql)
    echo "   Found $COUNT interactive editors in migration"
else
    echo "❌ Migration not found"
    exit 1
fi

echo ""
echo "3. Checking package.json..."
if grep -q "@webcontainer/api" package.json; then
    echo "✅ @webcontainer/api installed"
else
    echo "❌ WebContainer API not installed"
    echo "   Run: npm install @webcontainer/api"
    exit 1
fi

echo ""
echo "================================"
echo "✅ ALL CHECKS PASSED!"
echo ""
echo "Next steps:"
echo "1. Open: http://localhost:3000/dashboard/learning/playwright"
echo "2. Click on any lesson"
echo "3. Scroll to find interactive editor"
echo "4. Wait for initialization (30-60s first time)"
echo "5. Click 'Run' button"
echo ""
echo "📖 Read TEST_PLAYWRIGHT_EDITOR.md for detailed testing guide"
