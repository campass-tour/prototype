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
          <div className="flex flex-col items-center justify-center flex-1 bg-[var(--color-surface)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)] border border-gray-100 min-h-[50vh]">
            <h2 className="text-[var(--color-primary)] font-bold text-3xl mb-4">Explore Campus</h2>
            <p className="text-[var(--color-text-secondary)] text-lg">The interactive map will go here.</p>
          </div>
        );
      case 'collection':
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
              <div key={item} className="h-48 md:h-56 bg-[var(--color-surface)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)] flex flex-col items-center justify-center border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 rounded-full bg-[var(--color-accent)]/20 mb-3"></div>
                <span className="text-[var(--color-text-main)] font-semibold text-lg">Item {item}</span>
              </div>
            ))}
          </div>
        );
      case 'wall':
        return (
          <div className="space-y-6 max-w-4xl mx-auto w-full">
            {[1, 2, 3, 4, 5].map((message) => (
              <div key={message} className="p-6 bg-[var(--color-surface)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)] border border-gray-100">
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
          <div className="bg-[var(--color-surface)] rounded-[var(--radius-card)] p-8 shadow-[var(--shadow-card)] border border-gray-100 max-w-4xl mx-auto w-full">
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
    </MainLayout>
  );
}

export default App;

