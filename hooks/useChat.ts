import { useState, useCallback, useEffect } from 'react';
import { ApiClient, ChatRequest } from '../utils/apiClient';
import { nanoid } from 'nanoid/non-secure';
import { API_URL } from '../utils/apiConfig';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ConnectionStatus {
  tested: boolean;
  success?: boolean;
  message?: string;
  availableEndpoints?: string[];
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationId] = useState(() => nanoid());
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    tested: false,
  });
  const [testResult, setTestResult] = useState<string | null>(null);

  // Test the API connection on mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        const result = await ApiClient.testConnection();
        setConnectionStatus({
          tested: true,
          success: result.success,
          message: result.message,
          availableEndpoints: result.availableEndpoints,
        });

        // Also test the chatbot endpoint specifically
        const chatbotTest = await ApiClient.testChatbot();
        setTestResult(chatbotTest);
      } catch (error) {
        setConnectionStatus({
          tested: true,
          success: false,
          message: error instanceof Error ? error.message : String(error),
        });
      }
    };

    if (__DEV__) {
      testConnection();
    }
  }, []);

  const sendMessage = useCallback(
    async (content: string, usePdf: boolean = true) => {
      try {
        setIsLoading(true);
        setError(null);

        // Add user message to state
        const userMessage: Message = {
          id: nanoid(),
          role: 'user',
          content,
        };

        setMessages((prev) => [...prev, userMessage]);

        // Create empty assistant message that will be updated with streaming content
        const assistantMessage: Message = {
          id: nanoid(),
          role: 'assistant',
          content: '',
        };

        setMessages((prev) => [...prev, assistantMessage]);

        // Prepare chat history for the API
        const chatHistory = messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

        // Create request
        const request: ChatRequest = {
          input: {
            question: content,
            chat_history: chatHistory,
            use_pdf: usePdf,
          },
          config: {
            metadata: {
              conversation_id: conversationId,
            },
          },
        };

        console.log('Sending request:', JSON.stringify(request, null, 2));

        // Get streaming handler
        const streamHandler = await ApiClient.streamChat(request);

        // Process the stream
        let accumulatedContent = '';

        await streamHandler((chunk) => {
          // Append to accumulated content
          accumulatedContent += chunk;

          // Update the assistant message with the accumulated content
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessage.id
                ? { ...msg, content: accumulatedContent }
                : msg
            )
          );
        });
      } catch (err) {
        console.error('Error sending message:', err);
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred'
        );

        // Update the assistant message to show the error
        setMessages((prev) =>
          prev.map((msg) =>
            msg.role === 'assistant' && msg.content === ''
              ? {
                  ...msg,
                  content: 'Sorry, something went wrong. Please try again.',
                }
              : msg
          )
        );
      } finally {
        setIsLoading(false);
      }
    },
    [messages, conversationId]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    apiUrl: API_URL,
    connectionStatus,
    testResult,
  };
}
