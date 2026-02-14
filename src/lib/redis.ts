import { Redis } from '@upstash/redis'

// Validate environment variables
if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  console.warn('Upstash Redis environment variables not configured');
}

export const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN 
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

export const rateLimit = async (identifier: string, limit: number = 10, window: number = 60) => {
  if (!redis) {
    console.warn('Redis not configured, skipping rate limiting');
    return {
      success: true,
      remaining: limit,
      reset: Date.now() + (window * 1000)
    };
  }

  try {
    const key = `rate_limit:${identifier}`;
    const current = await redis.incr(key);
    
    if (current === 1) {
      await redis.expire(key, window);
    }
    
    return {
      success: current <= limit,
      remaining: Math.max(0, limit - current),
      reset: Date.now() + (window * 1000)
    };
  } catch (error) {
    console.error('Redis rate limiting error:', error);
    // Fallback to allowing the request if Redis fails
    return {
      success: true,
      remaining: limit,
      reset: Date.now() + (window * 1000)
    };
  }
};

// Cache helper functions
export const cacheSet = async (key: string, value: any, ttl: number = 3600) => {
  if (!redis) return null;
  try {
    return await redis.setex(key, ttl, JSON.stringify(value));
  } catch (error) {
    console.error('Redis cache set error:', error);
    return null;
  }
};

export const cacheGet = async (key: string) => {
  if (!redis) return null;
  try {
    const value = await redis.get(key);
    return value ? JSON.parse(value as string) : null;
  } catch (error) {
    console.error('Redis cache get error:', error);
    return null;
  }
};

export const cacheDel = async (key: string) => {
  if (!redis) return null;
  try {
    return await redis.del(key);
  } catch (error) {
    console.error('Redis cache delete error:', error);
    return null;
  }
};