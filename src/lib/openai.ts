import { HfInference } from '@huggingface/inference';

const HUGGINGFACE_API_KEY = process.env.HF_API_KEY;
const inference = new HfInference(HUGGINGFACE_API_KEY);

// Using Mistral model which is powerful and freely available
const MODEL_ID = 'mistralai/Mistral-7B-Instruct-v0.2';

const generateHuggingFaceResponse = async (prompt: string): Promise<string> => {
  try {
    const response = await inference.textGeneration({
      model: MODEL_ID,
      inputs: prompt,
      parameters: {
        max_new_tokens: 1000,
        temperature: 0.7,
        top_p: 0.95,
        repetition_penalty: 1.15,
        return_full_text: false
      }
    });

    return response.generated_text.trim();
  } catch (error) {
    console.error('Hugging Face API error:', error);
    throw new Error(error instanceof Error ? error.message : 'API request failed');
  }
};

export const generateSummary = async (text: string): Promise<string> => {
  try {
    const prompt = `<s>[INST] You are a helpful AI assistant that creates concise summaries. Please summarize the following text, focusing on key points and main ideas:

${text}

Create a clear, well-structured summary: [/INST]</s>`;

    const summary = await generateHuggingFaceResponse(prompt);
    return summary || "Failed to generate summary";
  } catch (error) {
    console.error('Error generating summary:', error);
    throw new Error('Failed to generate summary. Please check your API key and try again.');
  }
};

export const generateFlashcards = async (text: string): Promise<Array<{ question: string; answer: string }>> => {
  try {
    const prompt = `<s>[INST] Generate 5 question-answer pairs based on the key concepts in this text. Format each pair exactly like this, with one pair per line:

Q: First question here?
A: First answer here.

Q: Second question here?
A: Second answer here.

Text to process:
${text}

Generate exactly 5 Q&A pairs: [/INST]</s>`;

    const response = await generateHuggingFaceResponse(prompt);
    const flashcards: Array<{ question: string; answer: string }> = [];
    
    // Split response into lines and process pairs
    const lines = response.split('\n');
    let currentQuestion = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.startsWith('Q:')) {
        currentQuestion = line.substring(2).trim();
      } else if (line.startsWith('A:') && currentQuestion) {
        const answer = line.substring(2).trim();
        flashcards.push({
          question: currentQuestion,
          answer: answer
        });
        currentQuestion = '';
      }
    }
    
    // If we got no valid flashcards, generate a default set
    if (flashcards.length === 0) {
      return [
        {
          question: "What is the main topic discussed in the text?",
          answer: text.substring(0, 100) + "..."
        },
        {
          question: "What are the key points mentioned?",
          answer: "Please try regenerating the flashcards for a better response."
        }
      ];
    }
    
    return flashcards;
  } catch (error) {
    console.error('Error generating flashcards:', error);
    throw new Error('Failed to generate flashcards. Please check your API key and try again.');
  }
};