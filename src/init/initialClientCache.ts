import Discord, { Collection } from "discord.js";
import type { AudioUtils } from "../types/queue";

export const initialClientCache: Discord.Client["cache"] = {
  audioUtils: new Collection<string, AudioUtils>(),
  inGameStates: new Collection<string, string>(),
};
