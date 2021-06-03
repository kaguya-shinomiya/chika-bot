import { Message } from "discord.js";
import type { HappyLifeGameState } from "../gameState";

type LifeCardType = "Bad luck" | "Lucky";

export const next = (state: HappyLifeGameState, message: Message) => {
  // TODO push to next player
  const { playOrder } = state;
  let { toPlay } = state;
  toPlay += 1;
  toPlay %= 6;

  console.log("inside next - toplay is: ", toPlay);

  message.channel.send(
    `${playOrder[toPlay].toString()} goes next! Please \`!roll\`.`
  );
};

export interface LifeCard {
  type: LifeCardType;

  name: string;

  description: string;

  onLand: (state: HappyLifeGameState, message: Message) => void;
}
