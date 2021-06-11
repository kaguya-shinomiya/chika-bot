import type { Collection, User } from "discord.js";
import { GameState } from "../../../types/gameState";

export class BalloonState implements GameState {
  readonly gameTitle!: string;

  readonly channelId!: string;

  readonly players!: Collection<string, User>;

  readonly tolerance!: number;

  currentVolume!: number;
}
