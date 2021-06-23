import type { Client, ClientEvents } from 'discord.js';

interface Event {
  name: keyof ClientEvents;
  once: boolean;
  listener: (client: Client, ...args: any[]) => void;
}

export type { Event };
