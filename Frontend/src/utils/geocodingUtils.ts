interface GeocodingResult {
  lat: number;
  lng: number;
}

/**
 * Converts an address string to coordinates using OpenStreetMap's Nominatim service
 * @param address 
 * @returns 
 */
export async function getCoordinatesFromAddress(address: string): Promise<GeocodingResult | null> {
  try {

    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('Geocoding address:', address);

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&countrycodes=us&limit=1`;
    console.log('Geocoding URL:', url);

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'TeamUp-App'
      }
    });

    if (!response.ok) {
      console.error('Geocoding response not OK:', response.status, response.statusText);
      throw new Error('Geocoding request failed');
    }

    const data = await response.json();
    console.log('Geocoding response:', data);
    
    if (data.length > 0) {
      const result = {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
      console.log('Geocoding result:', result);
      return result;
    }
    
    console.log('No geocoding results found');
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

/**
 * Converts coordinates to an address using OpenStreetMap's Nominatim service
 * @param lat 
 * @param lng
 * @returns
 */
export async function getAddressFromCoordinates(lat: number, lng: number): Promise<string | null> {
  try {

    await new Promise(resolve => setTimeout(resolve, 1000));

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      {
        headers: {
          'Accept': 'application/json',

          'User-Agent': 'TeamUp-App'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Reverse geocoding request failed');
    }

    const data = await response.json();
    return data.display_name || null;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
} 