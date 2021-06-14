import { CmdCategory } from "@prisma/client";
import { redis } from "../../data/redisClient";
import { baseEmbed } from "../../shared/embeds";
import { Command } from "../../types/command";

const ping = new Command({
  name: "ping",
  description: "Say hello to Chika bot.",
  category: CmdCategory.FUN,
  args: [],

  async execute(message) {
    const { channel, author } = message;
    // TODO actually use the redis ping
    channel.send(
      baseEmbed().setDescription(
        `Yo ${author.username}, Love Detective Chika here!`
      )
    );
    redis.ping();
  },
});

export default ping;
