import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MainLayout, type TabId } from './components/common/MainLayout';
import { NfcSimulatorFab } from './components/common/NfcSimulatorFab';
import CheckInSuccessModal from './components/collection/CheckInSuccessModal';
import { MapViewer } from './components/map/MapViewer';
import { CollectionPage } from './components/collection/CollectionPage';
import { WallPage } from './pages/WallPage';
import { getLocationData, LOCATIONS } from './constants/locations';
import { unlockCollectible, getUnlockedCount } from './lib/storage';
import './App.css';

function App() {
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const checkinId = params.get('checkin');
    if (checkinId) {
      const locationInfo = getLocationData(checkinId);
      return !!locationInfo;
    }
    return false;
  });

  const [checkInData] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const checkinId = params.get('checkin');
    if (checkinId) {
      const locationInfo = getLocationData(checkinId);
      if (locationInfo) {
        return { id: locationInfo.id, locationName: locationInfo.locationName, mascotName: locationInfo.mascotName };
      }
    }
    return { id: '', locationName: '', mascotName: '' };
  });

  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname.substring(1);
  const activeTab = ['explore', 'collection', 'wall', 'profile'].includes(path) ? path as TabId : 'explore';

  useEffect(() => {
    // 1. Detection: Check if URL contains checkin parameter
    const params = new URLSearchParams(window.location.search);
    const checkinId = params.get('checkin');
    
    if (checkinId) {
      const locationInfo = getLocationData(checkinId);

      if (locationInfo) {
        const { id } = locationInfo;
        
        // 2. Unlock: Update localStorage (simulated backend/persistence)
        unlockCollectible(id);

        // 3. Cleanup: Remove parameter without refreshing
        const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.replaceState({ path: newUrl }, '', newUrl);
      }
    }
  }, []);

  // Simple rendering logic based on state
  const renderContent = () => {
    switch (activeTab) {
      case 'explore':
        return (
          <MapViewer className="flex-1 rounded-[var(--radius-card)] shadow-[var(--shadow-card)] border border-[var(--color-state-disabled)] min-h-[70vh] md:min-h-[calc(100vh-120px)]" initialScale={1.2} />
        );
      case 'collection':
        return <CollectionPage />;
      case 'wall':
        return <WallPage />;
      case 'profile':
        return (
          <div className="bg-[var(--color-surface)] rounded-[var(--radius-card)] p-8 shadow-[var(--shadow-card)] border border-[var(--color-state-disabled)] max-w-4xl mx-auto w-full">
            <div className="flex items-center gap-6 mb-8 relative">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] font-bold text-3xl md:text-4xl">
                JD
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-text-main)]">John Doe</h2>
                <p className="text-base md:text-lg text-[var(--color-accent)] font-medium mt-1">Level 5 Explorer</p>
              </div>
            </div>

            <h3 className="font-bold text-[var(--color-text-main)] text-xl mb-4">Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">        
              <div className="bg-[var(--color-background)] p-6 rounded-xl text-center shadow-sm">
                <div className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-2">42</div>
                <div className="text-sm md:text-base text-[var(--color-text-secondary)]">Locations Visited</div>
              </div>
              <div className="bg-[var(--color-background)] p-6 rounded-xl text-center shadow-sm">
                <div className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-2">15</div>
                <div className="text-sm md:text-base text-[var(--color-text-secondary)]">Badges Collected</div>
              </div>
            </div>
          </div>
        );
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <MainLayout activeTab={activeTab}>
      {renderContent()}

      <NfcSimulatorFab />

      <CheckInSuccessModal
        open={isCheckInModalOpen}
        onClose={() => setIsCheckInModalOpen(false)}
        onViewCollection={() => {
          navigate('/collection');
          setIsCheckInModalOpen(false);
        }}
        onEnterAR={() => {
          setIsCheckInModalOpen(false);
          alert('Enter AR capture page');
        }}
        checkinId={checkInData.id}
        locationName={checkInData.locationName}
        mascotName={checkInData.mascotName}
        current={getUnlockedCount()}
        total={LOCATIONS.length}
      />
    </MainLayout>
  );
}

export default App;
