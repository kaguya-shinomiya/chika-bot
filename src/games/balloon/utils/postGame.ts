import { Collection, Message, User } from 'discord.js';
import _ from 'lodash';
import { userProvider } from '../../../data/database/userProvider';
import { prisma } from '../../../data/prismaClient';
import { forRibbons, redis } from '../../../data/redisClient';
import { sendPopped } from './embeds';

export const postGameBalloon = async (
  message: Message,
  players: Collection<string, User>,
) => {
  const { channel, author: popper } = message;

  const winners = players.filter((user) => user.id !== popper.id);
  const popperStock = await userProvider.getRibbons(popper);
  const winAmt = Math.floor(Math.random() * 20 + 20);
  const isBankrupt = winAmt * winners.size > popperStock;

  sendPopped(channel, { popper, isBankrupt, winAmt });

  await prisma
    .$transaction(
      winners.map((winner) =>
        prisma.user.upsert({
          where: { userId: winner.id },
          update: { ribbons: { increment: winAmt } },
          create: { userId: winner.id, tag: winner.tag, ribbons: winAmt },
          select: { userId: true, ribbons: true },
        }),
      ),
    )
    .then((res) =>
      redis.mset(
        ..._.flattenDeep(
          res.map((_res) => [forRibbons(_res.userId), _res.ribbons]),
        ),
      ),
    );

  userProvider.decrRibbons(popper, winAmt * winners.size);
};
