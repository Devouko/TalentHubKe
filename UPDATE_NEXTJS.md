# Update Next.js to Latest Version

## Current Issue
- Next.js 14.2.22 is outdated
- Browser extensions causing createElement errors

## Steps to Update

### 1. Update Next.js and React
```bash
npm install next@latest react@latest react-dom@latest
```

### 2. Update TypeScript Types
```bash
npm install --save-dev @types/react@latest @types/react-dom@latest
```

### 3. Clear Cache and Rebuild
```bash
# Delete cache folders
rm -rf .next
rm -rf node_modules/.cache

# Reinstall dependencies
npm install

# Rebuild
npm run build
```

### 4. Test the Application
```bash
npm run dev
```

## Alternative: Use Incognito Mode

If you don't want to update immediately:
1. Open Chrome Incognito Mode (Ctrl+Shift+N)
2. Navigate to http://localhost:3000
3. Extensions won't interfere

## Identify Problematic Extensions

The error is from these extensions:
- `lgblnfidahcdcjddiepkckcfdhpknnjh` - Unknown extension
- `oppacfhojhdjcgkjeeonghmolpjhgcec` - Unknown extension

To find them:
1. Go to `chrome://extensions/`
2. Enable "Developer mode"
3. Look for extensions with matching IDs
4. Disable them temporarily

## Long-term Solution

Add to your `next.config.js`:

```javascript
module.exports = {
  // ... existing config
  
  // Prevent extension interference
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    return config
  },
}
```

## Expected Versions After Update

- Next.js: 15.x.x (latest)
- React: 18.3.x (latest)
- React-DOM: 18.3.x (latest)
