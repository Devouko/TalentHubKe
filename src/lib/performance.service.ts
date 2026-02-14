import { BaseService } from './base.service'

export class PerformanceService extends BaseService {
  private static cache = new Map<string, { data: any; timestamp: number; ttl: number }>()
  
  static setCache(key: string, data: any, ttlMinutes: number = 5): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMinutes * 60 * 1000
    })
  }
  
  static getCache(key: string): any | null {
    const cached = this.cache.get(key)
    if (!cached) return null
    
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key)
      return null
    }
    
    return cached.data
  }
  
  static clearCache(pattern?: string): void {
    if (!pattern) {
      this.cache.clear()
      return
    }
    
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key)
      }
    }
  }
  
  static async withCache<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttlMinutes: number = 5
  ): Promise<T> {
    const cached = this.getCache(key)
    if (cached) return cached
    
    const data = await fetcher()
    this.setCache(key, data, ttlMinutes)
    return data
  }
}