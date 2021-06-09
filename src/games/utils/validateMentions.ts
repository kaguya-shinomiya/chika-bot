import type { Message } from "discord.js";
import { lightErrorEmbed } from "../../shared/embeds";
import { Game } from "../../types/game";
import { sendTaggedSelfError } from "./embeds";

// mentions should only work for strictly 2 player games
export const validateMentions = (message: Message, game: Game) => {
  const { mentions, channel, author } = message;
  const taggedCount = mentions.users.size;
  if (!taggedCount) {
    return true;
  }
  const isTwoPlayer = game.minPlayerCount === 2 && game.maxPlayerCount === 2;
  if (!isTwoPlayer && taggedCount > 0) {
    channel.send(
      lightErrorEmbed(`You can only tag another player for 2-player games.`)
    );
    return false;
  }
  if (isTwoPlayer && taggedCount !== 1) {
    channel.send(
      lightErrorEmbed(
        `Please tag only one other user to play **${game.displayTitle}** with.`
      )
    );
    return false;
  }
  if (process.env.NODE_ENV !== "development") {
    if (isTwoPlayer && mentions.users.first()!.id === author.id) {
      sendTaggedSelfError(channel);
      return false;
    }
  }
  return true;
};
