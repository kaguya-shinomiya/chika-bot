import { Collection } from "discord.js";
import fs from "fs";
import path from "path";
import { Game } from "../types/game";

export const loadGames = (): Collection<string, Game> => {
  const gameFiles = fs.readdirSync(path.join(__dirname, "..", "games"));
  let gamesCollection = new Collection<string, Game>();
  gameFiles.forEach((gameFile) => {
    const game: Game = require(`../games/${gameFile}`);
    gamesCollection.set(game.name, game);
  });
  return gamesCollection;
};
