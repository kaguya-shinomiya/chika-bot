import { Message, MessageReaction, User } from "discord.js";
import { red_cross, white_check_mark } from "../../assets";
import { genericErrorEmbed, lightErrorEmbed } from "../../shared/embeds";

export type OpponentResponse = "timeout" | "rejected" | "accepted";
interface handleOpponentResponseParams {
  message: Message;
  gameTitle: string;
  onAccept: () => void;
  onReject: () => void;
  taggedOpponent: User;
}

export const getOpponentResponse = async ({
  message: { channel, author },
  gameTitle,
  onAccept,
  onReject,
  taggedOpponent,
}: handleOpponentResponseParams) => {
  channel
    .send(
      `${taggedOpponent.toString()}! **${
        author.username
      }** has challenged you to a game of ${gameTitle}!\nDo you accept this challenge?`
    )
    .then(async (message) => {
      await message
        .react(white_check_mark)
        .then(() => message.react(red_cross));

      return message
        .awaitReactions(
          (reaction: MessageReaction, user: User) =>
            user.id === taggedOpponent.id &&
            (reaction.emoji.name === white_check_mark ||
              reaction.emoji.name === red_cross),
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
          channel.send(
            lightErrorEmbed(`No response from **${taggedOpponent.username}**.`)
          );
          break;
        case "rejected":
          onReject();
          break;
        case "accepted":
          onAccept();
          break;
        default:
          throw new Error("Received unknown response from opponent.");
      }
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error(err);
      channel.send(genericErrorEmbed());
    });
};
