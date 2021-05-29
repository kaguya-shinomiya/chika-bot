import Discord, { Collection } from "discord.js";
import dotenv from "dotenv-safe";
import Redis from "ioredis";
import { RedisPrefixed } from "./types/client";
import { loadCommands } from "./utils/loadCommands";
import { loadEventListeners } from "./utils/loadEventListeners";
import { loadGames } from "./utils/loadGames";
import { prepareCommandsHelp } from "./utils/prepareCommandsHelp";

dotenv.config();

// TODO need to register only 1 listener per command type?
// TODO look into Redis for session-related things, or we can store everything on the client

const main = async () => {
  const client = new Discord.Client();
  client.login(process.env.APP_TOKEN);
  client.commands = loadCommands();
  [client.games, client.gamesList] = loadGames();
  client.gameStates = new Collection(); // initialize an empty gameState instance
  client.commandsHelp = prepareCommandsHelp(client.commands); // generates full help message
  client.audioQueues = new Collection();

  const port = parseInt(process.env.REDIS_PORT, 10);
  const host = process.env.REDIS_HOST;
  const defaultRedis = new Redis({
    port,
    host,
  });
  const tracksRedis = new Redis({
    keyPrefix: "tracks",
    port,
    host,
  });
  const gamesRedis = new Redis({
    keyPrefix: "game",
    port,
    host,
  });

  const redis: RedisPrefixed = { defaultRedis, tracksRedis, gamesRedis };
  loadEventListeners(client, redis);
};

// eslint-disable-next-line no-console
main().catch((err) => console.log(err));
