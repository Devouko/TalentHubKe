# API Integration Setup Guide

This guide will help you configure all the external APIs used in the Talent Marketplace application.

## 🔧 Required APIs

### 1. Database (Required)
- **Service**: Neon PostgreSQL
- **Status**: ✅ Already configured
- **Variables**: `DATABASE_URL`

### 2. M-Pesa (Required)
- **Service**: Safaricom Daraja API
- **Status**: ✅ Already configured
- **Variables**: 
  - `MPESA_CONSUMER_KEY`
  - `MPESA_CONSUMER_SECRET`
  - `MPESA_SHORTCODE`
  - `MPESA_PASSKEY`

## 🚀 Optional APIs (Enhance functionality)

### 3. UploadThing (File Uploads)
- **Purpose**: Handle image uploads for profiles, gigs, and products
- **Setup**:
  1. Go to [uploadthing.com](https://uploadthing.com)
  2. Create an account and new app
  3. Copy your App ID and Secret Key
  4. Update `.env.local`:
     ```
     UPLOADTHING_SECRET=sk_live_your_actual_secret_key_here
     UPLOADTHING_APP_ID=your_actual_app_id_here
     ```

### 4. Resend (Email Service)
- **Purpose**: Send transactional emails (notifications, confirmations)
- **Setup**:
  1. Go to [resend.com](https://resend.com)
  2. Create an account
  3. Generate an API key
  4. Update `.env.local`:
     ```
     RESEND_API_KEY=re_your_actual_api_key_here
     ```

### 5. Sentry (Error Monitoring)
- **Purpose**: Track errors and performance monitoring
- **Setup**:
  1. Go to [sentry.io](https://sentry.io)
  2. Create a new project (Next.js)
  3. Copy your DSN and project details
  4. Update `.env.local`:
     ```
     SENTRY_DSN=https://your_actual_dsn@sentry.io/project_id
     SENTRY_ORG=your_sentry_organization
     SENTRY_PROJECT=your_sentry_project_name
     SENTRY_AUTH_TOKEN=your_sentry_auth_token
     ```

### 6. Upstash Redis (Caching & Rate Limiting)
- **Purpose**: Cache data and implement rate limiting
- **Setup**:
  1. Go to [console.upstash.com](https://console.upstash.com)
  2. Create a new Redis database
  3. Copy the REST URL and Token
  4. Update `.env.local`:
     ```
     UPSTASH_REDIS_REST_URL=https://your_redis_url.upstash.io
     UPSTASH_REDIS_REST_TOKEN=your_actual_redis_token
     ```

## 🔍 Checking API Status

After configuring your APIs, you can check their status by visiting:
```
http://localhost:3000/api/health
```

This endpoint will show you:
- Which services are properly configured
- Connection status for each service
- Overall system health

## 🛠️ Features by API

### Without Optional APIs:
- ✅ User authentication
- ✅ M-Pesa payments
- ✅ Basic marketplace functionality
- ❌ File uploads (will use fallback)
- ❌ Email notifications
- ❌ Error monitoring
- ❌ Performance optimization

### With All APIs:
- ✅ Full file upload functionality
- ✅ Email notifications for orders/messages
- ✅ Error tracking and monitoring
- ✅ Improved performance with caching
- ✅ Rate limiting protection
- ✅ Production-ready monitoring

## 🚨 Important Notes

1. **Development vs Production**: Some services have different keys for development and production
2. **Security**: Never commit real API keys to version control
3. **Fallbacks**: The app will work without optional APIs but with reduced functionality
4. **Rate Limits**: Each service has different rate limits - check their documentation

## 📞 Support

If you encounter issues:
1. Check the `/api/health` endpoint
2. Review the console logs for specific error messages
3. Verify your API keys are correct and have proper permissions
4. Check service status pages for outages