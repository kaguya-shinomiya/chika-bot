import { Job } from "./jobs";

/* eslint-disable no-underscore-dangle */
export class HappyLifeStats {
  userID: string;

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

  _job?: Job;

  get job() {
    return this._job;
  }

  set job(newJob) {
    this._job = newJob;
  }

  constructor(userID: string, username: string) {
    this.userID = userID;
    this.username = username;
    this._netWorth = 10000;
    this._cursor = -1;
  }
}
