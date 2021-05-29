import { Client, ClientEvents } from "discord.js";
import { RedisPrefixed } from "./client";

interface ListenerParams {
  client: Client;
  redis: RedisPrefixed;
}
export interface Event {
  name: keyof ClientEvents;
  once: boolean;
  listener: ({ client, redis }: ListenerParams, ...args: any[]) => void;
}
