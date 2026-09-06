import type { Pandal } from './types';

export async function searchGooglePlacesForPandals(query: string): Promise<Pandal[]> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    console.error("GOOGLE_MAPS_API_KEY is not defined.");
    return [];
  }

  // Ensure the query implies a pandal in Kolkata if it's just a generic block name
  const searchQuery = `${query} Durga Puja Pandal Kolkata`;

  try {
    const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location',
      },
      body: JSON.stringify({
        textQuery: searchQuery,
      }),
      // We can use next.js fetch caching if we want, but let's keep it dynamic for now
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error('Google Places API Error:', await response.text());
      return [];
    }

    const data = await response.json();
    
    if (!data.places || data.places.length === 0) {
      return [];
    }

    // Map Google Places results to our internal Pandal format
    return data.places.map((place: any) => {
      return {
        id: `google-${place.id}`,
        name: place.displayName?.text || 'Unknown Pandal',
        area: place.formattedAddress || 'Kolkata',
        zone: 'Kolkata', // Default zone for external results
        isFeatured: false,
        verificationStatus: 'PENDING',
        latitude: place.location?.latitude || 22.5726,
        longitude: place.location?.longitude || 88.3639,
        festivalId: 'external-search',
        editions: [
          {
            year: 2026,
            theme: 'Sourced from Google Maps',
            awards: '[]'
          }
        ]
      } as unknown as Pandal;
    });

  } catch (error) {
    console.error('Failed to search Google Places:', error);
    return [];
  }
}
