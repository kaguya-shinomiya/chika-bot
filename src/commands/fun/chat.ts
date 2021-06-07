import axios from "axios";
import { PREFIX } from "../../constants";
import { Command } from "../../types/command";
import { RedisPrefix } from "../../types/redis";

const chat: Command = {
  name: "chat",
  argsCount: -2,
  category: "Fun",
  description:
    "Chat with Chika. Be careful though, her IQ drops below 3 at times.",
  redis: RedisPrefix.default,
  usage: `${PREFIX}chat <message>`,
  execute(message, args) {
    const data = JSON.stringify({ text: args.join(" ") });
    const { channel } = message;

    axios
      .post(process.env.HUGGING_FACE_API_URL, data, {
        headers: { Authorization: `Bearer ${process.env.HUGGIN_FACE_API_KEY}` },
      })
      .then((res) => channel.send(res.data.generated_text))
      .catch((err) => console.log(err));
  },
};

export default chat;
