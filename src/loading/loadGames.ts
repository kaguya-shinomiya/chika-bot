import { Client, Collection } from "discord.js";
import fs from "fs";
import path from "path";
import { Game } from "../types/game";

export const loadGames = (): [Client["games"], string[]] => {
  const gameFiles = fs
    .readdirSync(path.join(__dirname, "..", "games"))
    .filter((filename) => !/utils/.test(filename));
  const games = new Collection<string, Game>();
  const gameTitles: string[] = [];
  gameFiles.forEach((gameFile) => {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const game: Game = require(`../games/${gameFile}`).default;
    games.set(game.title, game);
    gameTitles.push(game.displayTitle);
  });
  return [games, gameTitles];
};
