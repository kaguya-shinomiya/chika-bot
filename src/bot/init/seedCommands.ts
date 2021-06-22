import { PrismaPromise } from '@prisma/client';
import type { Collection } from 'discord.js';
import { prisma } from '../data/prismaClient';
import type { Command } from '../types/command';

export const seedCommands = async (commands: Collection<string, Command>) => {
  const jobs: PrismaPromise<any>[] = [
    prisma.$executeRaw(`TRUNCATE TABLE "Command", "Arg" RESTART IDENTITY`),
  ];
  commands.forEach(({ name, args, aliases, description, category }) =>
    jobs.push(
      prisma.command.create({
        data: {
          name,
          description,
          category,
          aliases,
          args: {
            createMany: {
              data: args.map(({ name: argName, optional, multi }) => ({
                name: argName,
                optional: !!optional,
                multi: !!multi,
              })),
              skipDuplicates: true,
            },
          },
        },
      }),
    ),
  );
  try {
    await prisma.$transaction(jobs);
  } catch (err) {
    console.error(err);
  }
};
