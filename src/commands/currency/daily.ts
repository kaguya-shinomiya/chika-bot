import { prisma } from "../../data/prismaClient";
import { ribbon_emoji } from "../../shared/assets";
import { DEFAULT_PREFIX } from "../../shared/constants";
import { baseEmbed, lightErrorEmbed } from "../../shared/embeds";
import { Command, CommandCategory } from "../../types/command";
import { getCooldown, setCooldown } from "../../utils/cooldownManager";
import { endOfToday, secToWordString } from "../../utils/time";

const daily: Command = {
  name: "daily",
  category: CommandCategory.currency,
  argsCount: 0,
  description: "Collect your daily dose of ribbons.",
  usage: `${DEFAULT_PREFIX}daily`,
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

export default daily;
