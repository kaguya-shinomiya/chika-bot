import type { PrismaPromise } from "@prisma/client";
import type { Collection } from "discord.js";
import { prisma } from "../data/prismaClient";
import type { Command } from "../types/command";

export const seedCommands = async (commands: Collection<string, Command>) => {
  const jobs: PrismaPromise<any>[] = [
    prisma.command.deleteMany(),
    prisma.arg.deleteMany(),
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
      })
    )
  );
  try {
    await prisma.$transaction(jobs);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
};
