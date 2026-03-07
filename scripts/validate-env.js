const { z } = require('zod')
const fs = require('fs')
const path = require('path')

const productionEnvSchema = z.object({
  // Core Application
  NODE_ENV: z.literal('production'),
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid PostgreSQL URL'),
  NEXTAUTH_URL: z.string().url('NEXTAUTH_URL must be a valid URL'),
  NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET must be at least 32 characters'),
  
  // M-Pesa Production
  MPESA_CONSUMER_KEY: z.string().min(1, 'MPESA_CONSUMER_KEY is required'),
  MPESA_CONSUMER_SECRET: z.string().min(1, 'MPESA_CONSUMER_SECRET is required'),
  MPESA_SHORTCODE: z.string().min(1, 'MPESA_SHORTCODE is required'),
  MPESA_PASSKEY: z.string().min(1, 'MPESA_PASSKEY is required'),
  
  // Optional but recommended
  SENTRY_DSN: z.string().url().optional(),
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  UPLOADTHING_SECRET: z.string().optional(),
  UPLOADTHING_APP_ID: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
})

function validateProductionEnv() {
  console.log('🔍 Validating production environment...')
  
  // Check if .env.production exists
  const envPath = path.join(process.cwd(), '.env.production')
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env.production file not found!')
    console.log('📝 Create .env.production with required variables')
    process.exit(1)
  }
  
  // Load environment variables
  const envContent = fs.readFileSync(envPath, 'utf8')
  const envVars = {}
  
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=')
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '')
    }
  })
  
  try {
    const validatedEnv = productionEnvSchema.parse(envVars)
    
    console.log('✅ Environment validation passed!')
    
    // Security checks
    const securityIssues = []
    
    if (validatedEnv.NEXTAUTH_SECRET.length < 64) {
      securityIssues.push('NEXTAUTH_SECRET should be at least 64 characters for production')
    }
    
    if (validatedEnv.DATABASE_URL.includes('localhost')) {
      securityIssues.push('DATABASE_URL should not use localhost in production')
    }
    
    if (!validatedEnv.SENTRY_DSN) {
      securityIssues.push('SENTRY_DSN is recommended for error tracking in production')
    }
    
    if (!validatedEnv.UPSTASH_REDIS_REST_URL) {
      securityIssues.push('Redis is recommended for session storage and caching')
    }
    
    // M-Pesa production URL validation
    const mpesaUrls = {
      auth: 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      stk: 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
    }
    
    if (envVars.MPESA_AUTH_URL && !envVars.MPESA_AUTH_URL.includes('api.safaricom.co.ke')) {
      securityIssues.push('MPESA_AUTH_URL should use production endpoint (api.safaricom.co.ke)')
    }
    
    if (securityIssues.length > 0) {
      console.log('\n⚠️  Security recommendations:')
      securityIssues.forEach(issue => console.log(`  - ${issue}`))
    }
    
    // Service availability check
    console.log('\n🔧 Configured services:')
    console.log(`  - Database: ✅`)
    console.log(`  - Authentication: ✅`)
    console.log(`  - M-Pesa: ✅`)
    console.log(`  - Error Tracking: ${validatedEnv.SENTRY_DSN ? '✅' : '❌'}`)
    console.log(`  - Redis Cache: ${validatedEnv.UPSTASH_REDIS_REST_URL ? '✅' : '❌'}`)
    console.log(`  - File Upload: ${validatedEnv.UPLOADTHING_SECRET ? '✅' : '❌'}`)
    console.log(`  - Email: ${validatedEnv.RESEND_API_KEY ? '✅' : '❌'}`)
    
    console.log('\n🚀 Environment is ready for production deployment!')
    
  } catch (error) {
    console.error('❌ Environment validation failed:')
    
    if (error.errors) {
      error.errors.forEach(err => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`)
      })
    } else {
      console.error(`  - ${error.message}`)
    }
    
    console.log('\n📖 Required environment variables:')
    console.log('  - NODE_ENV=production')
    console.log('  - DATABASE_URL=postgresql://...')
    console.log('  - NEXTAUTH_URL=https://yourdomain.com')
    console.log('  - NEXTAUTH_SECRET=your_secret_here')
    console.log('  - MPESA_CONSUMER_KEY=your_key')
    console.log('  - MPESA_CONSUMER_SECRET=your_secret')
    console.log('  - MPESA_SHORTCODE=your_shortcode')
    console.log('  - MPESA_PASSKEY=your_passkey')
    
    process.exit(1)
  }
}

if (require.main === module) {
  validateProductionEnv()
}

module.exports = { validateProductionEnv }