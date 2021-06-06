import type { Client } from "discord.js";
import fs from "fs";
import path from "path";
import { Event } from "../types/event";
import { RedisPrefixed } from "../types/redis";

export const loadEventListeners = (client: Client, redis: RedisPrefixed) => {
  const eventFiles = fs
    .readdirSync(path.join(__dirname, "..", "events"))
    .filter((filename) => filename.endsWith(".js"));
  eventFiles.forEach((file) => {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const event: Event = require(`../events/${file}`).default;
    if (event.once) {
      client.once(event.name, async (...args) =>
        event.listener(client, redis, ...args)
      );
    } else {
      client.on(event.name, async (...args) =>
        event.listener(client, redis, ...args)
      );
    }
  });
};
