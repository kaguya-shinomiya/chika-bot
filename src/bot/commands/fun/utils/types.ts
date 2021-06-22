interface ChatbotInput {
  inputs: {
    past_user_inputs?: string[];
    generated_responses?: string[];
    text: string;
  };
}

export type { ChatbotInput };
