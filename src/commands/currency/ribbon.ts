import { prisma } from "../../data/prismaClient";
import { ribbon_emoji } from "../../shared/assets";
import { baseEmbed } from "../../shared/embeds";
import { Command, CommandCategory, PartialCommand } from "../../types/command";
import { genUsage } from "../../utils/genUsage";

export const ribbon: PartialCommand = {
  name: "ribbon",
  description: "Check how many ribbons you or another user has.",
  args: [{ name: "user", optional: true }],
  category: CommandCategory.currency,
  aliases: ["r"],
  async execute(message) {
    const { mentions, author, channel } = message;
    const user = mentions.users.first() || author;

    const stock = await prisma.getRibbons(user);
    channel.send(
      baseEmbed().setDescription(
        `**${user.tag}** has **${stock}** ${ribbon_emoji}`
      )
    );
  },
};

genUsage(ribbon);
export default ribbon as Command;
