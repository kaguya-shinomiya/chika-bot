import axios from "axios";
import { DEFAULT_PREFIX } from "../../shared/constants";
import {
  chatbotInput,
  chatbotResponse,
  ribbons,
} from "../../data/redisManager";
import { baseEmbed, sendInsufficientRibbons } from "../../shared/embeds";
import { Command } from "../../types/command";
import { ChatbotInput } from "./utils/types";

const chat: Command = {
  name: "chat",
  argsCount: -2,
  category: "Fun",
  description:
    "Chat with Chika. Be careful though, her IQ drops below 3 at times. You'll also need to pay in ribbons to chat with her, for some reason.",
  usage: `${DEFAULT_PREFIX}chat <message>`,
  async execute(message, args) {
    const { channel, author } = message;

    const generated_responses = (
      await chatbotResponse.lrange(author.id, 0, -1)
    ).reverse();
    const past_user_inputs = (
      await chatbotInput.lrange(author.id, 0, -1)
    ).reverse();
    const text = args.join(" ");

    const ribbonCost = text.length;
    const ribbonStock = parseInt((await ribbons.get(author.id)) || "0", 10);
    if (ribbonCost > ribbonStock) {
      sendInsufficientRibbons(channel, ribbonCost, ribbonStock);
      return;
    }

    const input: ChatbotInput = {
      inputs: { text, generated_responses, past_user_inputs },
    };
    const data = JSON.stringify(input);

    axios
      .post(process.env.HUGGING_FACE_API_URL, data, {
        headers: {
          Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
        },
      })
      .then((res) => {
        const reply = res.data.generated_text;
        channel.send(reply);
        chatbotInput
          .lpush(author.id, text)
          .then(() => chatbotInput.ltrim(author.id, 0, 2));

        chatbotResponse
          .lpush(author.id, reply)
          .then(() => chatbotResponse.ltrim(author.id, 0, 2));

        ribbons.decrby(author.id, ribbonCost);
      })
      .catch((err) => {
        if (err.response?.data?.error?.includes(`is currently loading`)) {
          channel.send(
            baseEmbed().setDescription(
              `Thanks chatting with me! Please give me a minute to get ready.`
            )
          );
        }
      });
  },
};

export default chat;
