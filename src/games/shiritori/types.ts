import { User } from "discord.js";
import { GameState } from "../../types/gameState";

// TODO game timeout on inactivity
interface ShiritoriGameStateConstructorProps {
  p1: User;
  p2: User;
  p1Cards: string[];
  p2Cards: string[];
  startingChar: string;
  channelID: string;
}
export class ShiritoriGameState extends GameState {
  p1: User;

  p2: User;

  p1Cards: string[];

  p2Cards: string[];

  startingChar: string;

  constructor({
    p1,
    p2,
    p1Cards,
    p2Cards,
    startingChar,
    channelID,
  }: ShiritoriGameStateConstructorProps) {
    super("shiritori", channelID);
    this.p1 = p1;
    this.p2 = p2;
    this.p1Cards = p1Cards;
    this.p2Cards = p2Cards;
    this.startingChar = startingChar;
  }
}
