interface ChatbotInput {
  inputs: {
    past_user_inputs?: string[];
    generated_responses?: string[];
    text: string;
  };
}

type ChatbotChar = 'ck' | 'ka';

export type { ChatbotInput, ChatbotChar };
