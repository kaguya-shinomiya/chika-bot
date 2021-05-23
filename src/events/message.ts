import { Client } from "discord.js";
import { PREFIX, PREFIX_RE } from "../constants";
import { genBadArgsEmbed } from "../shared/genBadArgsEmbed";
import { genBadCommandEmbed } from "../shared/genBadCommandEmbed";
import { genericErrorEmbed } from "../shared/genericErrorEmbed";
import { Event } from "../types/event";

const message: Event = {
  name: "message",
  once: false,
  listener(client: Client, message) {
    if (!PREFIX_RE.test(message.content) || message.author.bot) return; // absolute guard conditions

    const args = message.content.split(/ +/);
    const sentCommand = args.shift()?.toLowerCase().replace(PREFIX, "");
    if (!sentCommand) return;
    const command = client.commands.find(
      (command) =>
        command.name === sentCommand || !!command.aliases?.includes(sentCommand)
    );
    if (!command) {
      message.channel.send(genBadCommandEmbed(sentCommand));
      return;
    }

    if (command.argsCount !== -1 && command.argsCount !== args.length) {
      message.channel.send(genBadArgsEmbed(command, args.length));
      return;
    }

    try {
      command.execute(message, args);
    } catch (err) {
      console.log(err);
      message.channel.send(genericErrorEmbed);
      return;
    }
  },
};

export default message;
