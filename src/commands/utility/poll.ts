import { red_cross, white_check_mark } from "../../shared/assets";
import { PREFIX } from "../../types/constants";
import { baseEmbed, sendNotInGuild } from "../../shared/embeds";
import { Command } from "../../types/command";

const poll: Command = {
  name: "poll",
  argsCount: -2,
  category: "Utility",
  description: "Begin a democratic process to collect public opinion.",
  usage: `${PREFIX}poll <question>`,
  aliases: ["vote"],
  execute(message, args) {
    const { guild, channel, author } = message;
    if (!guild) {
      sendNotInGuild(channel);
      return;
    }
    const pollQn = args.join(" ");
    channel
      .send(
        baseEmbed()
          .setThumbnail(author.displayAvatarURL())
          .setDescription(`**${author.username}** wants to know...`)
          .addField(pollQn, `Please react to vote!`)
      )
      .then(async (_message) => {
        await _message
          .react(white_check_mark)
          .then(() => _message.react(red_cross));
      });
  },
};

export default poll;
