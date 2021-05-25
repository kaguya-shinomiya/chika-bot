import { MessageEmbed } from "discord.js";
import { genBadCommandEmbed } from "../../shared/genBadCommandEmbed";
import { Command } from "../../types/command";
import { chika_pink, PREFIX } from "../../constants";

const help: Command = {
  name: "help",
  description: "Get a list of all commands, or look up specific commands.",
  usage: `${PREFIX}help [command ...]`,
  category: "Utility",
  argsCount: -1,
  aliases: ["h"],
  execute({ channel, client: { commands, commandsHelp } }, args) {
    if (!args.length || /all/i.test(args[0])) {
      // send a list of all commands
      channel.send(commandsHelp);
      return;
    }

    // return info for a specific command
    const unknownCommands: string[] = [];
    args.forEach((arg) => {
      const match = commands.find(
        (command) => command.name === arg || !!command.aliases?.includes(arg)
      );
      if (match) {
        const embed = new MessageEmbed()
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
