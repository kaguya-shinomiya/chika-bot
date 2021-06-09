import type {
  Message,
  MessageEmbed,
  MessageReaction,
  Snowflake,
  User,
} from "discord.js";
import { Collection } from "discord.js";
import { red_cross, white_check_mark } from "../shared/assets";
import { toListString } from "../commands/music/utils/embeds";
import { DEFAULT_PREFIX } from "../shared/constants";
import { EXIT_GAME } from "../games/utils/constants";
import { unblock } from "../games/utils/manageState";
import {
  baseEmbed,
  detectiveEmbed,
  genericErrorEmbed,
  lightErrorEmbed,
} from "../shared/embeds";
import { BlockingLevel } from "./blockingLevel";
import type { GenericChannel } from "./command";

interface collectPlayersOptions {
  onTimeoutAccept: (players: Collection<Snowflake, User>) => void;
  onTimeoutReject?: () => void;
}

interface getOpponentResponseOptions {
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

  abstract pregame(message: Message): void;

  abstract blockingLevel: BlockingLevel;

  collectPlayers(message: Message, options: collectPlayersOptions) {
    const { author, channel } = message;
    const { onTimeoutAccept, onTimeoutReject } = options;

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
          unblock(this, message);
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
    const { onAccept, onReject } = options;
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
                unblock(this, message);
                if (onReject) {
                  onReject();
                } else {
                  channel.send(
                    `**${opponent.username}** does not want to play ${this.displayTitle}`
                  );
                }
                break;
              default:
                unblock(this, message);
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
          }**, use \`${DEFAULT_PREFIX}rules ${this.title}\`.
        \`${EXIT_GAME}\` will stop the game at anytime.
        
        ${options?.startsInMessage || "I'll start the game in 5 seconds!"}
        `
        )
    );
  }
}
