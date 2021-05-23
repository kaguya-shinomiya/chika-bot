import { MessageReaction } from "discord.js";
import { User } from "discord.js";
import { Message } from "discord.js";
import { red_cross, white_check_mark } from "../assets";
import { genericErrorEmbed } from "../shared/genericErrorEmbed";
import { Game } from "../types/game";
import { sendNoTagError } from "./utils.ts/sendNoTagError";
import { sendTaggedSelfError } from "./utils.ts/sendTaggedSelfError";

type OpponentResponse = "timeout" | "rejected" | "accepted";

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
            if (!reaction) return Promise.reject<OpponentResponse>("timeout");
            if (reaction?.emoji.name === red_cross) {
              channel.send(
                `**${opponent.username}** has turned down the challenge.`
              );
              return Promise.reject<OpponentResponse>("rejected");
            }
            return Promise.resolve<OpponentResponse>("accepted");
          });
      })
      .then(
        () => {
          // TODO register the new message listener
          console.log("the challenge was accepted");
        },
        () => {
          // TODO nothing lol
          console.log("the challenge was rejected");
        }
      )
      .catch(() => {
        channel.send(genericErrorEmbed);
      });
  }
}

export default new Shiritori("shiritori", "1v1");
