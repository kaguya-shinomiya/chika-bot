import { Collection, Snowflake, User } from "discord.js";
import { GameState } from "../../types/gameState";
import { LifeCard } from "./cards/types";
import { HappyLifeStats } from "./lifeStats";
import shuffleCards from "./cards";
import { shuffle } from "../../utils/shuffle";

interface HappyLifeGameStateConstructorParams {
  channelID: string;
  players: Collection<Snowflake, User>;
}

export class HappyLifeGameState extends GameState {
  players: Collection<Snowflake, User>;

  playOrder: Snowflake[];

  nextPlayer: Snowflake;

  stats: Collection<Snowflake, HappyLifeStats>;

  cards: LifeCard[];

  constructor({ channelID, players }: HappyLifeGameStateConstructorParams) {
    super("happylife", channelID);
    this.players = players;

    this.stats = new Collection<Snowflake, HappyLifeStats>();
    players.forEach((player) =>
      this.stats.set(player.id, new HappyLifeStats(player.username))
    );

    this.playOrder = shuffle(players.map((player) => player.id));
    [this.nextPlayer] = this.playOrder;

    this.cards = shuffleCards();
  }
}
