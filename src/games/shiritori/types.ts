import { Collection, Snowflake, User } from "discord.js";
import { GameState } from "../../types/gameState";

// TODO game timeout on inactivity
interface ShiritoriGameStateConstructorProps {
  p1: User;
  p2: User;
  cards: Collection<Snowflake, string[]>;
  startingChar: string;
  channelID: string;
}
export class ShiritoriGameState extends GameState {
  p1: User;

  p2: User;

  cards: Collection<Snowflake, string[]>;

  startingChar: string;

  constructor({
    channelID,
    startingChar,
    p1,
    p2,
    cards,
  }: ShiritoriGameStateConstructorProps) {
    super("shiritori", channelID);
    this.startingChar = startingChar;
    this.p1 = p1;
    this.p2 = p2;
    this.cards = cards;
  }
}
