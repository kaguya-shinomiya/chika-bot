import { Command } from "../../types/command";

const ping: Command = {
  name: "ping",
  description: "Pings Chika bot.",
  category: "Fun",
  usage: "ck!ping",
  argsCount: 0,
  execute({ channel, author }, _args) {
    channel.send(`Yo ${author.toString()}, Love Detective Chika here!`);
  },
};

export default ping;
