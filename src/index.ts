import Discord, { Collection } from "discord.js";
import dotenv from "dotenv-safe";
import Redis from "ioredis";
import { RedisPrefixed } from "./types/redis";
import { loadCommands } from "./utils/loadCommands";
import { loadEventListeners } from "./utils/loadEventListeners";
import { loadGames } from "./utils/loadGames";
import { prepareCommandsHelp } from "./utils/prepareCommandsHelp";

dotenv.config();

// TODO need to register only 1 listener per command type?

const main = async () => {
  const client = new Discord.Client();
  client.login(process.env.APP_TOKEN);
  client.commands = loadCommands();
  [client.games, client.gamesList] = loadGames();
  // client.gameStates = new Collection(); // initialize an empty gameState instance
  client.commandsHelp = prepareCommandsHelp(client.commands); // generates full help message
  client.cache = { audioUtils: new Collection() };
  // client.audioQueues = new Collection();

  const defaultRedis = new Redis(process.env.REDISCLOUD_URL);
  const tracksRedis = new Redis(process.env.REDISCLOUD_URL, {
    keyPrefix: "tracks:",
  });
  const gamesRedis = new Redis(process.env.REDISCLOUD_URL, {
    keyPrefix: "game:",
  });

  const redis: RedisPrefixed = { defaultRedis, tracksRedis, gamesRedis };
  loadEventListeners(client, redis);
};

// eslint-disable-next-line no-console
main().catch((err) => console.log(err));
