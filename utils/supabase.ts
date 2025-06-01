import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Get the Supabase URL and anon key from environment variables
const supabaseUrl = Constants.expoConfig?.extra?.SUPABASE_URL;
const supabaseAnonKey = Constants.expoConfig?.extra?.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase configuration. Please check your environment variables.');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Function to process PDF and create embeddings
export async function processPDFAndCreateEmbeddings(pdfBase64: string, fileName: string) {
  try {
    // Upload PDF to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('handbooks')
      .upload(`${fileName}`, decode(pdfBase64), {
        contentType: 'application/pdf',
        upsert: true
      });

    if (uploadError) throw uploadError;

    // Call your Edge Function to process the PDF and create embeddings
    const { data: processData, error: processError } = await supabase.functions
      .invoke('process-pdf', {
        body: { fileName: uploadData.path }
      });

    if (processError) throw processError;

    return processData;
  } catch (error) {
    console.error('Error processing PDF:', error);
    throw error;
  }
}

// Function to search similar content using embeddings
export async function searchSimilarContent(query: string) {
  try {
    const { data: embeddings, error: embeddingError } = await supabase.functions
      .invoke('generate-embeddings', {
        body: { text: query }
      });

    if (embeddingError) throw embeddingError;

    // Search for similar content in the vector store
    const { data: matches, error: searchError } = await supabase.rpc(
      'match_handbook_sections',
      {
        query_embedding: embeddings,
        match_threshold: 0.78,
        match_count: 5
      }
    );

    if (searchError) throw searchError;

    return matches;
  } catch (error) {
    console.error('Error searching content:', error);
    throw error;
  }
}

// Helper function to decode base64
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}