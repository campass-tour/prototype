export const LOCATIONS = [
  { id: 'cb', name: 'Central Building', x: 31.5, y: 50 },
  { id: 'sb', name: 'Science Building B', x: 45, y: 35 },
  { id: 'mus', name: 'Museum', x: 29, y: 54 },
  { id: 'hui', name: 'Hui Bar', x: 50, y: 90 },
];

export const getLocationData = (id: string) => {
  const location = LOCATIONS.find(loc => loc.id === id);
  if (!location) return null;
  
  return {
    id: location.id,
    locationName: location.name,
    mascotName: `${location.name} Mascot`
  };
};
