import type {
  Message,
  MessageEmbed,
  MessageReaction,
  Snowflake,
  User,
} from "discord.js";
import { Collection } from "discord.js";
import type { Redis } from "ioredis";
import { red_cross, white_check_mark } from "../assets";
import { toListString } from "../commands/music/utils/embeds";
import { PREFIX } from "../constants";
import { STOP_GAME } from "../games/utils/constants";
import {
  baseEmbed,
  detectiveEmbed,
  genericErrorEmbed,
  lightErrorEmbed,
} from "../shared/embeds";
import type { GenericChannel } from "./command";
import { RedisPrefixed } from "./redis";

interface collectPlayersOptions {
  redis: Redis;
  onTimeoutAccept: (players: Collection<Snowflake, User>) => void;
  onTimeoutReject?: () => void;
}

interface getOpponentResponseOptions {
  redis: Redis;
  onAccept: () => void;
  onReject?: () => void;
}

export abstract class Game {
  abstract title: string;

  abstract displayTitle: string;

  abstract minPlayerCount: number;

  abstract maxPlayerCount: number;

  abstract rules: MessageEmbed;

  abstract sessionDuration: number; // in milliseconds

  abstract pregame(message: Message, redis: RedisPrefixed): void;

  nonBlocking?: boolean; // don't mark the channel as in-game

  collectPlayers(message: Message, options: collectPlayersOptions) {
    const { author, channel } = message;
    const { onTimeoutAccept, onTimeoutReject, redis } = options;

    const partialEmbed = baseEmbed()
      .setDescription(
        `**${author.username}** wants to play **${this.displayTitle}**!`
      )
      .addField(`To join`, `React to this message with the green check-mark.`);

    channel
      .send(
        this.minPlayerCount === 1
          ? partialEmbed
          : partialEmbed.setFooter(
              `We need ${this.minPlayerCount - 1} more ${
                this.minPlayerCount - 1 > 1 ? "players" : "player"
              } to start.`
            )
      )
      .then(async (_message) => {
        await _message.react(white_check_mark);

        return _message
          .awaitReactions(
            (reaction: MessageReaction, user: User) =>
              user.id !== author.id && reaction.emoji.name === white_check_mark,
            { maxUsers: this.maxPlayerCount - 1, time: 10000 }
          )
          .then(async (collected) => {
            const reactors =
              (await collected.first()?.users.fetch()) ||
              new Collection<Snowflake, User>();

            const players = reactors
              .filter((user) => !user.bot)
              .set(author.id, author);
            if (players.size < this.minPlayerCount) {
              return Promise.reject(new Error(`Insufficient players.`));
            }
            return Promise.resolve(players);
          });
      })
      .then(
        (players) => onTimeoutAccept(players),
        () => {
          // eslint-disable-next-line no-console
          redis.del(channel.id);
          if (onTimeoutReject) {
            onTimeoutReject();
            return;
          }
          channel.send(
            lightErrorEmbed(
              `We don't have enough players to start **${this.displayTitle}**.`
            )
          );
        }
      )
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error(err);
        channel.send(genericErrorEmbed());
      });
  }

  getOpponentResponse(
    message: Message,
    opponent: User,
    options: getOpponentResponseOptions
  ) {
    const { channel, author } = message;
    const { onAccept, onReject, redis } = options;
    channel
      .send(
        `${opponent.toString()}! **${
          author.username
        }** has challenged you to a game of **${
          this.displayTitle
        }**!\nDo you accept this challenge?`
      )
      .then(async (_message) => {
        await _message
          .react(white_check_mark)
          .then(() => _message.react(red_cross));

        _message
          .awaitReactions(
            (reaction: MessageReaction, user: User) =>
              user.id === opponent.id &&
              (reaction.emoji.name === white_check_mark ||
                reaction.emoji.name === red_cross),
            { time: 10000, max: 1 }
          )
          .then((collected) => {
            const reaction = collected.first();
            switch (reaction?.emoji.name) {
              case white_check_mark:
                onAccept();
                break;
              case red_cross:
                redis.del(channel.id);
                if (onReject) {
                  onReject();
                } else {
                  channel.send(
                    `**${opponent.username}** does not want to play ${this.displayTitle}`
                  );
                }
                break;
              default:
                redis.del(channel.id);
                channel.send(
                  lightErrorEmbed(`No response from **${opponent.username}**.`)
                );
                break;
            }
          });
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error(err);
        channel.send(genericErrorEmbed());
      });
  }

  async sendParticipants(
    channel: GenericChannel,
    participants: User[],
    options?: { startsInMessage: string }
  ) {
    const players = participants.map((user) => user.toString());
    return channel.send(
      detectiveEmbed()
        .setTitle(this.displayTitle)
        .addField(`Players:`, toListString(players))
        .addField(
          `More info`,
          `
          To review the rules of **${
            this.displayTitle
          }**, use \`${PREFIX}rules ${this.title}\`.
        \`${STOP_GAME}\` will stop the game at anytime.
        
        ${options?.startsInMessage || "I'll start the game in 5 seconds!"}
        `
        )
    );
  }
}
