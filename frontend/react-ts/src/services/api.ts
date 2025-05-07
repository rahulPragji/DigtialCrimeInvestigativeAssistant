/**
 * API Client Service
 * 
 * Provides functions to interact with the backend API endpoints.
 */

const API_BASE_URL = 'http://localhost:8000';

// Define type for evidence items
export interface EvidenceItem {
  name: string;
  significance: string;
  locations: string[];
}

/**
 * Fetch all crime subtypes
 * @returns {Promise<string[]>} List of crime subtype names
 */
export const fetchCrimeSubtypes = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/crimesubtypes`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to fetch crime subtypes');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching crime subtypes:', error);
    throw error;
  }
};

/**
 * Fetch evidence items for a specific crime subtype and device
 * @param {string} subtype - The crime subtype name
 * @param {string} device - The device type (android or windows)
 * @returns {Promise<EvidenceItem[]>} List of evidence items
 */
export const fetchEvidenceItems = async (
  subtype: string,
  device: 'android' | 'windows'
): Promise<EvidenceItem[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/evidence/${encodeURIComponent(subtype)}?device=${device}`
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to fetch evidence items');
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching evidence for ${subtype} on ${device}:`, error);
    throw error;
  }
};

/**
 * Trigger an embedding refresh job
 * @returns {Promise<{message: string, job_started: boolean, nodes_to_process: number}>}
 */
export const refreshEmbeddings = async (): Promise<{
  message: string;
  job_started: boolean;
  nodes_to_process: number;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/refresh-embeddings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to refresh embeddings');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error refreshing embeddings:', error);
    throw error;
  }
};

/**
 * Interface for question response
 */
export interface QuestionResponse {
  answer: string;
  sources: Array<{
    name: string;
    type: string;
    relevance_score: number;
  }>;
}

/**
 * Ask a question to the semantic search system
 * @param {string} question - The user's question
 * @returns {Promise<QuestionResponse>} The answer with sources
 */
export const askQuestion = async (question: string): Promise<QuestionResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to get answer');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error asking question:', error);
    throw error;
  }
};
