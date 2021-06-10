import { getRibbons } from "../../data/ribbonsManager";
import { ribbon_emoji } from "../../shared/assets";
import { DEFAULT_PREFIX } from "../../shared/constants";
import { baseEmbed } from "../../shared/embeds";
import { Command, CommandCategory } from "../../types/command";

export const ribbon: Command = {
  name: "ribbon",
  description: "Check how many ribbons you or another user has.",
  argsCount: -1,
  category: CommandCategory.currency,
  aliases: ["r"],
  usage: `${DEFAULT_PREFIX}ribbon [user]`,
  async execute(message) {
    const { mentions, author, channel } = message;
    const user = mentions.users.first() || author;

    const stock = await getRibbons(user);
    channel.send(
      baseEmbed().setDescription(
        `**${user.tag}** has **${stock}** ${ribbon_emoji}`
      )
    );
  },
};

export default ribbon;
