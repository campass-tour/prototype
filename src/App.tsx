import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MainLayout, type TabId } from './components/common/MainLayout';
import { NfcSimulatorFab } from './components/common/NfcSimulatorFab';
import CheckInSuccessModal from './components/collection/CheckInSuccessModal';
import MapPage from './pages/MapPage';
import { CollectionPage } from './pages/CollectionPage';
import { WallPage } from './pages/WallPage';
import ProfilePage from './pages/ProfilePage';
import { getLocationData, LOCATIONS } from './constants/locations';
import { unlockCollectible, getUnlockedCount } from './lib/storage';
import ARModelViewer from './components/photo/ARModelViewer';
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

  const [unlockedCount, setUnlockedCount] = useState(() => getUnlockedCount());
  const [isARViewerOpen, setIsARViewerOpen] = useState(false);

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
        setUnlockedCount(getUnlockedCount()); // 立即刷新进度
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
        return <MapPage />;
      case 'collection':
        return <CollectionPage />;
      case 'wall':
        return <WallPage />;
      case 'profile':
        return <ProfilePage />;
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
          setIsARViewerOpen(true);
        }}
        checkinId={checkInData.id}
        locationName={checkInData.locationName}
        mascotName={checkInData.mascotName}
        current={unlockedCount}
        total={LOCATIONS.length}
      />

      <ARModelViewer
        open={isARViewerOpen}
        onClose={() => setIsARViewerOpen(false)}
        checkinId={checkInData.id}
        mascotName={checkInData.mascotName}
      />
    </MainLayout>
  );
}

export default App;
