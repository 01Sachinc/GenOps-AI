import axios from 'axios';

const OLLAMA_API_URL = 'http://localhost:11434/api/generate';

/**
 * Sends a prompt to the local Ollama instance running the llama3 model.
 * @param {string} prompt - The user message/prompt to send.
 * @returns {Promise<string>} The generated text response from the AI.
 */
export const generateAIResponse = async (prompt) => {
  try {
    const response = await axios.post(OLLAMA_API_URL, {
      model: 'llama3',
      prompt: prompt,
      stream: false,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.data && response.data.response) {
      return response.data.response;
    }
    
    return "Received an empty response from the AI model.";
  } catch (error) {
    console.error("AI Generation Error:", error);
    // Return a friendly fallback message if Ollama is unreachable or errored
    throw new Error(
      error.response?.data?.error || 
      "Failed to connect to local AI service. Please ensure Ollama is running on localhost:11434 with the 'llama3' model available."
    );
  }
};
