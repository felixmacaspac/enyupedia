import React, { createContext, useState, useContext, ReactNode } from 'react';
import * as FileSystem from 'expo-file-system';

interface DocumentAsset {
  name: string;
  size: number;
  uri: string;
  mimeType?: string;
  lastModified?: number;
}

interface AIContextProps {
  hasLoadedDocument: boolean;
  documentName: string | null;
  loadDocument: (document: DocumentAsset) => Promise<void>;
  removeDocument: () => void;
}

const AIContext = createContext<AIContextProps>({
  hasLoadedDocument: false,
  documentName: null,
  loadDocument: async () => {},
  removeDocument: () => {},
});

export const useAIContext = () => useContext(AIContext);

interface AIProviderProps {
  children: ReactNode;
}

export const AIProvider: React.FC<AIProviderProps> = ({ children }) => {
  const [hasLoadedDocument, setHasLoadedDocument] = useState(false);
  const [documentName, setDocumentName] = useState<string | null>(null);
  const [documentUri, setDocumentUri] = useState<string | null>(null);

  const loadDocument = async (document: DocumentAsset) => {
    try {
      // In a real implementation, here we would:
      // 1. Save the document to file system
      // 2. Process it with a PDF parser
      // 3. Generate embeddings
      // 4. Store in vector database
      
      // For this demo, we'll just simulate the process
      setDocumentName(document.name);
      setDocumentUri(document.uri);
      setHasLoadedDocument(true);
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Document loaded:', document.name);
      return;
    } catch (error) {
      console.error('Error loading document:', error);
      throw error;
    }
  };

  const removeDocument = () => {
    setHasLoadedDocument(false);
    setDocumentName(null);
    setDocumentUri(null);
  };

  return (
    <AIContext.Provider
      value={{
        hasLoadedDocument,
        documentName,
        loadDocument,
        removeDocument,
      }}
    >
      {children}
    </AIContext.Provider>
  );
};