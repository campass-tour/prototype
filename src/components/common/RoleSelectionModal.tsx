import React, { useState } from 'react';
import { Backpack, GraduationCap, Camera } from 'lucide-react';
import type { UserRole } from '../../lib/storage';
import { setUserRole } from '../../lib/storage';

interface RoleSelectionModalProps {
  isOpen: boolean;
  onClose: (role: UserRole) => void;
}

const roles: { id: UserRole; icon: React.ReactNode; label: string; description: string; color: string }[] = [
  {
    id: 'freshman',
    icon: <Backpack size={32} />,
    label: "The Explorer",
    description: "New here? Get practical tips and campus survival guides.",
    color: "#4CAF50" // Green shade
  },
  {
    id: 'senior',
    icon: <GraduationCap size={32} />,
    label: "The XJTLU Veteran",
    description: "Know your way around? Test your knowledge with trivia.",
    color: "#2196F3" // Blue shade
  },
  {
    id: 'visitor',
    icon: <Camera size={32} />,
    label: "The Guest",
    description: "Here to see the campus vibe? Explore our educational philosophy.",
    color: "#FF8C00" // Orange shade
  }
];

export const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({ isOpen, onClose }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (selectedRole) {
      setUserRole(selectedRole);
      onClose(selectedRole);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 'var(--z-overlay)' }}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-[var(--color-surface)] rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-300" style={{ zIndex: 'var(--z-modal)' }}>
        <h2 className="text-2xl font-bold text-center text-[var(--color-text-main)] mb-2">
          Who are you exploring as today?
        </h2>
        <p className="text-center text-[var(--color-text-secondary)] mb-6 text-sm">
          Select your campus persona to customize your experience.
        </p>

        <div className="flex flex-col gap-4 mb-6">
          {roles.map((role) => {
            const isSelected = selectedRole === role.id;
            return (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`relative flex items-center p-4 rounded-xl border-2 transition-all duration-300 text-left overflow-hidden ${
                  isSelected ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 scale-[1.02] shadow-md' : 'border-gray-200 hover:border-[var(--color-primary)]/50 hover:bg-gray-50'
                }`}
              >
                {/* Background accent for selected */}
                <div 
                  className={`absolute inset-0 opacity-10 transition-opacity duration-300 ${isSelected ? 'block' : 'hidden'}`}
                  style={{ backgroundColor: role.color }}
                />

                <div 
                  className={`flex items-center justify-center w-14 h-14 rounded-full mr-4 transition-transform duration-300 ${isSelected ? 'scale-110' : ''}`}
                  style={{ backgroundColor: `${role.color}20`, color: role.color }}
                >
                  {role.icon}
                </div>

                <div className="flex-1 z-10">
                  <h3 className="font-bold text-[var(--color-text-main)] text-lg mb-1">{role.label}</h3>
                  <p className="text-xs text-[var(--color-text-secondary)] leading-tight">{role.description}</p>
                </div>

                {isSelected && (
                  <div className="absolute right-4 w-6 h-6 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center shadow-lg animate-in fade-in zoom-in duration-200">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Confirm Button */}
        <div className={`transition-all duration-300 overflow-hidden ${selectedRole ? 'max-h-16 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
          <button
            onClick={handleConfirm}
            disabled={!selectedRole}
            className="w-full py-3 rounded-xl bg-[var(--color-primary)] text-white font-bold shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            Confirm & Start Exploring
          </button>
        </div>
      </div>
    </div>
  );
};
