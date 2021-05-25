import { PREFIX } from "../../constants";
import { Command } from "../../types/command";

const ping: Command = {
  name: "ping",
  description: "Say hello to Chika bot.",
  category: "Fun",
  usage: `${PREFIX}hello`,
  argsCount: 0,
  execute({ channel, author }) {
    channel.send(`Yo ${author.toString()}, Love Detective Chika here!`);
  },
};

export default ping;
