import {
  Collection,
  Message,
  MessageEmbed,
  MessageReaction,
  Snowflake,
  User,
} from "discord.js";
import { Redis } from "ioredis";
import { red_cross, white_check_mark } from "../assets";
import { PREFIX } from "../constants";
import { STOP_GAME } from "../games/utils/constants";
import {
  baseEmbed,
  detectiveEmbed,
  genericErrorEmbed,
  lightErrorEmbed,
} from "../shared/embeds";
import { toListString } from "../utils/text";
import { GenericChannel } from "./command";

// eslint-disable-next-line no-shadow
export enum GameType {
  Single = 1,
  Versus,
  Multi,
  Indie,
}

interface collectPlayersParams {
  message: Message;
  onTimeoutAccept: (players: Collection<Snowflake, User>) => void;
  onTimeoutReject?: () => void;
  redis: Redis;
}

interface getOpponentResponseParams {
  message: Message;
  onAccept: () => void;
  onReject?: () => void;
  taggedOpponent: User;
  redis: Redis;
}

export abstract class Game {
  abstract title: string;

  abstract displayTitle: string;

  abstract minPlayerCount: number;

  abstract maxPlayerCount: number;

  abstract rules: MessageEmbed;

  abstract sessionDuration: number; // in milliseconds

  abstract pregame(message: Message, redis: Redis): void;

  collectPlayers(opts: collectPlayersParams) {
    const {
      message: { author, channel },
      onTimeoutAccept,
      onTimeoutReject,
      redis,
    } = opts;

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
      .then(async (message) => {
        await message.react(white_check_mark);

        return message
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
        (err) => {
          // eslint-disable-next-line no-console
          console.error(err);
          redis.del(channel.id);
          if (onTimeoutReject) {
            onTimeoutReject();
            return;
          }
          channel.send(
            lightErrorEmbed(
              `We don't have enough players to start ${this.displayTitle}.`
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

  getOpponentResponse(opts: getOpponentResponseParams) {
    const {
      message: { author, channel },
      onAccept,
      onReject,
      taggedOpponent: opponent,
      redis,
    } = opts;
    channel
      .send(
        `${opponent.toString()}! **${
          author.username
        }** has challenged you to a game of **${
          this.displayTitle
        }**!\nDo you accept this challenge?`
      )
      .then(async (message) => {
        await message
          .react(white_check_mark)
          .then(() => message.react(red_cross));

        message
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
    channel.send(
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
