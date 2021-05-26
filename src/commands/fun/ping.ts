import { PREFIX } from "../../constants";
import { baseEmbed } from "../../shared/embeds";
import { Command } from "../../types/command";

const ping: Command = {
  name: "ping",
  description: "Say hello to Chika bot.",
  category: "Fun",
  usage: `${PREFIX}hello`,
  argsCount: 0,
  async execute({ channel, author }) {
    channel.send(
      baseEmbed().setDescription(
        `Yo ${author.username}, Love Detective Chika here!`
      )
    );
  },
};

export default ping;
