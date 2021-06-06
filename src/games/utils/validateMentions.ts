import { MessageMentions, User } from "discord.js";
import { __dev__ } from "../../constants";
import { lightErrorEmbed } from "../../shared/embeds";
import { GenericChannel } from "../../types/command";
import { sendTaggedSelfError } from "./embeds";

interface validateMentionsParams {
  author: User;
  mentions: MessageMentions;
  isTwoPlayer: boolean;
  channel: GenericChannel;
  gameTitle: string;
}

// mentions should only work for strictly 2 player games
export const validateMentions = ({
  author,
  mentions,
  isTwoPlayer,
  channel,
  gameTitle,
}: validateMentionsParams) => {
  const taggedCount = mentions.users.size;
  if (!taggedCount) {
    return true;
  }
  if (!isTwoPlayer && taggedCount > 0) {
    channel.send(
      lightErrorEmbed(`You can only tag another player for 2-player games.`)
    );
    return false;
  }
  if (isTwoPlayer && taggedCount !== 1) {
    channel.send(
      lightErrorEmbed(
        `Please tag only one other user to play **${gameTitle}** with.`
      )
    );
    return false;
  }
  if (!__dev__) {
    if (isTwoPlayer && mentions.users.first()!.id === author.id) {
      sendTaggedSelfError(channel);
      return false;
    }
  }
  return true;
};
