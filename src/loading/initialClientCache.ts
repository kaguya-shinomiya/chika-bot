import { Collection } from "discord.js";
import type { AudioUtils } from "../types/queue";

export const initialClientCache = {
  audioUtils: new Collection<string, AudioUtils>(),
};
