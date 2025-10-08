import { prisma } from './database';
import { Category } from '@prisma/client';

export async function seedCategories() {
  const categories = [
    {
      name: 'ALL' as Category,
      displayName: 'All Categories',
      description: 'Overview of all city indicators',
      color: '#6366f1',
      icon: '📊',
      order: 0
    },
    {
      name: 'PUBLIC_SAFETY' as Category,
      displayName: 'Public Safety',
      description: 'Crime statistics, emergency services, and safety metrics',
      color: '#ef4444',
      icon: '🛡️',
      order: 1
    },
    {
      name: 'TRANSPORTATION' as Category,
      displayName: 'Transportation',
      description: 'Public transit, traffic, and mobility indicators',
      color: '#3b82f6',
      icon: '🚇',
      order: 2
    },
    {
      name: 'HEALTH' as Category,
      displayName: 'Health',
      description: 'Public health, healthcare access, and wellness metrics',
      color: '#10b981',
      icon: '🏥',
      order: 3
    },
    {
      name: 'EDUCATION' as Category,
      displayName: 'Education',
      description: 'School performance, enrollment, and educational outcomes',
      color: '#8b5cf6',
      icon: '🎓',
      order: 4
    },
    {
      name: 'HOUSING' as Category,
      displayName: 'Housing',
      description: 'Affordable housing, construction, and housing quality',
      color: '#f59e0b',
      icon: '🏠',
      order: 5
    },
    {
      name: 'ENVIRONMENT' as Category,
      displayName: 'Environment',
      description: 'Air quality, sustainability, and environmental health',
      color: '#10b981',
      icon: '🌱',
      order: 6
    },
    {
      name: 'ECONOMY' as Category,
      displayName: 'Economy',
      description: 'Economic indicators, employment, and business metrics',
      color: '#f59e0b',
      icon: '💼',
      order: 7
    },
    {
      name: 'BUSINESS' as Category,
      displayName: 'Business',
      description: 'Business development, entrepreneurship, and economic growth',
      color: '#f59e0b',
      icon: '🏢',
      order: 8
    }
  ];

  for (const category of categories) {
    await prisma.categoryData.upsert({
      where: { name: category.name },
      update: category,
      create: category
    });
  }

  console.log('✅ Categories seeded successfully');
}
