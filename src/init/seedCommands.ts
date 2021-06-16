import { CmdCategory, PrismaPromise } from "@prisma/client";
import type { Collection } from "discord.js";
import { GraphQLClient } from "graphql-request";
import { prisma } from "../data/prismaClient";
import {
  CommandCategory,
  CreateCommandInput,
  getSdk,
} from "../generated/chika";
import type { Command } from "../types/command";

export const seedCommands = async (commands: Collection<string, Command>) => {
  const chikav2Client = new GraphQLClient(process.env.CHIKA_DB_SCHEMA, {
    headers: {
      authorization: `Bearer ${process.env.SUPERUSER_KEY}`,
    },
  });

  const commandInputs: CreateCommandInput[] = commands.map(
    ({ name, category, description, aliases, args }): CreateCommandInput => ({
      name,
      category: normalizeCategory(category),
      description,
      aliases,
      args: args.map(({ name: _name, multi, optional }) => ({
        name: _name,
        multi,
        optional,
      })),
    })
  );

  const sdk = getSdk(chikav2Client);

  sdk.seedCommands({ commands: commandInputs });

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

function normalizeCategory(category: CmdCategory): CommandCategory {
  switch (category) {
    case "CURRENCY":
      return CommandCategory.Currency;
    case "FUN":
      return CommandCategory.Fun;
    case "GAMES":
      return CommandCategory.Games;
    case "MUSIC":
      return CommandCategory.Music;
    case "UTILITY":
      return CommandCategory.Utility;
    default:
      return CommandCategory.Fun;
  }
}
