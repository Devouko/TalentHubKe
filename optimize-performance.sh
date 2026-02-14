#!/bin/bash

echo "🚀 Optimizing Transform to Talent Marketplace for faster loading..."

# 1. Update Next.js config
echo "📝 Updating Next.js configuration..."
if [ -f "next.config.js" ]; then
    cp next.config.js next.config.js.backup
fi
cp next.config.optimized.js next.config.js

# 2. Install performance dependencies
echo "📦 Installing performance optimization packages..."
npm install --save-dev @next/bundle-analyzer webpack-bundle-analyzer

# 3. Add performance scripts to package.json
echo "🔧 Adding performance scripts..."
npm pkg set scripts.analyze="ANALYZE=true npm run build"
npm pkg set scripts.build:analyze="cross-env ANALYZE=true npm run build"

# 4. Generate optimized build
echo "🏗️ Building optimized version..."
npm run build

# 5. Database optimizations
echo "🗄️ Applying database optimizations..."
npx prisma db push

echo "✅ Performance optimizations complete!"
echo ""
echo "📊 Performance improvements:"
echo "  • API response caching (1-5 minutes)"
echo "  • Database query optimization"
echo "  • Lazy loading for heavy components"
echo "  • Bundle splitting and compression"
echo "  • Image optimization"
echo "  • CSS critical path optimization"
echo ""
echo "🔍 To analyze bundle size: npm run analyze"
echo "🚀 Start optimized app: npm start"