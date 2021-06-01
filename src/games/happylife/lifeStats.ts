/* eslint-disable no-underscore-dangle */
export class HappyLifeStats {
  username: string;

  _netWorth: number;

  get netWorth() {
    return this._netWorth;
  }

  set netWorth(value) {
    this._netWorth = value;
  }

  constructor(username: string) {
    this.username = username;
    this._netWorth = 10000;
  }
}
