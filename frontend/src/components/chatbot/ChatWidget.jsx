import React, { useState } from 'react';
import { X, MessageSquare } from 'lucide-react';
import { ChatWindow } from './ChatWindow';

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Floating Chat Window Panel */}
      {isOpen && (
        <div className="mb-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <ChatWindow onClose={() => setIsOpen(false)} />
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative flex items-center justify-center p-1 rounded-full shadow-2xl transition-all duration-300 active:scale-95 ${isOpen
            ? 'bg-th-surface-el text-th-text-primary hover:bg-th-border ring-2 ring-th-brand/40 shadow-lg shadow-th-brand/10'
            : 'hover:scale-110 shadow-th-brand/30 hover:shadow-th-brand/50'
          }`}
        title={isOpen ? 'Close AI Risk Copilot' : 'Open AI Risk Copilot'}
        aria-label="Toggle AI Risk Copilot"
      >
        {/* Pulse alert indicator when closed */}
        {!isOpen && (
          <span className="absolute top-0 right-0 flex h-4 w-4 z-10">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-th-brand opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-th-brand border-2 border-th-surface shadow-sm"></span>
          </span>
        )}

        {isOpen ? (
          <div className="w-12 h-12 rounded-full bg-th-surface-el flex items-center justify-center text-th-text-primary border-2 border-th-brand/30">
            <X className="w-5 h-5 transition-transform duration-200 group-hover:rotate-90 text-th-text-primary" />
          </div>
        ) : (
          <div className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center shadow-lg transition-transform duration-200 ring-2 ring-th-brand/20 bg-th-brand text-white">
            <MessageSquare className="w-6 h-6" />
          </div>
        )}
      </button>
    </div>
  );
};
