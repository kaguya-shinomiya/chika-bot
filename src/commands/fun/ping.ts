import { baseEmbed } from "../../shared/embeds";
import { Command, CommandCategory, PartialCommand } from "../../types/command";
import { genUsage } from "../../utils/genUsage";

const ping: PartialCommand = {
  name: "ping",
  description: "Say hello to Chika bot.",
  category: CommandCategory.fun,
  args: [],

  async execute(message) {
    const { channel, author } = message;
    // TODO actually report latency
    channel.send(
      baseEmbed().setDescription(
        `Yo ${author.username}, Love Detective Chika here!`
      )
    );
  },
};

genUsage(ping);
export default ping as Command;
