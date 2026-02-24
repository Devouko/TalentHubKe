# Product Creation API Flow

## Complete Request/Response Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRODUCT CREATION FLOW                         │
└─────────────────────────────────────────────────────────────────┘

1. USER FILLS FORM
   ├─ Product Name: "Atlas"
   ├─ Description: "atlas is the best ai training platform"
   ├─ Price: 2000
   ├─ Quantity: 20
   ├─ Category: "Accounts" (or any valid category)
   └─ Images: Upload at least 1 image
   
   ↓

2. FORM VALIDATION (Client-Side)
   ├─ Check: Category selected? ✓
   ├─ Check: At least 1 image? ✓
   └─ Build payload object
   
   ↓

3. PAYLOAD CONSTRUCTION
   {
     "name": "Atlas",
     "slug": "atlas",
     "sku": "SKU-1771918816325-RNBQMS10J",
     "description": "atlas is the best ai training platform",
     "shortDescription": "atlas",
     "price": 2000,
     "comparePrice": 2000,
     "costPrice": 2000,
     "quantity": 20,
     "lowStockThreshold": 10,
     "trackInventory": true,
     "isDigital": false,
     "categoryId": "Accounts",
     "brand": "",
     "tags": [],
     "images": [
       {
         "url": "data:image/...",
         "alt": "Atlas",
         "position": 0
       }
     ],
     "isActive": true,
     "isFeatured": false
   }
   
   ↓

4. HTTP REQUEST
   POST /api/admin/products
   Headers: { "Content-Type": "application/json" }
   Body: <payload from step 3>
   
   ↓

5. SERVER: Authentication Check
   ├─ Get session from NextAuth
   ├─ Check: User logged in? ✓
   ├─ Check: User is ADMIN? ✓
   └─ Extract user.id
   
   ↓

6. SERVER: Zod Validation
   ├─ Validate: name (required, 1-200 chars) ✓
   ├─ Validate: description (required, 10-5000 chars) ✓
   ├─ Validate: price (required, positive number) ✓
   ├─ Validate: quantity (required, >= 0) ✓
   ├─ Validate: categoryId (required, not empty) ✓
   ├─ Validate: images (required, min 1) ✓
   └─ All validations pass ✓
   
   ↓

7. SERVER: Data Transformation
   Zod Schema → Prisma Schema
   ├─ name → title
   ├─ quantity → stock
   ├─ categoryId → category
   ├─ tags → features
   ├─ comparePrice → discountPrice
   └─ Add: users relation (connect to seller)
   
   Result:
   {
     "title": "Atlas",
     "description": "atlas is the best ai training platform",
     "price": 2000,
     "images": ["data:image/..."],
     "category": "Accounts",
     "stock": 20,
     "isActive": true,
     "brand": null,
     "discountPercent": 0,
     "discountPrice": 2000,
     "features": [],
     "users": {
       "connect": { "id": "<admin-user-id>" }
     }
   }
   
   ↓

8. SERVER: Database Insert
   await prisma.products.create({
     data: <transformed data>,
     include: { users: { select: { id, name, email } } }
   })
   
   ↓

9. SERVER: Response
   Status: 201 Created
   Body: {
     "id": "<generated-uuid>",
     "title": "Atlas",
     "description": "atlas is the best ai training platform",
     "price": 2000,
     "stock": 20,
     "category": "Accounts",
     "isActive": true,
     "createdAt": "2025-01-24T...",
     "users": {
       "id": "<admin-user-id>",
       "name": "Admin Name",
       "email": "admin@example.com"
     },
     ...
   }
   
   ↓

10. CLIENT: Success Handler
    ├─ Show success toast ✓
    ├─ Log: "SUCCESS - Redirecting to /admin/products"
    ├─ router.push('/admin/products')
    └─ router.refresh()
    
    ↓

11. REDIRECT TO PRODUCTS LIST
    User sees new product in the list ✓
```

## Error Scenarios

### Scenario A: Missing Category
```
Step 2: FORM VALIDATION
├─ Check: Category selected? ✗
└─ Show error: "Please select a category"
   STOP - Don't send request
```

### Scenario B: No Images
```
Step 2: FORM VALIDATION
├─ Check: At least 1 image? ✗
└─ Show error: "Please upload at least one product image"
   STOP - Don't send request
```

### Scenario C: Not Admin
```
Step 5: SERVER Authentication
├─ Check: User is ADMIN? ✗
└─ Response: 401 Unauthorized
   { "error": "Unauthorized" }
```

### Scenario D: Validation Failed
```
Step 6: SERVER Zod Validation
├─ Validate: description (min 10 chars) ✗
└─ Response: 400 Bad Request
   {
     "error": "Validation failed",
     "details": [
       {
         "path": ["description"],
         "message": "Description must be at least 10 characters"
       }
     ]
   }
```

### Scenario E: Database Error
```
Step 8: SERVER Database Insert
├─ Prisma error: P2003 (Foreign key constraint)
└─ Response: 400 Bad Request
   { "error": "Invalid seller ID or foreign key constraint failed" }
```

## Debug Checkpoints

At each step, check:

**Step 1-3 (Client)**: Browser Console
- Look for: "=== PRODUCT SUBMISSION DEBUG ==="
- Verify: All form fields populated correctly

**Step 4**: Browser Network Tab
- Look for: POST request to /api/admin/products
- Check: Request payload matches expected structure

**Step 5-8 (Server)**: Server Console/Terminal
- Look for: "Received payload:", "Validated data:", "Prisma data:"
- Check: No error messages

**Step 9**: Browser Network Tab
- Look for: Response status 201
- Check: Response body contains product data

**Step 10-11 (Client)**: Browser Console
- Look for: "SUCCESS - Redirecting to /admin/products"
- Check: Page redirects successfully

## Quick Troubleshooting

| Symptom | Check | Solution |
|---------|-------|----------|
| "Please select a category" | Step 2 | Select a category from dropdown |
| "Please upload at least one image" | Step 2 | Upload at least 1 image |
| "Unauthorized" | Step 5 | Login as ADMIN user |
| "Validation failed" | Step 6 | Check error details, fix field |
| "Invalid seller ID" | Step 8 | Check user exists in database |
| No response | Step 4 | Check network tab, server running? |
| 500 error | Step 8 | Check server logs for details |

## Success Indicators

✅ Browser console shows steps 1-9 without errors
✅ Server console shows "Product created: <id>"
✅ Response status is 201
✅ Page redirects to /admin/products
✅ New product appears in products list
