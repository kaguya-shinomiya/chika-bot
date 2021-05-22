import { Client } from "discord.js";
import { Collection } from "discord.js";
import fs from "fs";
import path from "path";
import { Game } from "../types/game";

export const loadGames = (): Client["games"] => {
  const gameFiles = fs
    .readdirSync(path.join(__dirname, "..", "games"))
    .filter((filename) => filename.endsWith(".js"));
  let games = new Collection<string, Game>();
  gameFiles.forEach((gameFile) => {
    const game: Game = require(`../games/${gameFile}`).default;
    games.set(game.name, game);
  });
  return games;
};
