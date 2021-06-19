import { Collection, Message, User } from 'discord.js';
import _ from 'lodash';
import { prisma } from '../../../data/prismaClient';
import { redisRibbons } from '../../../data/redisClient';
import { sendPopped } from './embeds';

export const postGameBalloon = async (
  message: Message,
  players: Collection<string, User>,
) => {
  const { channel, author: popper } = message;

  const winners = players.filter((user) => user.id !== popper.id);
  const popperStock = await prisma.getRibbons(popper);
  const winAmt = Math.floor(Math.random() * 20 + 20);
  const isBankrupt = winAmt * winners.size > popperStock;

  sendPopped(channel, { popper, isBankrupt, winAmt });

  await prisma
    .$transaction(
      winners.map((winner) =>
        prisma.user.upsert({
          update: { ribbons: { increment: winAmt } },
          where: { userId: winner.id },
          create: { userId: winner.id, tag: winner.tag, ribbons: winAmt },
          select: { userId: true, ribbons: true },
        }),
      ),
    )
    .then((res) =>
      redisRibbons.mset(..._.flattenDeep(res.map((_res) => _.values(_res)))),
    );

  prisma.decrRibbons(popper, winAmt * winners.size);
};
