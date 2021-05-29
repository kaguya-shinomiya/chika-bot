import { PREFIX } from "../../constants";
import {
  cryingEmbed,
  lightErrorEmbed,
  peekingEmbed,
  pointingEmbed,
} from "../../shared/embeds";
import { GenericChannel } from "../../types/command";
import { capitalize } from "../../utils/text";

export const sendNoGameSelectedError = async (channel: GenericChannel) => {
  channel.send(lightErrorEmbed("Tell me which game you wanna play, yo."));
};

export const sendNoTagError = async (
  gameName: string,
  channel: GenericChannel,
  single: boolean
) => {
  channel.send(
    lightErrorEmbed(
      single
        ? `You must tag another user to play *${gameName}* with.`
        : `Tag some other users to play *${gameName}* with.`
    )
  );
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

interface sendGameStartsInParams {
  channel: GenericChannel;
  title: string;
  timeout?: number;
  message?: string;
}

export const sendGameStartsIn = async ({
  channel,
  title,
  timeout,
  message,
}: sendGameStartsInParams) =>
  channel.send(
    pointingEmbed()
      .setTitle("Alright!")
      .setDescription(message || `I'll start the game in ${timeout} seconds.`)
      .addField(
        "More info",
        `
        To review the rules of **${capitalize(
          title
        )}**, use \`${PREFIX}rules ${title}\`.
        \`!stop\` will stop the game at anytime.
        `
      )
  );
