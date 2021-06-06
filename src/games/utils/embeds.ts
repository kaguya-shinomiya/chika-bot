import {
  cryingEmbed,
  lightErrorEmbed,
  peekingEmbed,
} from "../../shared/embeds";
import { GenericChannel } from "../../types/command";

export const sendNoGameSelectedError = async (channel: GenericChannel) => {
  channel.send(lightErrorEmbed("Tell me which game you wanna play, yo."));
};

export const sendTaggedSelfError = async (channel: GenericChannel) => {
  channel.send(
    peekingEmbed().setTitle("...").setDescription(`Do you have no friends.`)
  );
};

export const sendUnknownGameError = async (
  gameName: string,
  channel: GenericChannel
) => {
  channel.send(
    lightErrorEmbed(`Sorry...I don't know how to play **${gameName}**.`)
  );
  // TODO return a list of playable games
};

export const sendGameCrashedError = async (channel: GenericChannel) => {
  channel.send(
    cryingEmbed()
      .setTitle("what the heck")
      .setDescription("The game crashed for some reason.")
  );
};

export const sendInGame = async (channel: GenericChannel) =>
  channel.send(
    lightErrorEmbed(
      "There is a game being played in this channel!\nPlease wait till the current game is finished."
    )
  );
