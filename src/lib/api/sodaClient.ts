// SODA API Client for NYC Open Data
const SODA_BASE_URL = 'https://data.cityofnewyork.us/resource';

interface SodaRequestOptions {
  endpoint: string;
  params?: Record<string, string | number>;
  limit?: number;
}

export class SodaClient {
  private baseUrl: string;

  constructor(baseUrl: string = SODA_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Fetch data from SODA API
   */
  async fetch<T = Record<string, unknown>>(options: SodaRequestOptions): Promise<T[]> {
    const { endpoint, params = {}, limit = 50000 } = options;

    // Build query parameters
    const queryParams = new URLSearchParams({
      $limit: limit.toString(),
      ...Object.entries(params).reduce((acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>),
    });

    const url = `${this.baseUrl}/${endpoint}?${queryParams.toString()}`;

    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        },
        // Don't use Next.js cache - responses are too large (29MB)
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`SODA API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('SODA API fetch error:', error);
      throw error;
    }
  }

  /**
   * Execute a custom SoQL query
   */
  async query<T = Record<string, unknown>>(endpoint: string, soqlQuery: string): Promise<T[]> {
    const url = `${this.baseUrl}/${endpoint}?${soqlQuery}`;

    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`SODA API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('SODA API query error:', error);
      throw error;
    }
  }
}

// Default client instance
export const sodaClient = new SodaClient();

