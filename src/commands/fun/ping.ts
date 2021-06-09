import { DEFAULT_PREFIX } from "../../shared/constants";
import { redis } from "../../data/redisManager";
import { baseEmbed } from "../../shared/embeds";
import { Command } from "../../types/command";

const ping: Command = {
  name: "ping",
  description: "Say hello to Chika bot.",
  category: "Fun",
  usage: `${DEFAULT_PREFIX}hello`,
  argsCount: 0,
  async execute(message) {
    const { channel, author } = message;
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
