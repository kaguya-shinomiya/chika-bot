import { prisma } from "../../data/prismaClient";
import { DEFAULT_PREFIX } from "../../shared/constants";
import {
  baseEmbed,
  lightErrorEmbed,
  sendNotInGuild,
} from "../../shared/embeds";
import { Command, CommandCategory } from "../../types/command";

const balloonMin: Command = {
  name: "balloon-min",
  argsCount: -1,
  category: CommandCategory.game,
  description:
    "Check or set the lower bound for balloons' volumes in this server.",
  usage: `${DEFAULT_PREFIX}balloon-min [number]`,
  async execute(message, args) {
    const { channel, guild } = message;
    if (!guild) {
      sendNotInGuild(channel);
      return;
    }
    const [_newMin] = args;
    if (!_newMin) {
      const currMin = await prisma.getBalloonMin(guild.id);
      channel.send(
        baseEmbed().setDescription(`Current min volume: **${currMin}**`)
      );
      return;
    }
    const newMin = parseInt(_newMin, 10);
    if (Number.isNaN(newMin)) {
      channel.send(lightErrorEmbed(`Please give me a valid number!`));
      return;
    }
    const currMax = await prisma.getBalloonMax(guild.id);
    if (newMin > currMax) {
      channel.send(
        lightErrorEmbed(
          `The current max is **${currMax}**.
          
          Please set a min below that, or raise the max.`
        )
      );
      return;
    }
    if (newMin <= 0) {
      channel.send(
        lightErrorEmbed("Volume is a *non-negative scalar*  ლ(´ڡ`ლ)")
      );
      return;
    }
    await prisma.setBalloonMin(newMin, guild.id);
    channel.send(
      baseEmbed().setDescription(
        `The minimum balloon volume has been set to **${newMin}**!
        
        This will apply on the next game.`
      )
    );
  },
};

export default balloonMin;
