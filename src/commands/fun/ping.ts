import { PREFIX } from "../../constants";
import { baseEmbed } from "../../shared/embeds";
import { Command } from "../../types/command";
import { RedisPrefix } from "../../types/redis";

const ping: Command = {
  name: "ping",
  description: "Say hello to Chika bot.",
  category: "Fun",
  usage: `${PREFIX}hello`,
  argsCount: 0,
  redis: RedisPrefix.default,
  async execute({ channel, author }, _, redis) {
    channel.send(
      baseEmbed().setDescription(
        `Yo ${author.username}, Love Detective Chika here!`
      )
    );
    // eslint-disable-next-line no-console
    redis?.get("ping").then((res) => console.log("Checking Redis...", res));
  },
};

export default ping;
