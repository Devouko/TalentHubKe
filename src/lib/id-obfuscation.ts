// Simple ID obfuscation to prevent exposing real database IDs
// Uses base64 encoding with a salt for basic obfuscation

const SALT = 'talent-marketplace-2025'

export function encodeId(id: string): string {
  try {
    const combined = `${SALT}:${id}:${Date.now()}`
    return Buffer.from(combined).toString('base64url')
  } catch {
    return id
  }
}

export function decodeId(encoded: string): string | null {
  try {
    const decoded = Buffer.from(encoded, 'base64url').toString('utf-8')
    const parts = decoded.split(':')
    
    if (parts[0] !== SALT || !parts[1]) {
      return null
    }
    
    return parts[1]
  } catch {
    return null
  }
}

// Alternative: Use nanoid for completely random IDs
import { nanoid } from 'nanoid'

const idMap = new Map<string, string>()
const reverseMap = new Map<string, string>()

export function generatePublicId(realId: string): string {
  if (reverseMap.has(realId)) {
    return reverseMap.get(realId)!
  }
  
  const publicId = nanoid(12)
  idMap.set(publicId, realId)
  reverseMap.set(realId, publicId)
  
  return publicId
}

export function getRealId(publicId: string): string | null {
  return idMap.get(publicId) || null
}
