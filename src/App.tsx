import { useState } from 'react';
import { MainLayout, type TabId } from './components/common/MainLayout';
import CheckInSuccessModal from './components/collection/CheckInSuccessModal';
import { MapViewer } from './components/map/MapViewer';
import MascotCard from './components/collection/MascotCard';
import CollectionProgressBar from './components/collection/CollectionProgressBar';
import './App.css';
function App() {
  const [activeTab, setActiveTab] = useState<TabId>('explore');
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);

  // Simple rendering logic based on state
  const renderContent = () => {
    switch (activeTab) {
      case 'explore':
        return (
          <MapViewer className="flex-1 rounded-[var(--radius-card)] shadow-[var(--shadow-card)] border border-[var(--color-state-disabled)] min-h-[70vh] md:min-h-[calc(100vh-120px)]" initialScale={1.2} />
        );
      case 'collection':
        return (
          <div className="w-full max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-[var(--color-text-main)]">
                  My Collection
                </h1>
                <p className="mt-1 text-[var(--color-text-secondary)]">
                  Discover campus landmarks and unlock your mascot gallery.
                </p>
              </div>

              <button
                onClick={() => setIsCheckInModalOpen(true)}
                className="rounded-[8px] bg-[var(--color-accent)] px-4 py-3 font-medium text-white transition hover:opacity-90"
              >
                Simulate NFC Check-in
              </button>
            </div>

            <CollectionProgressBar current={3} total={12} />

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              <MascotCard
                name="Hui Bar Bird"
                location="Hui Bar"
                status="unlocked"
              />
              <MascotCard
                name="Museum Bird"
                location="Museum"
                status="new"
              />
              <MascotCard
                name="Library Bird"
                location="Library"
                status="locked"
              />
              <MascotCard
                name="Central Building Bird"
                location="Central Building"
                status="unlocked"
              />
              <MascotCard
                name="South Campus Bird"
                location="South Campus"
                status="locked"
              />
            </div>
          </div>
        );
      case 'wall':
        return (
          <div className="space-y-6 max-w-4xl mx-auto w-full">
            {[1, 2, 3, 4, 5].map((message) => (
              <div key={message} className="p-6 bg-[var(--color-surface)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)] border border-[var(--color-state-disabled)]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                  <div className="font-semibold text-base">Student {message}</div>
                </div>
                <p className="text-[var(--color-text-main)] text-base md:text-lg">This is a great place to hang out between classes! Any other recommendations?</p>
              </div>
            ))}
          </div>
        );
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
    <MainLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}

    <CheckInSuccessModal
  open={isCheckInModalOpen}
  onClose={() => setIsCheckInModalOpen(false)}
  onViewCollection={() => {
    setActiveTab('collection');
    setIsCheckInModalOpen(false);
  }}
  onEnterAR={() => {
    setIsCheckInModalOpen(false);
    alert('Enter AR capture page');
  }}
  locationName="Museum"
  mascotName="Museum Bird"
  current={3}
  total={12}
/>
    </MainLayout>
  );
}

export default App;
