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
  client.commandsHelp = prepareCommandsHelp(client.commands); // generates full help message
  client.cache = { audioUtils: new Collection() };

  client.setMaxListeners(2048);

  const defaultRedis = new Redis(process.env.REDISCLOUD_URL);
  const tracksRedis = new Redis(process.env.REDISCLOUD_URL, {
    keyPrefix: "tracks:",
  });
  const gamesRedis = new Redis(process.env.REDISCLOUD_URL, {
    keyPrefix: "game:",
  });
  const cooldownRedis = new Redis(process.env.REDISCLOUD_URL, {
    keyPrefix: "cooldown:",
  });

  client.cooldownManager = {
    setCooldown(id, command, time) {
      return cooldownRedis.set(`${id}${command}`, command, "ex", time);
    },
    async getCooldown(id, command) {
      const ttl = await cooldownRedis.ttl(`${id}${command}`);
      if (ttl <= 0) {
        return 0;
      }
      return ttl;
    },
  };

  const redis: RedisPrefixed = { defaultRedis, tracksRedis, gamesRedis };
  loadEventListeners(client, redis);
};

// eslint-disable-next-line no-console
main().catch((err) => console.log(err));
