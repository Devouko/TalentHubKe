# Dynamic Settings System

## Overview
Complete admin system to dynamically manage categories, platform branding, and offer carousels across the entire platform.

## Features

### 1. **Dynamic Categories**
- Add/Edit/Delete categories
- Reorder with drag controls
- Set icons and images
- Toggle active status
- Auto-updates across all pages

### 2. **Platform Settings**
- Change platform name dynamically
- Update tagline
- Customize primary/secondary colors
- Changes reflect site-wide instantly

### 3. **Offer Carousel**
- Create promotional banners
- Add images, titles, descriptions
- Set call-to-action buttons
- Reorder slides
- Auto-rotating carousel on homepage

## Database Models

### Category
```prisma
model Category {
  id          String   @id @default(cuid())
  name        String   @unique
  description String?
  icon        String?
  image       String?
  order       Int      @default(0)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### PlatformSettings
```prisma
model PlatformSettings {
  id              String   @id @default("default")
  platformName    String   @default("TalentHub")
  platformTagline String   @default("Talent Marketplace that developers love")
  platformLogo    String?
  primaryColor    String   @default("#10b981")
  secondaryColor  String   @default("#14b8a6")
  updatedAt       DateTime @updatedAt
}
```

### OfferCarousel
```prisma
model OfferCarousel {
  id          String   @id @default(cuid())
  title       String
  description String?
  image       String
  link        String?
  buttonText  String   @default("Learn More")
  order       Int      @default(0)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## API Endpoints

### Categories
- `GET /api/admin/categories` - Fetch all categories
- `POST /api/admin/categories` - Create category
- `PUT /api/admin/categories` - Update category
- `DELETE /api/admin/categories?id={id}` - Delete category

### Platform Settings
- `GET /api/admin/platform` - Fetch platform settings
- `PUT /api/admin/platform` - Update platform settings

### Offers
- `GET /api/admin/offers` - Fetch all offers
- `POST /api/admin/offers` - Create offer
- `PUT /api/admin/offers` - Update offer
- `DELETE /api/admin/offers?id={id}` - Delete offer

## Admin Interface

Access at: `/admin/dynamic-settings`

### Features:
- **Platform Settings Section**: Update name, tagline, colors
- **Categories Manager**: CRUD operations with ordering
- **Offer Carousel Manager**: Create promotional slides

## Setup Instructions

1. **Run Migration**
```bash
npx prisma migrate dev --name add_dynamic_settings
```

2. **Generate Prisma Client**
```bash
npx prisma generate
```

3. **Seed Initial Data** (Optional)
```bash
npx prisma db seed
```

4. **Access Admin Panel**
- Login as admin
- Navigate to `/admin/dynamic-settings`

## Usage

### Frontend Integration

```typescript
// Use dynamic settings in any component
import { usePlatformSettings, useCategories, useOffers } from '@/hooks/useDynamicSettings'

function MyComponent() {
  const platform = usePlatformSettings()
  const categories = useCategories()
  const offers = useOffers()
  
  return (
    <div>
      <h1>{platform.platformName}</h1>
      {/* Use dynamic data */}
    </div>
  )
}
```

## Components

- **DynamicSettingsPage**: Admin interface (`/admin/dynamic-settings/page.tsx`)
- **OfferCarousel**: Homepage carousel (`/components/OfferCarousel.tsx`)
- **CategoriesGrid3D**: Dynamic categories display
- **useDynamicSettings**: React hooks for fetching settings

## Security

- All admin endpoints require ADMIN role
- Session validation via NextAuth
- Input sanitization on all mutations

## Performance

- Client-side caching with React hooks
- Optimistic UI updates
- Lazy loading for images
- Minimal re-renders

## Future Enhancements

- [ ] Image upload integration
- [ ] Category analytics
- [ ] A/B testing for offers
- [ ] Scheduled carousel items
- [ ] Multi-language support
