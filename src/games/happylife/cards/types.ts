import { Message } from "discord.js";
import { Redis } from "ioredis";
import type { HappyLifeGameState } from "../gameState";

type LifeCardType = "Bad luck" | "Lucky";

export interface LifeCardInfo {
  type: LifeCardType;

  name: string;

  description: string;

  onLand: (state: HappyLifeGameState, message: Message, redis: Redis) => void;
}

export interface LifeCard extends LifeCardInfo {
  id: number;
}
