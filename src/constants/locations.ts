export const LOCATIONS = [
  { id: 'cb', name: 'Central Building' },
  { id: 'sb', name: 'Science Building B' },
  { id: 'mus', name: 'Museum' },
  { id: 'hui', name: 'Hui Bar' },
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
