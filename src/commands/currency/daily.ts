import { prisma } from "../../data/prismaClient";
import { ribbon_emoji } from "../../shared/assets";
import { baseEmbed, lightErrorEmbed } from "../../shared/embeds";
import { Command, CommandCategory, PartialCommand } from "../../types/command";
import { getCooldown, setCooldown } from "../../utils/cooldownManager";
import { genUsage } from "../../utils/genUsage";
import { endOfToday, secToWordString } from "../../utils/time";

const daily: PartialCommand = {
  name: "daily",
  category: CommandCategory.CURRENCY,
  args: [],
  description: "Collect your daily dose of ribbons.",

  async execute(message) {
    const { author, channel } = message;

    const cooldownDuration = await getCooldown(author.id, this.name);

    if (cooldownDuration) {
      channel.send(
        lightErrorEmbed(
          `You've already collected today's ribbons!
          
          Please wait ${secToWordString(
            cooldownDuration
          )} before collecting again.`
        )
      );
      return;
    }

    const toAward = Math.floor(Math.random() * 200 + 100);
    channel.send(
      baseEmbed().setDescription(
        `**+ ${toAward}** ribbons ${ribbon_emoji} for **${author.username}**!`
      )
    );

    const nowStamp = Date.now();
    const cooldown = endOfToday() - nowStamp;

    setCooldown(author.id, this.name, cooldown);
    prisma.incrRibbons(author, toAward);
  },
};

genUsage(daily);
export default daily as Command;
