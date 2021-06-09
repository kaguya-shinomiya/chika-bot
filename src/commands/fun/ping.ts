import { PREFIX } from "../../constants";
import { baseEmbed } from "../../shared/embeds";
import { Command } from "../../types/command";

const ping: Command = {
  name: "ping",
  description: "Say hello to Chika bot.",
  category: "Fun",
  usage: `${PREFIX}hello`,
  argsCount: 0,
  async execute(message) {
    const {
      channel,
      author,
      client: {
        redisManager: { default: redis },
      },
    } = message;
    channel.send(
      baseEmbed().setDescription(
        `Yo ${author.username}, Love Detective Chika here!`
      )
    );
    // eslint-disable-next-line no-console
    redis.get("ping").then((res) => console.log("Checking Redis...", res));
  },
};

export default ping;
