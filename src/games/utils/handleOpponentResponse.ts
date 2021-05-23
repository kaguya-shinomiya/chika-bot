import { Message, MessageReaction, User } from "discord.js";
import { red_cross, white_check_mark } from "../../assets";
import { genericErrorEmbed } from "../../shared/genericErrorEmbed";
import { OpponentResponse } from "../../types/game";

export const handleOpponentResponse = async (
  { channel, author }: Message,
  opponent: User,
  onAccept: any,
  onReject: any
) => {
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
      switch (response) {
        case "timeout":
          break;
        case "rejected":
          onReject();
          break;
        case "accepted":
          onAccept();
      }
    })
    .catch(() => {
      channel.send(genericErrorEmbed);
    });
};
