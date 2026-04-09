import React, { useMemo, useState } from 'react';
import { BookHeart } from 'lucide-react';
import { MESSAGES } from '../../constants/messages';
import PolaroidCard from '../../components/wall/PolaroidCard';

const formatTimestamp = (iso?: string) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export const MyMemories: React.FC = () => {
  // For now use authorId === 1 as the current user (data/users.json)
  const currentUserId = 1;
  const userMessages = useMemo(() => MESSAGES.filter(m => m.authorId === currentUserId || m.author.username === 'silly bird'), []);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);

  return (
    <div className="bg-[var(--color-surface)] rounded-[var(--radius-card)] p-6 shadow-[var(--shadow-card)] w-full border border-[var(--border)]">
      <h3 className="text-lg md:text-xl font-bold text-[var(--color-text-main)] mb-4 flex items-center gap-2 m-0">
        <BookHeart size={20} className="text-[var(--color-accent)]" />
        Memories & Echoes
      </h3>

      {userMessages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-[var(--color-state-disabled)]/50">
            <svg className="w-6 h-6 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h11"></path></svg>
          </div>
          <p className="text-[var(--color-text-secondary)] text-sm md:text-base max-w-[300px]">
            You haven't posted any memories yet.
          </p>
        </div>
      ) : (
        <div className="max-h-[52vh] overflow-auto pr-4 px-4 pb-4 pt-4">
          <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4" style={{ columnGap: '1.5rem' }}>
            {userMessages.map((msg, idx) => (
              <div className="mb-6" key={msg.id}>
                <PolaroidCard message={msg} index={idx} onClick={() => setSelectedMessageId(msg.id)} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};