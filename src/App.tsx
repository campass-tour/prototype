import { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MainLayout, type TabId } from './components/common/MainLayout';
import { NfcSimulatorFab } from './components/common/NfcSimulatorFab';
import CheckInSuccessModal from './components/collection/CheckInSuccessModal';
// Route-based code-splitting: load pages and heavy viewers only when needed
const MapPage = lazy(() => import('./pages/MapPage'));
const CollectionPage = lazy(() => import('./pages/CollectionPage'));
const WardrobeStudioPage = lazy(() => import('./pages/WardrobeStudioPage'));
const WallPage = lazy(() => import('./pages/WallPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const ARModelViewer = lazy(() => import('./components/photo/ARModelViewer'));
import { getLocationData, LOCATIONS } from './constants/locations';
import { unlockCollectible, getUnlockedCount } from './lib/storage';
// Removed duplicate static import of ARModelViewer; only use lazy import above
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
  const activeTab = path.startsWith('collection')
    ? 'collection'
    : ['explore', 'wall', 'profile'].includes(path)
      ? path as TabId
      : 'explore';

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
        return path === 'collection/studio' ? <WardrobeStudioPage /> : <CollectionPage />;
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
      <Suspense fallback={<div className="h-40 flex items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-primary)] border-t-transparent" /></div>}>
        {renderContent()}

        <ARModelViewer
          open={isARViewerOpen}
          onClose={() => setIsARViewerOpen(false)}
          checkinId={checkInData.id}
          mascotName={checkInData.mascotName}
        />
      </Suspense>

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
    </MainLayout>
  );
}

export default App;
