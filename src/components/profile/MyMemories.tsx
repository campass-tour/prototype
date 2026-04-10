import React, { useMemo, useState } from 'react';
import { BookHeart } from 'lucide-react';
import { MESSAGES } from '../../constants/messages';
import PolaroidCard from '../../components/wall/PolaroidCard';
import { MessageDetailModal } from '../../components/common/MessageDetailModal';

/* timestamp formatter removed (unused) */


// DanmakuItem type (copied from Danmaku.tsx for reference)
// export interface DanmakuItem {
//   id: string; text: string; avatar?: string; rightImage?: string; top: number; duration: number; originalMessage: Message;
// }

export const MyMemories: React.FC = () => {
  // For now use authorId === 1 as the current user (data/users.json)
  const currentUserId = 1;
  const userMessages = useMemo(() => MESSAGES.filter(m => m.authorId === currentUserId || m.author.username === 'silly bird'), []);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

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
                <PolaroidCard
                  message={msg}
                  index={idx}
                  onClick={() => {
                    // Convert to DanmakuItem shape for MessageDetailModal
                    setSelectedItem({
                      id: msg.id,
                      text: msg.content,
                      avatar: msg.author.avatarUrl,
                      rightImage: msg.imageUrl,
                      top: 0,
                      duration: 0,
                      originalMessage: msg
                    });
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      {/* MessageDetailModal for selected card */}
      <MessageDetailModal 
        item={selectedItem} 
        onClose={() => setSelectedItem(null)}
        showDeleteIcon={selectedItem?.originalMessage.author.username === 'silly bird'}
      />
    </div>
  );
};