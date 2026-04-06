import React from 'react';
import { MapViewer } from '../components/map/MapViewer';

const MapPage: React.FC = () => {
  return (
    <MapViewer className="flex-1 rounded-[var(--radius-card)] shadow-[var(--shadow-card)] border border-[var(--color-state-disabled)] min-h-[70vh] md:min-h-[calc(100vh-120px)]" initialScale={0.6} />
  );
};

export default MapPage;
