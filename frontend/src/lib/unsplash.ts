// Utility to fetch high-resolution travel photos from Unsplash
const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || '';

// A curated fallback registry of high-quality Unsplash photos by category
const FALLBACK_PHOTOS: Record<string, string[]> = {
  beach: [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1473116763269-255ea7607cbe?auto=format&fit=crop&w=800&q=80'
  ],
  mountain: [
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1486873249359-2731bd6dafc7?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
  ],
  city: [
    'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=800&q=80'
  ],
  food: [
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&w=800&q=80'
  ],
  culture: [
    'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80'
  ],
  default: [
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80'
  ]
};

/**
 * Helper to match search query to a fallback category
 */
function getFallbackCategory(query: string): string {
  const q = query.toLowerCase();
  if (q.includes('beach') || q.includes('coast') || q.includes('sea') || q.includes('ocean') || q.includes('bali') || q.includes('hawaii')) return 'beach';
  if (q.includes('mountain') || q.includes('swiss') || q.includes('hiking') || q.includes('trek') || q.includes('nature') || q.includes('forest')) return 'mountain';
  if (q.includes('food') || q.includes('dining') || q.includes('restaurant') || q.includes('culinary') || q.includes('matcha') || q.includes('eat')) return 'food';
  if (q.includes('culture') || q.includes('temple') || q.includes('shrine') || q.includes('museum') || q.includes('history') || q.includes('kyoto')) return 'culture';
  if (q.includes('city') || q.includes('tokyo') || q.includes('paris') || q.includes('new york') || q.includes('rome') || q.includes('street')) return 'city';
  return 'default';
}

/**
 * Fetches a photo from Unsplash matching the query.
 * Falls back to a high-quality curated image list if no API key is available or the request fails.
 */
export async function getTravelPhoto(query: string): Promise<string> {
  const category = getFallbackCategory(query);
  const fallbacks = FALLBACK_PHOTOS[category];
  // Deterministic select based on query string hash
  const hash = query.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const fallbackUrl = fallbacks[hash % fallbacks.length];

  if (!UNSPLASH_ACCESS_KEY) {
    return fallbackUrl;
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=1`
    );
    if (response.ok) {
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        return data.results[0].urls.regular;
      }
    }
  } catch (error) {
    console.error('Failed to fetch from Unsplash API:', error);
  }

  return fallbackUrl;
}

/**
 * Fetches a daily rotating high-quality travel/landscape background image.
 */
export async function getDailyLandingImage(): Promise<string> {
  const queries = [
    'epic mountain sunrise', 
    'beautiful travel destination', 
    'scenic landscape sunrise', 
    'aesthetic travel view',
    'serene tropical beach',
    'historic cultural temple view',
    'vibrant historic city street'
  ];
  const day = new Date().getDate();
  const query = queries[day % queries.length];
  return getTravelPhoto(query);
}

