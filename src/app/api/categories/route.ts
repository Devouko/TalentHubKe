import { NextResponse } from 'next/server';
import { CATEGORY_DETAILS, CATEGORY_OPTIONS } from '@/constants/categories';

export async function GET() {
  try {
    const categories = CATEGORY_OPTIONS.map(categoryKey => ({
      id: categoryKey,
      name: CATEGORY_DETAILS[categoryKey].name,
      icon: CATEGORY_DETAILS[categoryKey].icon,
      description: CATEGORY_DETAILS[categoryKey].description,
      subcategories: CATEGORY_DETAILS[categoryKey].subcategories,
      gigCount: 0 // This would be calculated from actual data
    }));
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}