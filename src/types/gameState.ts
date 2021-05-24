export class GameState {
  name: string; // name of the game
  channelID: string; // channel ID where the game is playing

  constructor(name: string, channelID: string) {
    this.name = name;
    this.channelID = channelID;
  }
}
