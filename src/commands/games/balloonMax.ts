import { prisma } from "../../data/prismaClient";
import { DEFAULT_PREFIX } from "../../shared/constants";
import {
  baseEmbed,
  lightErrorEmbed,
  sendNotInGuild,
} from "../../shared/embeds";
import { Command, CommandCategory } from "../../types/command";

const balloonMax: Command = {
  name: "balloon-max",
  argsCount: -1,
  category: CommandCategory.game,
  description:
    "Check or set the upper bound for balloons' volumes in this server.",
  usage: `${DEFAULT_PREFIX}balloon-max [number]`,
  async execute(message, args) {
    const { channel, guild } = message;
    if (!guild) {
      sendNotInGuild(channel);
      return;
    }
    const [_newMax] = args;
    if (!_newMax) {
      const currMax = await prisma.getBalloonMax(guild.id);
      channel.send(
        baseEmbed().setDescription(`Current max volume: **${currMax}**`)
      );
      return;
    }
    const newMax = parseInt(_newMax, 10);
    if (Number.isNaN(newMax)) {
      channel.send(lightErrorEmbed(`Please give me a valid number!`));
      return;
    }
    const currMin = await prisma.getBalloonMin(guild.id);
    if (newMax < currMin) {
      channel.send(
        lightErrorEmbed(
          `The current min is **${currMin}**.
          
          Please set a max below that, or lower the min.`
        )
      );
      return;
    }
    if (newMax <= 0) {
      channel.send(
        lightErrorEmbed("Volume is a *non-negative scalar*  ლ(´ڡ`ლ)")
      );
      return;
    }
    await prisma.setBalloonMax(newMax, guild.id);
    channel.send(
      baseEmbed().setDescription(
        `The maximum balloon volume has been set to **${newMax}**!
        
        This will apply on the next game.`
      )
    );
  },
};

export default balloonMax;
