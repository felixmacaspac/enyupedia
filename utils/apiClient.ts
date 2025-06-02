import { API_URL } from './apiConfig';

export interface ChatHistoryItem {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  input: {
    question: string;
    chat_history: ChatHistoryItem[];
    use_pdf: boolean;
  };
  config: {
    metadata: {
      conversation_id: string;
    };
  };
}

export class ApiClient {
  static async streamChat(
    request: ChatRequest
  ): Promise<(onChunk: (chunk: string) => void) => Promise<void>> {
    console.log(`Sending request to: ${API_URL}/chatbot`);

    return async (onChunk: (chunk: string) => void) => {
      try {
        const response = await fetch(`${API_URL}/chatbot`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'text/event-stream',
          },
          body: JSON.stringify(request),
        });

        console.log('Response status:', response.status);
        console.log(
          'Response headers:',
          JSON.stringify(Array.from(response.headers.entries()))
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API error (${response.status}): ${errorText}`);
        }

        // Try to get the response as text if streaming doesn't work
        if (!response.body) {
          console.log('Response body is null, trying to get text content');
          const text = await response.text();
          console.log('Received text content:', text);
          onChunk(text);
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            console.log('Stream complete');
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          console.log(
            'Received chunk:',
            chunk.substring(0, 50) + (chunk.length > 50 ? '...' : '')
          );
          onChunk(chunk);
        }
      } catch (error) {
        console.error('Error with chatbot endpoint:', error);
        onChunk(`Error: ${error.message}`);
        throw error;
      }
    };
  }

  static async testConnection(): Promise<{
    success: boolean;
    message: string;
    availableEndpoints?: string[];
  }> {
    try {
      // First, test the base URL
      console.log(`Testing connection to: ${API_URL}`);
      const baseResponse = await fetch(API_URL);

      // Default endpoints based on your API
      const availableEndpoints = ['/chatbot'];

      if (baseResponse.ok) {
        // Try to parse response for additional info
        try {
          const data = await baseResponse.json();
          if (data && data.endpoints && Array.isArray(data.endpoints)) {
            return {
              success: true,
              message: `Connection successful (${baseResponse.status})`,
              availableEndpoints: data.endpoints,
            };
          }
        } catch (e) {
          // Ignore JSON parsing errors
        }

        return {
          success: true,
          message: `Connection successful (${baseResponse.status})`,
          availableEndpoints,
        };
      } else {
        return {
          success: false,
          message: `Server responded with status: ${baseResponse.status}`,
          availableEndpoints,
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : String(error),
      };
    }
  }

  // Simple test endpoint for debugging
  static async testChatbot(): Promise<string> {
    try {
      const response = await fetch(`${API_URL}/chatbot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: {
            question: 'Test question',
            chat_history: [],
            use_pdf: false,
          },
          config: {
            metadata: {
              conversation_id: 'test-123',
            },
          },
        }),
      });

      if (!response.ok) {
        return `Error: ${response.status} ${response.statusText}`;
      }

      const text = await response.text();
      return `Success: ${text.substring(0, 100)}...`;
    } catch (error) {
      return `Exception: ${error.message}`;
    }
  }
}
