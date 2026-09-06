import React from 'react';
import { User, AlertCircle, MessageSquare } from 'lucide-react';

export const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';
  const isError = message.isError;

  return (
    <div className={`flex items-start space-x-2.5 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>

      {/* Distinct Avatar */}
      <div
        className={`w-7 h-7 rounded-full overflow-hidden flex items-center justify-center shrink-0 text-xs shadow-sm ${isUser
            ? 'bg-th-surface-el text-th-text-primary ring-1 ring-th-border'
            : isError
              ? 'bg-th-danger-tint text-th-danger ring-1 ring-th-danger/30'
              : 'bg-th-brand text-white ring-1 ring-th-border'
          }`}
      >
        {isUser ? (
          <User className="w-3.5 h-3.5" />
        ) : isError ? (
          <AlertCircle className="w-3.5 h-3.5" />
        ) : (
          <MessageSquare className="w-4 h-4" />
        )}
      </div>

      {/* Message Bubble */}
      <div
        className={`max-w-[85%] text-[13px] leading-relaxed shadow-soft border ${isUser
            ? 'bg-th-surface-el text-th-text-primary border-th-border rounded-2xl rounded-tr-sm px-4 py-3'
            : isError
              ? 'bg-th-danger-tint text-th-danger border-th-danger/30 rounded-2xl rounded-tl-sm px-4 py-3'
              : 'bg-th-surface text-th-text-primary border-th-border rounded-2xl rounded-tl-sm px-4 py-3'
          }`}
      >
        <div className="whitespace-pre-wrap break-words">{message.content}</div>

        {message.timestamp && (
          <div
            className={`text-[9px] mt-2 text-right font-mono ${isUser ? 'text-th-text-muted' : 'text-th-text-secondary'
              }`}
          >
            {message.timestamp}
          </div>
        )}
      </div>

    </div>
  );
};
