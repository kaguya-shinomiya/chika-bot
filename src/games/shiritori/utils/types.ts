import type { Collection, Snowflake, User } from 'discord.js';
import { GameState } from '../../../types/gameState';

// TODO game timeout on inactivity

interface ShiritoriState extends GameState {
  p1: User;
  p2: User;
  cards: Collection<Snowflake, string[]>;
  startingChar: string;
  minLen: number;
}

export type { ShiritoriState };
