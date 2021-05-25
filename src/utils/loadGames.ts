import { Client, Collection } from "discord.js";
import fs from "fs";
import path from "path";
import { Game } from "../types/game";

export const loadGames = (): Client["games"] => {
  const gameFiles = fs
    .readdirSync(path.join(__dirname, "..", "games"))
    .filter((filename) => filename.endsWith(".js"));
  const games = new Collection<string, Game>();
  gameFiles.forEach((gameFile) => {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const game: Game = require(`../games/${gameFile}`).default;
    games.set(game.name, game);
  });
  return games;
};
