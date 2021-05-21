// TODO make this an embedded message
// TODO split commands into categories

import { genBadCommandEmbed } from "../../utils/genBadCommandEmbed";
import { Command } from "../../types/command";
import { MessageEmbed } from "discord.js";
import { chika_pink } from "../../constants";

const help: Command = {
  name: "help",
  description: "Get a list of all commands, or look up specific commands.",
  usage: "help [command ...]",
  category: "Utility",
  aliases: ["h"],
  execute({ channel, client: { commands, commandsHelp } }, args) {
    if (!args.length || /all/i.test(args[0])) {
      // send a list of all commands
      channel.send(commandsHelp);
      return;
    }

    // return info for a specific command
    let unknownCommands: string[] = [];
    args.forEach((arg) => {
      const match = commands.find(
        (command) => command.name === arg || !!command.aliases?.includes(arg)
      );
      if (match) {
        let embed = new MessageEmbed()
          .setColor(chika_pink)
          .addField(match.usage, match.description);
        if (match.aliases) {
          const preTag = match.aliases.map((alias) => `\`${alias}\``);
          embed.addField("Aliases", preTag.join(", "));
        }
        channel.send(embed);
        return;
      }
      unknownCommands.push(arg);
    });
    if (unknownCommands.length) {
      channel.send(genBadCommandEmbed(...unknownCommands));
    }
  },
};

export default help;
