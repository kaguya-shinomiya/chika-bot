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
import {
  baseEmbed,
  genericErrorEmbed,
  lightErrorEmbed,
} from "../shared/embeds";

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
}

interface getOpponentResponseParams {
  message: Message;
  onAccept: () => void;
  onReject: () => void;
  opponent: User;
}

export abstract class Game {
  abstract title: string;

  abstract displayTitle: string;

  abstract minPlayerCount: number;

  abstract maxPlayerCount: number;

  abstract pregame(message: Message, redis: Redis): void;

  abstract rules: MessageEmbed;

  collectPlayers(opts: collectPlayersParams) {
    const {
      message: { author, channel },
      onTimeoutAccept,
      onTimeoutReject,
    } = opts;

    const partialEmbed = baseEmbed()
      .setDescription(
        `**${author.username}** wants to start a round of **${this.displayTitle}**!`
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
            const reactors = await collected.first()!.users.fetch();
            if (reactors.size < this.minPlayerCount) {
              return Promise.reject(new Error(`Insufficient players.`));
            }
            return reactors.filter((user) => !user.bot).set(author.id, author);
          });
      })
      .then(
        (players) => onTimeoutAccept(players),
        () => {
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
      opponent,
    } = opts;
    channel
      .send(
        `${opponent.toString()}! **${
          author.username
        }** has challenged you to a game of ${
          this.displayTitle
        }!\nDo you accept this challenge?`
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
            const reaction = collected.first;
          });
      });
  }
}
