import { Client } from "discord.js";
import { PREFIX, PREFIX_RE } from "../constants";
import { genBadArgsEmbed } from "../shared/genBadArgsEmbed";
import { genBadCommandEmbed } from "../shared/genBadCommandEmbed";
import { genericErrorEmbed } from "../shared/genericErrorEmbed";
import { Event } from "../types/event";

const message: Event = {
  name: "message",
  once: false,
  // eslint-disable-next-line no-shadow
  listener(client: Client, message) {
    if (!PREFIX_RE.test(message.content) || message.author.bot) return; // absolute guard conditions

    const args = message.content.split(/ +/);
    const sentCommand = args.shift()?.toLowerCase().replace(PREFIX, "");
    if (!sentCommand) return;
    const command = client.commands.find(
      (_command) =>
        _command.name === sentCommand ||
        !!_command.aliases?.includes(sentCommand)
    );
    if (!command) {
      message.channel.send(genBadCommandEmbed(sentCommand));
      return;
    }

    if (command.argsCount >= 0 && args.length !== command.argsCount) {
      message.channel.send(genBadArgsEmbed(command, args.length));
      return;
    }
    if (command.argsCount === -2 && args.length === 0) {
      message.channel.send(genBadArgsEmbed(command, args.length));
    }

    try {
      command.execute(message, args);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
      message.channel.send(genericErrorEmbed);
    }
  },
};

export default message;
