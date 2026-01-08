/**
 * Jest Configuration
 * 
 * Configuration for Jest testing framework with:
 * - Next.js integration
 * - TypeScript support
 * - React Testing Library setup
 * - Coverage reporting
 * - Module path mapping
 */

const nextJest = require('next/jest')

// Create Jest config with Next.js
const createJestConfig = nextJest({
  // Path to Next.js app directory
  dir: './'
})

// Custom Jest configuration
const customJestConfig = {
  // Test environment
  testEnvironment: 'jsdom',
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // Module name mapping for absolute imports
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  
  // Test file patterns
  testMatch: [
    '**/__tests__/**/*.(ts|tsx|js)',
    '**/*.(test|spec).(ts|tsx|js)'
  ],
  
  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/app/layout.tsx',
    '!src/app/globals.css'
  ],
  
  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  
  // Transform ignore patterns
  transformIgnorePatterns: [
    'node_modules/(?!(.*\.mjs$))'
  ]
}

// Export Jest config
module.exports = createJestConfig(customJestConfig)