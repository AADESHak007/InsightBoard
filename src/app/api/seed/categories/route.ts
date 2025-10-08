import { NextResponse } from 'next/server';
import { seedCategories } from '@/lib/seed-categories';

export async function POST() {
  try {
    await seedCategories();
    
    return NextResponse.json({
      success: true,
      message: 'Categories seeded successfully'
    });
  } catch (error) {
    console.error('Error seeding categories:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to seed categories',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
