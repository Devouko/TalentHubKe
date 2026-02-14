# M-Pesa Production Deployment Checklist

## Pre-Deployment Requirements

### 1. M-Pesa Production Access
- [ ] Applied for M-Pesa API production access
- [ ] Submitted business documents (KRA PIN, Business License)
- [ ] Received production credentials from Safaricom
- [ ] Tested production credentials in staging environment

### 2. SSL Certificate
- [ ] Domain has valid SSL certificate (HTTPS required)
- [ ] Callback URL is publicly accessible
- [ ] No self-signed certificates

### 3. Environment Variables
```bash
# Production .env
NODE_ENV=production
MPESA_CONSUMER_KEY=your_production_key
MPESA_CONSUMER_SECRET=your_production_secret
MPESA_SHORTCODE=your_business_shortcode
MPESA_PASSKEY=your_production_passkey
NEXTAUTH_URL=https://yourdomain.com
```

### 4. Database Setup
- [ ] Production database configured
- [ ] Orders table ready for payment status updates
- [ ] Database connection tested

### 5. Monitoring & Logging
- [ ] Error tracking setup (Sentry, LogRocket)
- [ ] Payment transaction logging
- [ ] Failed payment alerts
- [ ] Callback URL monitoring

## Deployment Steps

### 1. Update Environment
```bash
# Set production environment
export NODE_ENV=production

# Deploy with production env vars
vercel --prod --env-file=.env.production
```

### 2. Test Production Integration
- [ ] Test STK push with real phone numbers
- [ ] Verify callback URL receives responses
- [ ] Test payment success/failure flows
- [ ] Validate order status updates

### 3. Go-Live Checklist
- [ ] Small amount test transactions (KES 1)
- [ ] Monitor first 24 hours closely
- [ ] Customer support ready for payment issues
- [ ] Rollback plan prepared

## Production Differences from Sandbox

| Feature | Sandbox | Production |
|---------|---------|------------|
| Phone Numbers | Only 254708374149 | Any Safaricom number |
| API URLs | sandbox.safaricom.co.ke | api.safaricom.co.ke |
| Callback URL | Can use webhook.site | Must be your domain |
| Transaction Limits | No limits | Real money limits apply |
| Testing | Free testing | Real money transactions |

## Common Production Issues

### 1. Invalid CallBackURL
- **Error**: "Bad Request - Invalid CallBackURL"
- **Solution**: Ensure HTTPS and publicly accessible URL

### 2. Invalid Credentials
- **Error**: "Invalid consumer key"
- **Solution**: Verify production credentials are correct

### 3. Insufficient Funds
- **Error**: Customer has insufficient balance
- **Solution**: Handle gracefully with user-friendly message

### 4. Network Timeouts
- **Error**: STK push timeout
- **Solution**: Implement retry logic and status checking

## Monitoring Commands

```bash
# Check M-Pesa API status
curl -X GET "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials" \
  -H "Authorization: Basic $(echo -n 'key:secret' | base64)"

# Monitor callback endpoint
tail -f /var/log/mpesa-callbacks.log

# Check payment success rate
grep "STK Push SUCCESS" /var/log/application.log | wc -l
```