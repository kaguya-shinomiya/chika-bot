import { Collection, Snowflake, User } from "discord.js";
import { GameState } from "../../types/gameState";
import type { LifeCard } from "./cards/types";
import { HappyLifeStats } from "./lifeStats";
import shuffleCards from "./cards";
import { shuffle } from "../../utils/shuffle";

interface HappyLifeGameStateConstructorParams {
  channelID: string;
  players: Collection<Snowflake, User>;
}

export class HappyLifeGameState extends GameState {
  players: Collection<Snowflake, User>;

  playOrder: User[];

  toPlay: number; // track index

  stats: Collection<Snowflake, HappyLifeStats>;

  cards: LifeCard[];

  constructor({ channelID, players }: HappyLifeGameStateConstructorParams) {
    super("happylife", channelID);
    this.players = players;

    this.stats = new Collection<Snowflake, HappyLifeStats>();
    players.forEach((player) =>
      this.stats.set(player.id, new HappyLifeStats(player.id, player.username))
    );

    this.playOrder = shuffle(players.array());
    this.toPlay = -1; // start from -1, since we'll add one in `next`

    this.cards = shuffleCards();
  }
}
