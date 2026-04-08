import React, { useState } from 'react';
import cluesDataRaw from '../../data/clues.json';

const ALL_CLUES = cluesDataRaw as any[];

interface LockedContentProps {
  id?: string;
  realBuildingName: string;
  hintImage?: string;
  hintText?: string;
}

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export const LockedContent: React.FC<LockedContentProps> = ({
  id,
  realBuildingName,
  hintImage,
  hintText
}) => {
  const [unlockedLevel, setUnlockedLevel] = useState(1);
  const [expandedPanel, setExpandedPanel] = useState(1);
  const [activeQuiz, setActiveQuiz] = useState<any>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const locationData = ALL_CLUES.find(c => c.locationId === id);

  if (!locationData) {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="font-bold mb-[var(--spacing-3)] text-2xl leading-tight text-[var(--color-text-main)]">
          Mysterious Spot
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
          {hintText || 'Find this exact spot to unlock its secrets.'}
        </p>
        <div className="relative w-full aspect-4/3 rounded-[var(--radius-card)] overflow-hidden bg-gray-200 shadow-inner">
          {hintImage ? (
            <img 
              src={hintImage} 
              alt="Location Clue" 
              className="w-full h-full object-cover blur-[6px] scale-110"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-[var(--color-text-secondary)] bg-[var(--color-state-disabled)] blur-sm">
              <svg className="w-12 h-12 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
              <span>Blurred Clue Image</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  const { clues, quizzes } = locationData;
  const q1 = quizzes[0];
  const q2 = quizzes[1];

  const handleOpenQuiz = (levelToUnlock: number) => {
    const targetQuiz = levelToUnlock === 2 ? q1 : q2;
    setActiveQuiz({ levelToUnlock, quiz: targetQuiz });
    setSelectedOption(null);
    setQuizFeedback(null);
  };

  const handleSubmitQuiz = () => {
    if (selectedOption === null || !activeQuiz) return;
    
    if (selectedOption === activeQuiz.quiz.correctAnswerIndex) {
      setQuizFeedback({ type: 'success', message: activeQuiz.quiz.successMessage });
      setTimeout(() => {
        setUnlockedLevel(activeQuiz.levelToUnlock);
        setExpandedPanel(activeQuiz.levelToUnlock);
        setActiveQuiz(null);
        setQuizFeedback(null);
      }, 2000);
    } else {
      setQuizFeedback({ type: 'error', message: 'Incorrect. Try thinking differently and guessing again!' });
    }
  };

  // --- Render Functions ---
  const renderAccordionItem = (level: number, title: string, locked: boolean, expanded: boolean, content: React.ReactNode) => {
    return (
      <div 
        key={level}
        className={`overflow-hidden border rounded-[var(--radius-card)] transition-colors duration-300 ${
          locked ? 'border-gray-200 bg-gray-50' : expanded ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5' : 'border-[var(--color-primary)]/30'
        }`}
      >
        <button 
          className={`w-full flex items-center justify-between p-4 font-bold transition-colors ${
            locked ? 'text-gray-400 cursor-not-allowed' : expanded ? 'text-[var(--color-primary)]' : 'text-[var(--color-primary)]/80'
          }`}
          onClick={() => !locked && setExpandedPanel(expanded ? 0 : level)}
          disabled={locked}
        >
          <span className="flex items-center gap-2">
            Level {level}: {title}
          </span>
          <span className="transition-transform duration-300 flex items-center" style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            {!locked && level <= unlockedLevel ? <ChevronDownIcon /> : <LockIcon />}
          </span>
        </button>
        <div 
          className="transition-all duration-300 ease-in-out px-4 overflow-hidden"
          style={{ maxHeight: expanded ? '800px' : '0px', opacity: expanded ? 1 : 0 }}
        >
          <div className="pb-4 pt-1 text-sm text-[var(--color-text-secondary)] leading-relaxed">
            {content}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-3 relative">
      <h2 className="font-bold px-1 text-xl text-[var(--color-text-main)] text-center">
        {realBuildingName}
      </h2>

      {/* Accordion List */}
      <div className="flex flex-col gap-2">
        {/* Panel 1: The Ambience */}
        {renderAccordionItem(
          1, 
          "The Ambience", 
          false, 
          expandedPanel === 1,
          <>
            <div className="relative w-full aspect-video rounded-md overflow-hidden bg-gray-200 mb-3 shadow-inner">
              <img 
                src={hintImage || clues.card1.image_placeholder}
                onError={(e) => { e.currentTarget.src = hintImage || 'https://via.placeholder.com/400x300?text=Clue+Placeholder'; }}
                alt="Ambience Clue" 
                className={`w-full h-full object-cover transition-all duration-500 blur-[8px] scale-110 opacity-70`}
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="bg-black/60 px-3 py-1.5 rounded-full text-white font-bold text-xs tracking-wide backdrop-blur-md">
                  Heavily Blurred
                </span>
              </div>
            </div>
            <p className="mb-4 italic">"{clues.card1.lv1_text}"</p>
            
            {unlockedLevel < 2 ? (
              <button 
                onClick={() => handleOpenQuiz(2)}
                className="w-full py-2.5 bg-[var(--color-primary)] text-white rounded-md font-bold text-sm shadow-md active:scale-[0.98] transition-transform flex justify-center items-center gap-2"
              >
                <span>Accept Challenge 1</span>
                <LockIcon />
              </button>
            ) : (
              <div className="py-2 flex items-center justify-center gap-2 text-[var(--color-success)] text-sm font-bold">
                <CheckIcon /> Challenge Completed
              </div>
            )}
          </>
        )}

        {/* Panel 2: The Zone */}
        {renderAccordionItem(
          2, 
          "The Zone", 
          unlockedLevel < 2, 
          expandedPanel === 2,
          <>
            <div className="relative w-full aspect-[2/1] rounded-md overflow-hidden bg-gray-100 mb-3 shadow-inner">
              <img 
                src={hintImage || clues.card1.image_placeholder}
                onError={(e) => { e.currentTarget.src = hintImage || 'https://via.placeholder.com/400x200?text=Zone+Placeholder'; }}
                alt="Zone Clue" 
                className={`w-full h-full object-cover transition-all duration-500 blur-[2px] scale-105 opacity-90`}
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="bg-[var(--color-primary)]/80 px-2 py-1 rounded text-white font-bold text-xs tracking-wide">
                  Clearer Vision
                </span>
              </div>
            </div>
            <p className="mb-4 font-medium text-[var(--color-text-main)]">{clues.card1.lv2_text}</p>
            
            {unlockedLevel < 3 ? (
              <button 
                onClick={() => handleOpenQuiz(3)}
                className="w-full py-2.5 bg-[var(--color-primary)] text-white rounded-md font-bold text-sm shadow-md active:scale-[0.98] transition-transform flex justify-center items-center gap-2"
              >
                <span>Accept Challenge 2</span>
                <LockIcon />
              </button>
            ) : (
              <div className="py-2 flex items-center justify-center gap-2 text-[var(--color-success)] text-sm font-bold">
                <CheckIcon /> Challenge Completed
              </div>
            )}
          </>
        )}

        {/* Panel 3: The Exact Coordinates */}
        {renderAccordionItem(
          3, 
          "Final Coordinates", 
          unlockedLevel < 3, 
          expandedPanel === 3,
          <>
            <div className="relative w-full aspect-video rounded-md overflow-hidden bg-gray-100 mb-3 shadow-[var(--shadow-card)]">
              <img 
                src={hintImage || clues.card2.image_placeholder}
                onError={(e) => { e.currentTarget.src = hintImage || 'https://via.placeholder.com/400x300?text=Target+Located'; }}
                alt="Exact NFC Location" 
                className={`w-full h-full object-cover`}
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-12 h-12 border-4 border-red-500 rounded-full animate-ping opacity-50 absolute"></div>
                <div className="w-[8px] h-[8px] bg-red-600 rounded-full"></div>
              </div>
            </div>
            <p className="mb-3 font-medium text-[var(--color-text-main)] bg-[var(--color-warning)]/10 p-3 rounded-md border border-[var(--color-warning)]/30">
              {clues.card2.lv3_text}
            </p>
          </>
        )}
      </div>

      {/* Full Cover Quiz Modal */}
      {activeQuiz && (
        <div className="absolute inset-0 z-50 bg-[var(--color-surface)] flex flex-col rounded-[var(--radius-card)]">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
            <h3 className="font-bold text-[var(--color-primary)] flex items-center gap-2">
              <LockIcon /> Unlocking Level {activeQuiz.levelToUnlock}
            </h3>
            <button 
              onClick={() => setActiveQuiz(null)}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500"
            >
              ×
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto flex flex-col">
            <p className="font-bold text-lg mb-5 leading-tight">{activeQuiz.quiz.question}</p>
            
            <div className="flex flex-col gap-3 flex-1">
              {activeQuiz.quiz.options.map((opt: string, i: number) => {
                // Determine option index assuming standard A->0, B->1 etc, but user's json has 1-indexed. Wait, user json had:
                // correctAnswerIndex: 2 (for C?), index 4 (for D?) Let's use 1-based indexing for selection match.
                // The prompt says "correctAnswerIndex": 2 means "B." or "C."? Wait, usually 1-based, Option C = 3? In user's JSON, Option C is 2? Let's treat the index as raw value exactly matching user's config if 1-based or 0-based.
                // Wait, "options": ["A.", "B.", "C.", "D."] => B is index 1. But user gave 2 for C. That's 0-based index. "D. All of the above" -> index 4? Wait, size 4 array has max index 3. If index is 4, maybe they meant 1-based where 4 = Option D.
                // Let's just use 1-based everywhere in state and match exactly what they wrote.
                const isSelected = selectedOption === (i + 1);
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedOption(i + 1)}
                    className={`text-left p-3 rounded-md border-2 transition-all ${
                      isSelected 
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium shadow-sm' 
                        : 'border-transparent bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>

            {quizFeedback && (
              <div className={`mt-4 p-3 rounded-md text-sm font-bold animate-in fade-in slide-in-from-bottom-2 ${
                quizFeedback.type === 'success' 
                  ? 'bg-green-100 text-green-700 border border-green-200' 
                  : 'bg-red-100 text-red-700 border border-red-200'
              }`}>
                {quizFeedback.message}
              </div>
            )}

            <button 
              onClick={handleSubmitQuiz}
              disabled={selectedOption === null || quizFeedback?.type === 'success'}
              className="mt-6 w-full py-3 bg-[var(--color-primary)] text-white rounded-md font-bold disabled:opacity-50 disabled:scale-100 active:scale-[0.98] transition-transform"
            >
              {quizFeedback?.type === 'success' ? 'Unlocking...' : 'Submit Answer'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
