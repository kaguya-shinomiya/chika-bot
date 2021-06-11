import type { Collection, Snowflake, User } from "discord.js";
import { GameState } from "../../../types/gameState";

// TODO game timeout on inactivity

export class ShiritoriState implements GameState {
  readonly gameTitle = "shiritori";

  readonly channelId!: string;

  readonly p1!: User;

  readonly p2!: User;

  cards!: Collection<Snowflake, string[]>;

  startingChar!: string;
}
