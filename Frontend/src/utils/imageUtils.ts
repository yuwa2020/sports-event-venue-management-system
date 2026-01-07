// Event image mapping
const eventImages: { [key: string]: string } = {
  'christmas-2023': 'https://images.pexels.com/photos/3428285/pexels-photo-3428285.jpeg', // Christmas concert
  'new-year-2024': 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg', // New Year concert
  'default': 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg' // Default concert image
};

// Venue image mapping
const venueImages: { [key: string]: string } = {
  'dy-patil': 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg', // Stadium
  'elite-indoor': 'https://images.pexels.com/photos/945471/pexels-photo-945471.jpeg', // Indoor court
  'sunset-soccer': 'https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg', // Soccer field
  'downtown-basketball': 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg', // Basketball hub
  'aqua-sports': 'https://images.pexels.com/photos/1263426/pexels-photo-1263426.jpeg', // Sports complex
  'mountain-climb': 'https://images.pexels.com/photos/47356/freerider-skiing-ski-sports-47356.jpeg', // Climbing center
  'default': 'https://images.pexels.com/photos/399187/pexels-photo-399187.jpeg' // Default venue image
};

export const getImageUrl = (id: string, type: 'venue' | 'event' = 'venue'): string => {
  if (type === 'event') {
    return eventImages[id] || eventImages['default'];
  }
  return venueImages[id] || venueImages['default'];
}; 