#!/bin/bash

echo "Setting up global theme system..."

# Run database migration
echo "Running database migration..."
npx prisma db push

# Initialize default themes
echo "Initializing default themes..."
curl -X POST http://localhost:3000/api/theme/init

echo "Theme system setup complete!"
echo "Admin users can now change system colors from the admin panel."