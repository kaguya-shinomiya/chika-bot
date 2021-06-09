import type { Client, Collection, Message, User } from "discord.js";
import { baseEmbed } from "../../shared/embeds";
import { GenericChannel } from "../../types/command";
import { Game } from "../../types/game";
import { BlockingLevel } from "../../types/BlockingLevel";
import { RedisPrefixed } from "../../types/redis";
import { createBalloonListener } from "./utils/listener";
import { BalloonState } from "./utils/types";

export class Balloon extends Game {
  title = "balloon";

  displayTitle = "Balloon";

  minPlayerCount = 2;

  maxPlayerCount = 6;

  sessionDuration = 1000 * 60 * 10;

  rules = baseEmbed().setTitle("Balloon");

  blockingLevel = BlockingLevel.guild;

  pregame(message: Message, redis: RedisPrefixed) {
    const { channel, client } = message;
    this.collectPlayers(message, {
      redis: redis.gamesRedis,
      onTimeoutAccept: (players) => {
        this.sendParticipants(
          channel,
          players.map((user) => user),
          {
            startsInMessage: `Carry on with your lives. ʕ•ᴥ•ʔ Each time you send something, the balloon gets pumped. You'll know when it pops.`,
          }
        );
        this.startGame(players, { channel, client, redis });
      },
    });
  }

  startGame(
    players: Collection<string, User>,
    meta: { channel: GenericChannel; client: Client; redis: RedisPrefixed }
  ) {
    const { channel, client, redis } = meta;
    const tolerance = Math.floor(Math.random() * 500 + 10);
    const initState: BalloonState = {
      gameTitle: this.title,
      channelId: channel.id,
      currentVolume: 0,
      tolerance,
      players,
    };

    client.once("message", createBalloonListener(initState, redis));
  }
}
