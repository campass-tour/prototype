import React from 'react';
import { BookHeart } from 'lucide-react';
import { getMessages } from '../../lib/dataSources';
import MessageCard from '../wall/MessageCard';
import type { Message } from '../../types';

export const MyMemories: React.FC = () => {
  const all = getMessages();
  // filter messages authored by user with id = 1
  const myMessages = all.filter((m: Message) => m.authorId === 1 || m.author?.username === 'silly bird');

  return (
    <div className="bg-[var(--color-surface)] rounded-[var(--radius-card)] p-6 shadow-[var(--shadow-card)] w-full min-h-[250px] flex flex-col border border-[var(--border)]">
      <h3 className="text-lg md:text-xl font-bold text-[var(--color-text-main)] mb-4 flex items-center gap-2 m-0">
        <BookHeart size={20} className="text-[var(--color-accent)]" />
        Memories & Echoes
      </h3>

      {myMessages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-[var(--color-state-disabled)]/50">
            <svg className="w-6 h-6 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h11"></path></svg>
          </div>
          <p className="text-[var(--color-text-secondary)] text-sm md:text-base max-w-[200px]">
            No echoes found.
          </p>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1 opacity-70">
            Explore the campus and leave your first echo!
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {myMessages.map((m) => (
            <MessageCard
              key={m.id}
              userName={m.author.username}
              userAvatar={m.author.avatarUrl || ''}
              timestamp={m.timestamp}
              text={m.content}
              imageUrl={m.imageUrl}
              initialLikes={m.likes}
            />
          ))}
        </div>
      )}
    </div>
  );
};