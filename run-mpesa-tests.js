#!/usr/bin/env node

const { execSync } = require('child_process')
const path = require('path')

console.log('🧪 Running M-Pesa Integration Tests...\n')

// Test commands
const commands = [
  {
    name: 'Unit Tests - API Routes',
    cmd: 'npm test -- __tests__/mpesa.test.ts --verbose'
  },
  {
    name: 'Component Tests - React Components',
    cmd: 'npm test -- __tests__/mpesa-component.test.tsx --verbose'
  },
  {
    name: 'Integration Tests - End-to-End Flow',
    cmd: 'npm test -- __tests__/mpesa-integration.test.ts --verbose'
  }
]

let allPassed = true

for (const { name, cmd } of commands) {
  console.log(`\n📋 ${name}`)
  console.log('='.repeat(50))
  
  try {
    execSync(cmd, { 
      stdio: 'inherit',
      cwd: process.cwd()
    })
    console.log(`✅ ${name} - PASSED`)
  } catch (error) {
    console.log(`❌ ${name} - FAILED`)
    allPassed = false
  }
}

console.log('\n' + '='.repeat(50))
if (allPassed) {
  console.log('🎉 All M-Pesa tests passed!')
  process.exit(0)
} else {
  console.log('💥 Some tests failed. Check the output above.')
  process.exit(1)
}