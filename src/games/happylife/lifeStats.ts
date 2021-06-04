/* eslint-disable no-underscore-dangle */
export class HappyLifeStats {
  username: string;

  _cursor: number; // 'position' of the player

  get cursor() {
    return this._cursor;
  }

  set cursor(value) {
    this._cursor = value;
  }

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
    this._cursor = -1;
  }
}
