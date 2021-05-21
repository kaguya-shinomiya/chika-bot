// TODO make this an embedded message
// TODO split commands into categories

import { Command } from "@/types/command";
import { MessageEmbed } from "discord.js";
import { chika_pink } from "../../constants";

const help: Command = {
  name: "help",
  description: "Get info about commands, or a specific command.",
  usage: "help [commands ...]",
  category: "Utility",
  aliases: ["h"],
  execute({ channel, client: { commands, commandsHelp } }, args) {
    if (!args.length || /all/i.test(args[0])) {
      // send a list of all commands
      channel.send(commandsHelp);
      return;
    }

    // return info for a specific command
    args.forEach((arg) => {
      const match = commands.find(
        (command) => command.name === arg || !!command.aliases?.includes(arg)
      );
      if (match) {
        const embed = new MessageEmbed()
          .setColor(chika_pink)
          .addField(match.usage, match.description);
        channel.send(embed);
        return;
      }
      channel.send(`I don't know that command! lol`);
    });
  },
};

export default help;
