import type { Client, ClientEvents } from "discord.js";
import { RedisPrefixed } from "./redis";

interface Event {
  name: keyof ClientEvents;
  once: boolean;
  listener: (client: Client, redis: RedisPrefixed, ...args: any[]) => void;
}

export type { Event };
