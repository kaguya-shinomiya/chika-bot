export class GameState {
  gameTitle: string; // name of the game

  channelID: string;

  constructor(name: string, channelID: string) {
    this.gameTitle = name;
    this.channelID = channelID;
  }
}
