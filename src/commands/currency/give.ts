import { ribbons } from "../../data/redisClient";
import { getRibbons } from "../../data/ribbonsManager";
import { ribbon_emoji } from "../../shared/assets";
import { DEFAULT_PREFIX, GLOBAL_RIBBONS } from "../../shared/constants";
import { baseEmbed, lightErrorEmbed } from "../../shared/embeds";
import { Command, CommandCategory } from "../../types/command";
import { groupNum } from "../../utils/typography";

const give: Command = {
  name: "give",
  argsCount: 2,
  description: `Be charitable and give another user some ${ribbon_emoji}.`,
  usage: `${DEFAULT_PREFIX}give <user> <amount>`,
  category: CommandCategory.currency,
  aliases: ["donate"],
  async execute(message, args) {
    const { author, channel, mentions } = message;
    const beneficiary = mentions.users.first();
    if (!beneficiary) {
      channel.send(lightErrorEmbed(`Tag someone to give ${ribbon_emoji} to!`));
      return;
    }
    if (beneficiary.bot) {
      channel.send(
        lightErrorEmbed(
          `**${beneficiary.tag}** is a bot and does not care for ${ribbon_emoji}...`
        )
      );
      return;
    }

    const donation = parseInt(args[args.length - 1], 10);
    if (Number.isNaN(donation)) {
      channel.send(lightErrorEmbed(`Please use a valid number!`));
      return;
    }
    const benefactorStock = await getRibbons(author);
    if (donation > benefactorStock) {
      channel.send(
        lightErrorEmbed(
          `LOL you're too poor to do that!\nYou only have ${benefactorStock} ${ribbon_emoji}.`
        )
      );
      return;
    }

    ribbons
      .pipeline()
      .zincrby(GLOBAL_RIBBONS, donation, beneficiary.tag)
      .zincrby(GLOBAL_RIBBONS, -donation, author.tag)
      .exec();

    channel.send(
      baseEmbed().setDescription(
        `**${beneficiary.username}** has received **${groupNum.format(
          donation
        )}** ${ribbon_emoji} from ${author.username}!`
      )
    );
  },
};

export default give;
