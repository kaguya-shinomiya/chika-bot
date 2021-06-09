import { Collection, Message, User } from "discord.js";
import { ribbons } from "../../../data/redisManager";
import { sendPopped } from "./embeds";

export const postGameBalloon = async (
  message: Message,
  players: Collection<string, User>
) => {
  const { channel, author: popper } = message;

  const winners = players.filter((user) => user.id !== popper.id);
  const popperStock = parseInt((await ribbons.get(popper.id)) || "0", 10);

  const winAmt = Math.floor(Math.random() * 20 + 20);
  const isBankrupt = winAmt * winners.size > popperStock;

  sendPopped(channel, { popper, isBankrupt, winAmt });

  const pipeline = ribbons.pipeline();
  winners.forEach((user) => pipeline.incrby(user.id, winAmt));
  if (isBankrupt) {
    pipeline.set(popper.id, 0);
  } else {
    pipeline.decrby(popper.id, winAmt * winners.size);
  }
  pipeline.exec();
};
