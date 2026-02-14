# M-Pesa Testing Documentation

## Overview
This document outlines the comprehensive testing strategy for M-Pesa integration in the Transform to Talent Marketplace application.

## Test Structure

```
__tests__/
├── mpesa.test.ts              # API route unit tests
├── mpesa-component.test.tsx   # React component tests
├── mpesa-integration.test.ts  # End-to-end integration tests
├── test-utils.ts             # Testing utilities and helpers
jest.config.mpesa.js          # Jest configuration for M-Pesa tests
run-mpesa-tests.js            # Test runner script
```

## Test Categories

### 1. Unit Tests (`mpesa.test.ts`)
Tests individual API routes in isolation:

**STK Push API Tests:**
- ✅ Successful STK push initiation
- ✅ Invalid phone number handling
- ✅ Missing required fields validation
- ✅ Phone number formatting (0712345678 → 254712345678)
- ✅ Token request failure handling
- ✅ M-Pesa API error responses

**Callback API Tests:**
- ✅ Successful payment callback processing
- ✅ Failed payment callback handling
- ✅ Invalid callback data rejection
- ✅ Database error graceful handling
- ✅ Order status updates

### 2. Component Tests (`mpesa-component.test.tsx`)
Tests React component behavior:

**MpesaCheckout Component:**
- ✅ Correct rendering with amount and form
- ✅ Phone number input validation
- ✅ Phone number formatting before API call
- ✅ Successful payment response handling
- ✅ Payment failure response handling
- ✅ Network error handling
- ✅ Loading state during processing
- ✅ Instructions display

### 3. Integration Tests (`mpesa-integration.test.ts`)
Tests complete payment flow:

**End-to-End Flow:**
- ✅ Complete payment cycle (order → STK push → callback → status update)
- ✅ Payment cancellation handling
- ✅ Invalid credentials error handling
- ✅ Malformed callback data handling

**Validation Tests:**
- ✅ Phone number validation (various formats)
- ✅ Amount validation (positive numbers, edge cases)

## Running Tests

### Prerequisites
```bash
npm install --save-dev jest @jest/globals @testing-library/react @testing-library/jest-dom ts-jest
```

### Run All M-Pesa Tests
```bash
node run-mpesa-tests.js
```

### Run Individual Test Suites
```bash
# Unit tests only
npm test __tests__/mpesa.test.ts

# Component tests only
npm test __tests__/mpesa-component.test.tsx

# Integration tests only
npm test __tests__/mpesa-integration.test.ts
```

### Run with Coverage
```bash
npm test -- --coverage __tests__/mpesa*.test.*
```

## Test Data

### Sandbox Test Numbers
Use these phone numbers for testing:
- `254708374149` - Primary test number
- `254708374150` - Secondary test number
- `254708374151` - Tertiary test number

### Test Amounts
- Minimum: KES 1
- Maximum: KES 70,000
- Common test amounts: 100, 500, 1000, 5000

### Mock Responses
The test utilities provide pre-configured mock responses:
- `mockMpesaResponses.successfulToken`
- `mockMpesaResponses.successfulStkPush`
- `mockMpesaResponses.failedStkPush`
- `mockMpesaResponses.successfulCallback`
- `mockMpesaResponses.failedCallback`

## Environment Setup

### Test Environment Variables
```env
MPESA_CONSUMER_KEY=test_consumer_key
MPESA_CONSUMER_SECRET=test_consumer_secret
MPESA_SHORTCODE=174379
MPESA_PASSKEY=bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919
NEXTAUTH_URL=http://localhost:3000
```

### Database Mocking
Tests use mocked Prisma client to avoid database dependencies:
```typescript
jest.mock('../../../../lib/prisma', () => ({
  prisma: {
    order: {
      update: jest.fn()
    }
  }
}))
```

## Test Scenarios Covered

### Success Scenarios
1. **Valid STK Push**: Correct phone format, valid amount, proper credentials
2. **Successful Payment**: Complete callback with receipt number
3. **Phone Formatting**: Various input formats converted correctly
4. **Component Interaction**: User input validation and API calls

### Error Scenarios
1. **Invalid Phone Numbers**: Too short, too long, wrong format
2. **Missing Fields**: Phone, amount, or orderId not provided
3. **API Failures**: Token request fails, STK push fails
4. **Payment Cancellation**: User cancels payment on phone
5. **Network Errors**: API unreachable, timeout scenarios
6. **Database Errors**: Order update failures

### Edge Cases
1. **Boundary Values**: Minimum/maximum amounts
2. **Special Characters**: Phone numbers with spaces, dashes
3. **Concurrent Requests**: Multiple payments simultaneously
4. **Malformed Data**: Invalid JSON, missing callback fields

## Assertions and Validations

### API Request Validation
```typescript
expectValidStkPushRequest(fetchCall)
expectValidTokenRequest(fetchCall)
```

### Response Validation
- Status codes (200, 400, 500)
- Response structure (ResponseCode, CheckoutRequestID)
- Error messages
- Database updates

### Component Validation
- UI element presence
- Form validation
- Loading states
- Error display

## Continuous Integration

### GitHub Actions Example
```yaml
name: M-Pesa Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: node run-mpesa-tests.js
```

## Test Maintenance

### Adding New Tests
1. Follow existing naming conventions
2. Use test utilities for common operations
3. Mock external dependencies
4. Include both success and failure scenarios

### Updating Tests
1. Update when API changes
2. Add tests for new features
3. Remove obsolete test cases
4. Keep mock data current

## Troubleshooting

### Common Issues
1. **Mock not working**: Check import paths and jest configuration
2. **Async test failures**: Use proper await/waitFor patterns
3. **Environment variables**: Ensure test env vars are set
4. **Network timeouts**: Increase test timeout for integration tests

### Debug Tips
1. Use `console.log` in tests for debugging
2. Run tests with `--verbose` flag
3. Check mock call history with `jest.mock.calls`
4. Use `--detectOpenHandles` to find hanging promises

## Coverage Goals

Target coverage metrics:
- **Unit Tests**: 95%+ line coverage
- **Component Tests**: 90%+ branch coverage
- **Integration Tests**: 80%+ feature coverage

## Security Testing

### Sensitive Data
- Never use real credentials in tests
- Mock all external API calls
- Validate input sanitization
- Test authorization checks

### Vulnerability Testing
- SQL injection attempts
- XSS prevention
- CSRF protection
- Rate limiting validation

---

**Last Updated**: January 2026
**Test Framework**: Jest + React Testing Library
**Coverage Tool**: Jest Coverage Reports