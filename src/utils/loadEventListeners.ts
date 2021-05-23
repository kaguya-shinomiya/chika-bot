import { Client } from "discord.js";
import fs from "fs";
import path from "path";
import { Event } from "../types/event";

export const loadEventListeners = (client: Client) => {
  const eventFiles = fs
    .readdirSync(path.join(__dirname, "..", "events"))
    .filter((filename) => filename.endsWith(".js"));
  eventFiles.forEach((file) => {
    const event: Event = require(`../events/${file}`).default;
    if (event.once) {
      client.once(event.name, async (...args) =>
        event.listener(client, ...args)
      );
    } else {
      client.on(event.name, async (...args) => event.listener(client, ...args));
    }
  });
};
