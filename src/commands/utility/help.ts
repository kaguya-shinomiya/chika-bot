import { PREFIX } from "../../constants";
import { badCommandsEmbed, baseEmbed } from "../../shared/embeds";
import { Command } from "../../types/command";
import { RedisPrefix } from "../../types/redis";

const help: Command = {
  name: "help",
  description: "Get a list of all commands, or look up specific commands.",
  usage: `${PREFIX}help [command ...]`,
  category: "Utility",
  argsCount: -1,
  aliases: ["h"],
  redis: RedisPrefix.default,
  async execute({ channel, client: { commands, commandsHelp } }, args) {
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
        const embed = baseEmbed().addField(match.usage, match.description);
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
      channel.send(badCommandsEmbed(...unknownCommands));
    }
  },
};

export default help;
