import axios from "axios";
import { PREFIX } from "../../constants";
import { baseEmbed } from "../../shared/embeds";
import { Command } from "../../types/command";
import { ChatbotInput } from "./utils/types";

const MAX_HISTORY = 3;

const chat: Command = {
  name: "chat",
  argsCount: -2,
  category: "Fun",
  description:
    "Chat with Chika. Be careful though, her IQ drops below 3 at times.",
  usage: `${PREFIX}chat <message>`,
  async execute(
    message,
    args,
    { chatbotInputRedis: inputRedis, chatbotResponseRedis: responseRedis }
  ) {
    const { channel, author } = message;

    // TODO get past response n inputs
    const generated_responses = (
      await responseRedis.lrange(author.id, 0, -1)
    ).reverse();
    const past_user_inputs = (
      await inputRedis.lrange(author.id, 0, -1)
    ).reverse();
    const text = args.join(" ");
    const input: ChatbotInput = {
      inputs: { text, generated_responses, past_user_inputs },
    };
    const data = JSON.stringify(input);

    axios
      .post(process.env.HUGGING_FACE_API_URL, data, {
        headers: { Authorization: `Bearer ${process.env.HUGGIN_FACE_API_KEY}` },
      })
      .then((res) => {
        const reply = res.data.generated_text;
        channel.send(reply);
        // TODO store msg and response in redis
        inputRedis
          .ltrim(author.id, 0, MAX_HISTORY - 1)
          .then(() => inputRedis.lpush(author.id, text));
        responseRedis
          .ltrim(author.id, 0, MAX_HISTORY - 1)
          .then(() => responseRedis.lpush(author.id, reply));
      })
      .catch((err) => {
        if (err.response?.data?.error?.includes(`is currently loading`)) {
          channel.send(
            baseEmbed().setDescription(
              `Thanks for wanting to chat with me! Please give me about ${Math.round(
                err.response.data.estimated_time
              )} seconds to get ready.`
            )
          );
        }
      });
  },
};

export default chat;
