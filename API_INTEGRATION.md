# NYC Open Data API Integration

## Overview
This document describes the integration with NYC Open Data's SODA API for the SBS Certified Business List.

## Data Source
- **API Endpoint**: `https://data.cityofnewyork.us/resource/ci93-uc8s.json`
- **Documentation**: https://dev.socrata.com/foundry/data.cityofnewyork.us/ci93-uc8s
- **Dataset**: NYC SBS Certified Business List (M/WBE, DBE)

## Architecture

### File Structure
```
src/
├── lib/api/
│   ├── sodaClient.ts           # SODA API client wrapper
│   └── certifiedBusinesses.ts  # Business data processing logic
├── app/api/business/certified/
│   ├── overview/route.ts       # GET /api/business/certified/overview
│   └── boroughs/route.ts       # GET /api/business/certified/boroughs
├── hooks/
│   └── useBusinessData.ts      # React hook for fetching business data
├── components/
│   └── BusinessInsights.tsx    # Business insights component
└── types/
    └── business.ts             # TypeScript types
```

## API Endpoints

### 1. GET /api/business/certified/overview
Returns comprehensive business statistics and breakdowns.

**Response:**
```json
{
  "stats": {
    "total": 12450,
    "mbe": 5820,
    "wbe": 4230,
    "dbe": 1200,
    "mwbe": 890,
    "growthRate": 8.7
  },
  "breakdowns": {
    "boroughs": [...],
    "ethnicity": [...],
    "sectors": [...]
  },
  "growth": [...],
  "lastUpdated": "2025-10-01T..."
}
```

### 2. GET /api/business/certified/boroughs
Returns borough-specific business counts.

## Key Metrics Tracked

1. **Total Certified Businesses** - Overall count of M/WBE and DBE
2. **MBE Count** - Minority Business Enterprises
3. **WBE Count** - Women Business Enterprises
4. **DBE Count** - Disadvantaged Business Enterprises
5. **Growth Rate** - Year-over-year growth percentage
6. **Borough Distribution** - Business count per NYC borough
7. **Sector Distribution** - Top business industries
8. **Ethnicity Breakdown** - Business ownership demographics

## Data Processing

### Aggregation Functions
- `calculateBusinessStats()` - Calculate MBE/WBE/DBE counts
- `getBoroughBreakdown()` - Group by borough
- `getEthnicityBreakdown()` - Group by ethnicity
- `getSectorBreakdown()` - Group by NAICS sector
- `getYearlyGrowth()` - Calculate growth over years
- `calculateGrowthRate()` - YoY growth percentage

## Caching Strategy

### Problem
NYC Open Data responses are **29MB** (too large for Next.js default 2MB cache limit).

### Solution: In-Memory Cache
- ✅ Custom `MemoryCache` class stores **processed data** only (~100KB vs 29MB raw)
- ✅ 24-hour TTL (Time To Live) for cached responses
- ✅ First request: ~3-18 seconds (fetches from API)
- ✅ Subsequent requests: <100ms (served from memory)
- ✅ Cache management endpoints available

### Cache Management Endpoints
- `GET /api/cache/stats` - View cache statistics
- `GET /api/cache/clear` - Clear all cached data

### Implementation
```typescript
// Check cache first
const cached = memoryCache.get('cache-key');
if (cached) return cached;

// Process data...
const result = processData(rawData);

// Cache processed result
memoryCache.set('cache-key', result, 86400); // 24 hours
```

## Usage in Components

### Using the Business Insights Component
```tsx
import BusinessInsights from '@/components/BusinessInsights';

// In your page component
{selectedCategory === 'Business' && <BusinessInsights />}
```

### Using the Hook Directly
```tsx
import { useBusinessData } from '@/hooks/useBusinessData';

function MyComponent() {
  const { data, loading, error } = useBusinessData();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <div>Total: {data.stats.total}</div>;
}
```

## Features

### Real-time Data Indicators
- Live connection to NYC Open Data
- Auto-refresh every 24 hours
- Visual loading states
- Error handling with fallbacks

### Visualizations
- Business count cards with targets
- Borough distribution bar chart
- Top sectors ranking
- Growth rate trends
- M/WBE breakdown

## Future Enhancements

1. **Additional Datasets**
   - Business licenses by type
   - Revenue data by sector
   - Geographic heat maps

2. **Advanced Filters**
   - Filter by certification type
   - Filter by borough
   - Filter by business sector
   - Date range selection

3. **Analytics**
   - Predictive growth models
   - Comparative analytics
   - Industry trends

## References
- [SODA API Documentation](https://dev.socrata.com/)
- [NYC Open Data Portal](https://opendata.cityofnewyork.us/)
- [SBS Certified Business Dataset](https://data.cityofnewyork.us/Business/M-WBE-LBE-and-EBE-Certified-Business-List/ci93-uc8s)

