import React, { createContext, useContext, ReactNode } from 'react';
import { useChat } from '../hooks/useChat';

interface AIContextType {
  messages: Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
  }>;
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string, usePdf?: boolean) => Promise<void>;
  clearMessages: () => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export function AIProvider({ children }: { children: ReactNode }) {
  const chat = useChat();

  return <AIContext.Provider value={chat}>{children}</AIContext.Provider>;
}

export function useAI() {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
}
