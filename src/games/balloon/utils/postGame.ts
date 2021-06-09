import { Collection, User } from "discord.js";
import { Redis } from "ioredis";
import { GenericChannel } from "../../../types/command";
import { sendPopped } from "./embeds";

export const postGameBalloon = async (
  channel: GenericChannel,
  popper: User,
  players: Collection<string, User>,
  ribbonsRedis: Redis
) => {
  const winners = players.filter((user) => user.id !== popper.id);
  const popperStock = parseInt((await ribbonsRedis.get(popper.id)) || "0", 10);

  const winAmt = Math.floor(Math.random() * 20 + 20);
  const isBankrupt = winAmt * winners.size > popperStock;

  sendPopped(channel, { popper, isBankrupt, winAmt });

  const pipeline = ribbonsRedis.pipeline();
  winners.forEach((user) => pipeline.incrby(user.id, winAmt));
  if (isBankrupt) {
    pipeline.set(popper.id, 0);
  } else {
    pipeline.decrby(popper.id, winAmt * winners.size);
  }
  pipeline.exec();
};
