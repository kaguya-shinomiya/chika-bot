import { Client, ClientEvents } from "discord.js";

export interface Event {
  name: keyof ClientEvents;
  once: boolean;
  listener: (client: Client, ...args: any[]) => void;
}
