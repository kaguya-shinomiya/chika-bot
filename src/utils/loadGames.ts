import { Client, Collection } from "discord.js";
import fs from "fs";
import path from "path";
import { GenericGame } from "../types/client";

export const loadGames = (): Client["games"] => {
  const gameFiles = fs
    .readdirSync(path.join(__dirname, "..", "games"))
    .filter((filename) => !/utils/.test(filename));
  const games = new Collection<string, GenericGame>();
  gameFiles.forEach((gameFile) => {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const game: GenericGame = require(`../games/${gameFile}`).default;
    games.set(game.name, game);
  });
  return games;
};
