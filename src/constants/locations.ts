import { getLocations as _getLocations, getLocationById as _getLocationById } from '../lib/dataSources';

export const LOCATIONS = _getLocations();

export const getLocationData = (id: string) => {
  const location = _getLocationById(id);
  if (!location) return null;

  return {
    id: location.id,
    locationName: location.name,
    mascotName: `${location.name} Mascot`
  };
};
