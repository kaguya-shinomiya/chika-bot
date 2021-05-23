export class GameState {
  name: string; // name of the game
  channelID: string; // channel ID where the game is playing
  players: string[]; // list of player IDs

  constructor(name: string, channelID: string, players: string[]) {
    this.name = name;
    this.channelID = channelID;
    this.players = players;
  }
}
