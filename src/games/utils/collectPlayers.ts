import {
  Collection,
  Message,
  MessageReaction,
  Snowflake,
  User,
} from "discord.js";
import { white_check_mark } from "../../assets";
import { baseEmbed, genericErrorEmbed } from "../../shared/embeds";

interface collectPlayersParams {
  message: Message;
  gameTitle: String;
  minResponses: number;
  maxResponses: number;
  onTimeoutAccept: (...args: any[]) => void;
  onTimeoutReject: (...args: any[]) => void;
}

export const collectPlayers = (opts: collectPlayersParams) => {
  const {
    gameTitle,
    message: { author, channel },
    maxResponses,
    minResponses,
    onTimeoutAccept,
    onTimeoutReject,
  } = opts;

  const partialEmbed = baseEmbed()
    .setDescription(
      `**${author.username}** wants to start a round of **${gameTitle}**!`
    )
    .addField(`To join`, `React to this message with any emoji.`);

  channel
    .send(
      minResponses === 0
        ? partialEmbed
        : partialEmbed.setFooter(
            `We need ${minResponses} more ${
              minResponses > 1 ? "players" : "player"
            } to start.`
          )
    )
    .then(async (message) => {
      await message.react(white_check_mark);

      return message
        .awaitReactions(
          (reaction: MessageReaction, user: User) =>
            (process.env.NODE_ENV === "development" || user.id !== author.id) &&
            !reaction.me,
          {
            time: 10000,
            max: maxResponses,
          }
        )
        .then((collected): Promise<Collection<Snowflake, User>> => {
          if (collected.size < minResponses) {
            return Promise.reject(new Error("Insufficient players."));
          }
          let players = new Collection<Snowflake, User>();
          collected.forEach((reaction) => {
            reaction.users.fetch().then((users) => {
              players = players.concat(users);
            });
          });
          players.set(author.id, author);
          return Promise.resolve(players);
        });
    })
    .then(
      (players) => onTimeoutAccept(players),
      () => onTimeoutReject()
    )
    .catch(() => channel.send(genericErrorEmbed()));
};
