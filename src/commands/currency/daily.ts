import { ribbon_emoji } from "../../assets";
import { PREFIX } from "../../constants";
import { baseEmbed, lightErrorEmbed } from "../../shared/embeds";
import { Command } from "../../types/command";
import { endOfToday, secToWordString } from "../../utils/time";

const daily: Command = {
  name: "daily",
  category: "Currency",
  argsCount: 0,
  description: "Collect your daily dose of ribbons.",
  usage: `${PREFIX}daily`,
  async execute(message, _, { ribbonsRedis: redis }) {
    const { author, channel, client } = message;

    const cooldownDuration = await client.cooldownManager.getCooldown(
      author.id,
      this.name
    );

    if (cooldownDuration) {
      channel.send(
        lightErrorEmbed(
          `You've already collected today's ribbons! Please wait ${secToWordString(
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

    client.cooldownManager.setCooldown(author.id, this.name, cooldown);

    redis.incrby(author.id, toAward);
  },
};

export default daily;
