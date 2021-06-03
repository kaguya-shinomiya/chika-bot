import { Message } from "discord.js";
import { Redis } from "ioredis";
import type { HappyLifeGameState } from "../gameState";
import { registerRollListener } from "../utils/listeners";

type LifeCardType = "Bad luck" | "Lucky";

export interface LifeCard {
  id?: number;

  type: LifeCardType;

  name: string;

  description: string;

  onLand: (state: HappyLifeGameState, message: Message, redis: Redis) => void;
}

export const next = (
  state: HappyLifeGameState,
  message: Message,
  redis: Redis
) => {
  state.toPlay = (state.toPlay + 1) % state.playOrder.length;

  message.channel.send(
    `${state.playOrder[state.toPlay].toString()} goes next! Please \`!roll\`.`
  );

  registerRollListener(state, message.client, redis);
};
