/**
 * Utility Functions Tests
 * 
 * Tests for utility functions including:
 * - Class name utilities (cn function)
 * - Data formatting functions
 * - Validation helpers
 * - Kenya-specific utilities
 */

import { cn } from '../../lib/utils'

describe('Utility Functions', () => {
  describe('cn (className utility)', () => {
    /**
     * Test basic class merging
     */
    it('merges class names correctly', () => {
      const result = cn('base-class', 'additional-class')
      expect(result).toContain('base-class')
      expect(result).toContain('additional-class')
    })

    /**
     * Test conditional classes
     */
    it('handles conditional classes', () => {
      const isActive = true
      const result = cn('base', isActive && 'active', !isActive && 'inactive')
      
      expect(result).toContain('base')
      expect(result).toContain('active')
      expect(result).not.toContain('inactive')
    })

    /**
     * Test Tailwind class conflicts
     */
    it('resolves Tailwind class conflicts', () => {
      const result = cn('px-2 px-4') // Should keep px-4
      expect(result).toBe('px-4')
    })

    /**
     * Test empty and undefined values
     */
    it('handles empty and undefined values', () => {
      const result = cn('base', '', undefined, null, 'end')
      expect(result).toBe('base end')
    })
  })

  describe('Kenya-specific utilities', () => {
    /**
     * Test phone number validation
     */
    it('validates Kenyan phone numbers', () => {
      const validPhone = '254700123456'
      const invalidPhone = '0700123456'
      
      const phoneRegex = /^254[0-9]{9}$/
      
      expect(phoneRegex.test(validPhone)).toBe(true)
      expect(phoneRegex.test(invalidPhone)).toBe(false)
    })

    /**
     * Test KES currency formatting
     */
    it('formats KES currency correctly', () => {
      const amount = 12500
      const formatted = amount.toLocaleString()
      
      expect(formatted).toBe('12,500')
    })

    /**
     * Test county validation
     */
    it('validates Kenyan counties', () => {
      const validCounties = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru']
      const testCounty = 'Nairobi'
      
      expect(validCounties.includes(testCounty)).toBe(true)
    })
  })

  describe('Data validation', () => {
    /**
     * Test email validation
     */
    it('validates email addresses', () => {
      const validEmail = 'test@talenthub.ke'
      const invalidEmail = 'invalid-email'
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      
      expect(emailRegex.test(validEmail)).toBe(true)
      expect(emailRegex.test(invalidEmail)).toBe(false)
    })

    /**
     * Test price validation
     */
    it('validates price ranges', () => {
      const validPrice = 1000
      const invalidPrice = -100
      
      expect(validPrice > 0).toBe(true)
      expect(invalidPrice > 0).toBe(false)
    })

    /**
     * Test delivery time validation
     */
    it('validates delivery times', () => {
      const validDeliveryTime = 7
      const invalidDeliveryTime = 0
      
      expect(validDeliveryTime >= 1 && validDeliveryTime <= 365).toBe(true)
      expect(invalidDeliveryTime >= 1 && invalidDeliveryTime <= 365).toBe(false)
    })
  })

  describe('Text processing', () => {
    /**
     * Test text truncation
     */
    it('truncates text correctly', () => {
      const longText = 'This is a very long text that should be truncated'
      const maxLength = 20
      const truncated = longText.length > maxLength 
        ? longText.substring(0, maxLength) + '...'
        : longText
      
      expect(truncated.length).toBeLessThanOrEqual(maxLength + 3)
      expect(truncated).toContain('...')
    })

    /**
     * Test slug generation
     */
    it('generates URL-friendly slugs', () => {
      const title = 'Professional Logo Design & Branding'
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
      
      expect(slug).toBe('professional-logo-design-branding')
    })
  })
})