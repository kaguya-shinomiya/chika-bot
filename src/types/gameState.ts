export interface GameState {
  name: string; // name of the game
  channelID: string; // channel ID where the game is playing
  players: string[]; // list of player IDs
}
