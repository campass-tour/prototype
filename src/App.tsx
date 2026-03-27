import { useState } from 'react';
import { MainLayout, type TabId } from './components/common/MainLayout';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('explore');

  // Simple rendering logic based on state
  const renderContent = () => {
    switch (activeTab) {
      case 'explore':
        return (
          <div className="flex flex-col items-center justify-center h-64 bg-[var(--color-surface)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)] border border-gray-100">
            <h2 className="text-[var(--color-primary)] font-bold text-2xl mb-2">Explore Campus</h2>
            <p className="text-[var(--color-text-secondary)]">The interactive map will go here.</p>
          </div>
        );
      case 'collection':
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="h-40 bg-[var(--color-surface)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)] flex flex-col items-center justify-center border border-gray-100">
                <div className="w-12 h-12 rounded-full bg-[var(--color-accent)]/20 mb-2"></div>
                <span className="text-[var(--color-text-main)] font-semibold">Item {item}</span>
              </div>
            ))}
          </div>
        );
      case 'wall':
        return (
          <div className="space-y-4">
            {[1, 2, 3].map((message) => (
              <div key={message} className="p-4 bg-[var(--color-surface)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)] border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                  <div className="font-semibold text-sm">Student {message}</div>
                </div>
                <p className="text-[var(--color-text-main)] text-sm">This is a great place to hang out between classes! Any other recommendations?</p>
              </div>
            ))}
          </div>
        );
      case 'profile':
        return (
          <div className="bg-[var(--color-surface)] rounded-[var(--radius-card)] p-6 shadow-[var(--shadow-card)] border border-gray-100">
            <div className="flex items-center gap-4 mb-6 relative">
              <div className="w-20 h-20 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] font-bold text-2xl">
                JD
              </div>
              <div>
                <h2 className="text-xl font-bold text-[var(--color-text-main)]">John Doe</h2>
                <p className="text-sm text-[var(--color-accent)] font-medium">Level 5 Explorer</p>
              </div>
            </div>
            
            <h3 className="font-bold text-[var(--color-text-main)] mb-3">Stats</h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-[var(--color-background)] p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-[var(--color-primary)]">42</div>
                <div className="text-xs text-[var(--color-text-secondary)]">Locations Visited</div>
              </div>
              <div className="bg-[var(--color-background)] p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-[var(--color-primary)]">15</div>
                <div className="text-xs text-[var(--color-text-secondary)]">Badges Collected</div>
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
    </MainLayout>
  );
}

export default App;

