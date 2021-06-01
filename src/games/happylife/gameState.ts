import { Collection, Snowflake, User } from "discord.js";
import { GameState } from "../../types/gameState";
import { HappyLifeStats } from "./lifeStats";

interface HappyLifeGameStateConstructorParams {
  channelID: string;
  players: Collection<Snowflake, User>;
}

export class HappyLifeGameState extends GameState {
  players: Collection<Snowflake, User>;

  stats: Collection<Snowflake, HappyLifeStats>;

  constructor({ channelID, players }: HappyLifeGameStateConstructorParams) {
    super("happylife", channelID);
    this.players = players;

    this.stats = new Collection<Snowflake, HappyLifeStats>();
    players.forEach((player) =>
      this.stats.set(player.id, new HappyLifeStats(player.username))
    );
  }
}
