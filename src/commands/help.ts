import { Command } from "@customTypes/command";
import { PREFIX } from "../constants";

const help: Command = {
  name: "help",
  description: "Get info about commands, or a specific command.",
  aliases: ["h", "commands"],
  execute({ channel, client: { commands } }, args) {
    const data: string[] = [];
    if (!args.length) {
      // send a list of commands
      commands
        .sort()
        .array()
        .forEach((command) => {
          data.push(`**${PREFIX}${command.name}**`);
          data.push(command.description);
        });
      channel.send(data, { split: true });
    } else {
      args.forEach((arg) => {
        const match = commands.find(
          (command) => command.name === arg || !!command.aliases?.includes(arg)
        );
        if (match) {
          data.push(`**${PREFIX}${match.name}**`);
          data.push(match.description);
        }
      });
      channel.send(data, { split: true });
    }
  },
};

export default help;
