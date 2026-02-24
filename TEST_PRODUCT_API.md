# Product Creation API - Debugging Guide

## Issue: "Failed to save product"

### Step-by-Step Debugging Process

#### 1. Check Browser Console
Open browser DevTools (F12) and look for:
- `=== PRODUCT SUBMISSION DEBUG ===`
- All numbered log entries (1-11)
- Any red error messages

#### 2. Check Server Logs
Look at your terminal/console where Next.js is running for:
- `Received payload:`
- `Validated data:`
- `Prisma data:`
- `Product created:`
- Any Zod validation errors
- Any Prisma errors

#### 3. Common Issues & Solutions

**Issue: "Category is required"**
- Solution: Make sure you select a category from the dropdown
- The categoryId field must not be empty

**Issue: "At least one image is required"**
- Solution: Upload at least one product image
- Images are converted to base64 data URLs

**Issue: "Invalid seller ID or foreign key constraint failed"**
- Solution: Make sure you're logged in as an ADMIN user
- Check that your user ID exists in the database

**Issue: "Validation failed"**
- Solution: Check the browser console for specific field errors
- Common fields: name, description, price, quantity, categoryId, images

#### 4. Test Payload Structure

The API expects this structure:
```json
{
  "name": "Product Name",
  "slug": "product-name",
  "sku": "SKU-123456",
  "description": "Product description (min 10 chars)",
  "shortDescription": "Short desc",
  "price": 2000,
  "comparePrice": 2500,
  "costPrice": 1500,
  "quantity": 20,
  "lowStockThreshold": 10,
  "trackInventory": true,
  "isDigital": false,
  "categoryId": "Programming & Tech",
  "brand": "Brand Name",
  "tags": ["tag1", "tag2"],
  "images": [
    {
      "url": "data:image/jpeg;base64,...",
      "alt": "Product Name",
      "position": 0
    }
  ],
  "isActive": true,
  "isFeatured": false
}
```

#### 5. Database Schema Mapping

Form Field → Prisma Field:
- `name` → `title`
- `quantity` → `stock`
- `categoryId` → `category`
- `tags` → `features`
- `comparePrice` → `discountPrice`

#### 6. Manual API Test

You can test the API directly using curl or Postman:

```bash
curl -X POST http://localhost:3000/api/admin/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "description": "This is a test product description",
    "price": 1000,
    "quantity": 10,
    "categoryId": "Programming & Tech",
    "images": [{"url": "https://via.placeholder.com/300", "alt": "Test"}],
    "isActive": true
  }'
```

#### 7. Check Authentication

Make sure:
1. You're logged in
2. Your user has `userType: "ADMIN"`
3. Session is valid (check Network tab → Cookies)

#### 8. Check Database Connection

Verify Prisma can connect:
```bash
npx prisma db pull
```

#### 9. Verify Categories

Make sure the category you're selecting exists in `CATEGORY_OPTIONS`:
- Check `src/constants/categories.ts`
- Valid categories: "Programming & Tech", "Design & Creative", etc.

#### 10. Next Steps

If still failing:
1. Copy the full console output (both browser and server)
2. Check the exact error message
3. Verify all required fields are filled
4. Check if images are being uploaded correctly
5. Verify your user is an ADMIN

## Quick Fix Checklist

- [ ] Category selected
- [ ] At least one image uploaded
- [ ] Product name filled (required)
- [ ] Description filled (min 10 chars)
- [ ] Price filled (must be positive number)
- [ ] Quantity filled (must be 0 or positive)
- [ ] Logged in as ADMIN user
- [ ] Browser console shows detailed logs
- [ ] Server console shows API logs
