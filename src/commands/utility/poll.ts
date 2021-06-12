import { red_cross, white_check_mark } from "../../shared/assets";
import { baseEmbed, sendNotInGuild } from "../../shared/embeds";
import { Command, CommandCategory } from "../../types/command";

const poll = new Command({
  name: "poll",
  args: [{ name: "question", multi: true }],
  category: CommandCategory.UTILITY,
  description: "Show your enthusiasm for democracy.",
  aliases: ["vote"],
  async execute(message, args) {
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
});

export default poll;
