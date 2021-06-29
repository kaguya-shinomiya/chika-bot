interface ChatbotInput {
  inputs: {
    past_user_inputs?: string[];
    generated_responses?: string[];
    text: string;
  };
}

type ChatbotChar = 'ck' | 'ka';

interface IBlogPost {
  author: string; // Discord tag
  time: number; // unix timestamp
  message: string;
}

export type { ChatbotInput, ChatbotChar, IBlogPost };
