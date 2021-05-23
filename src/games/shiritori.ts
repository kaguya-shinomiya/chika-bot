import { Message, MessageReaction, User } from "discord.js";
import { red_cross, white_check_mark } from "../assets";
import { genericErrorEmbed } from "../shared/genericErrorEmbed";
import { Game, OpponentResponse } from "../types/game";
import { sendNoTagError } from "./utils/sendNoTagError";

class Shiritori extends Game {
  pregame(message: Message) {
    const { channel, mentions, author } = message;
    const opponent = mentions.users.first();
    if (!opponent) {
      sendNoTagError(this.name, channel, true);
      return;
    }

    // if (author.id === opponent.id) {
    //   sendTaggedSelfError(channel);
    //   return;
    // }

    channel
      .send(
        `${opponent.toString()}! **${
          author.username
        }** has challenged you to a game of Shiritori!\nDo you accept this challenge?`
      )
      .then(async (message) => {
        await message
          .react(white_check_mark)
          .then(() => message.react(red_cross));

        return message
          .awaitReactions(
            (reaction: MessageReaction, user: User) => {
              return (
                user.id === opponent.id &&
                (reaction.emoji.name === white_check_mark ||
                  reaction.emoji.name === red_cross)
              );
            },
            { time: 10000, max: 1 }
          )
          .then((collected): Promise<OpponentResponse> => {
            const reaction = collected.first();
            switch (reaction?.emoji.name) {
              case red_cross:
                return Promise.resolve<OpponentResponse>("rejected");
              case white_check_mark:
                return Promise.resolve<OpponentResponse>("accepted");
              default:
                return Promise.resolve<OpponentResponse>("timeout");
            }
          });
      })
      .then((response) => {
        // TODO register the new message listener
        switch (response) {
          case "timeout":
            // TODO probably do nothing
            break;
          case "rejected":
            channel.send(
              `**${opponent.username}** has turned down the challenge.`
            );
            break;
          case "accepted":
            // TODO start the game, register new message listener
            console.log("match is gonna start");
        }
      })
      .catch(() => {
        channel.send(genericErrorEmbed);
      });
  }
}

export default new Shiritori("shiritori", "1v1");
