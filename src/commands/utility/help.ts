import { badCommandsEmbed, baseEmbed } from "../../shared/embeds";
import { Command, CommandCategory, PartialCommand } from "../../types/command";
import { genUsage } from "../../utils/genUsage";

const help: PartialCommand = {
  name: "help",
  description: "Get a list of all commands, or look up specific commands.",
  args: [{ name: "command", optional: true, multi: true }],
  category: CommandCategory.utility,
  aliases: ["h"],

  async execute({ channel, client: { commands, commandsHelp } }, args) {
    if (!args.length || /^all$/i.test(args[0])) {
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
        const embed = baseEmbed()
          .addField(match.name, match.description)
          .addField("Usage", `\`${match.usage}\``, true);
        if (match.aliases) {
          const preTag = match.aliases.map((alias) => `\`${alias}\``);
          embed.addField("Aliases", preTag.join(", "), true);
        }
        channel.send(embed);
        return;
      }
      unknownCommands.push(arg);
    });
    if (unknownCommands.length) {
      channel.send(badCommandsEmbed(...unknownCommands));
    }
  },
};

genUsage(help);
export default help as Command;
