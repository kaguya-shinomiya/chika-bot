import { Command } from "../types/command";

const ping: Command = {
  name: "ping",
  description: "Pings Chika bot.",
  execute({ channel, author }, _args) {
    channel.send(`Yo ${author.toString()}, Love Detective Chika here!`);
  },
};

export default ping;
