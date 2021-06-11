import { Collection, Message, User } from "discord.js";
import { prisma } from "../../../data/prismaClient";
import { ribbons } from "../../../data/redisClient";
import { GLOBAL_RIBBONS } from "../../../shared/constants";
import { sendPopped } from "./embeds";

export const postGameBalloon = async (
  message: Message,
  players: Collection<string, User>
) => {
  const { channel, author: popper } = message;

  const winners = players.filter((user) => user.id !== popper.id);
  const popperStock = await prisma.getRibbons(popper);

  const winAmt = Math.floor(Math.random() * 20 + 20);
  const isBankrupt = winAmt * winners.size > popperStock;

  sendPopped(channel, { popper, isBankrupt, winAmt });

  const pipeline = ribbons.pipeline();
  winners.forEach((user) => pipeline.zincrby(GLOBAL_RIBBONS, winAmt, user.tag));
  if (isBankrupt) {
    pipeline.zrem(GLOBAL_RIBBONS, popper.tag);
  } else {
    pipeline.zincrby(GLOBAL_RIBBONS, -(winAmt * winners.size), popper.tag);
  }
  pipeline.exec();
};
