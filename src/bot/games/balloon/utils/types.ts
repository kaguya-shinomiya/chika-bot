import type { Collection, User } from 'discord.js';
import { GameState } from '../../../types/gameState';

interface BalloonState extends GameState {
  players: Collection<string, User>;
  tolerance: number;
  currentVolume: number;
}

export type { BalloonState };
