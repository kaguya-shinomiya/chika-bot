export class GameState {
  name: string; // name of the game

  channelID: string;

  constructor(name: string, channelID: string) {
    this.name = name;
    this.channelID = channelID;
  }
}
