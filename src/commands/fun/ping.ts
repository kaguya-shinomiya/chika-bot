import { Command } from "../../types/command";

const ping: Command = {
  name: "ping",
  description: "Say hello to Chika bot.",
  category: "Fun",
  usage: "ck!hello",
  argsCount: 0,
  execute({ channel, author }, _args) {
    channel.send(`Yo ${author.toString()}, Love Detective Chika here!`);
  },
};

export default ping;
