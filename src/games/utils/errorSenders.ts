import { MessageEmbed } from "discord.js";
import {
  chika_crying_png,
  chika_peeking_png,
  chika_rap_png,
} from "../../assets";
import { chika_pink } from "../../constants";
import { GenericChannel } from "../../types/game";

export const sendNoGameSelectedError = async (channel: GenericChannel) => {
  channel.send(
    new MessageEmbed()
      .setColor(chika_pink)
      .setTitle("Rejected!")
      .setThumbnail(chika_rap_png)
      .setDescription("Tell me which game you wanna play, yo.")
  );
};

export const sendNoTagError = async (
  gameName: string,
  channel: GenericChannel,
  single: boolean
) => {
  channel.send(
    new MessageEmbed()
      .setColor(chika_pink)
      .setTitle("Rejected!")
      .setThumbnail(chika_rap_png)
      .setDescription(
        single
          ? `You must tag another user to play *${gameName}* with.`
          : `Tag some other users to play *${gameName}* with.`
      )
  );
};

export const sendTaggedSelfError = async (channel: GenericChannel) => {
  channel.send(
    new MessageEmbed()
      .setColor(chika_pink)
      .setThumbnail(chika_peeking_png)
      .setTitle("...")
      .setDescription(`Do you have no friends.`)
  );
};

export const sendUnknownGameError = async (
  gameName: string,
  channel: GenericChannel
) => {
  channel.send(
    new MessageEmbed()
      .setColor(chika_pink)
      .setThumbnail(chika_crying_png)
      .setTitle("Sorry...")
      .setDescription(`I don't know how to play *${gameName}*.`)
  );
  // TODO return a list of playable games
};

export const sendGameCrashedError = async (channel: GenericChannel) => {
  channel.send(
    new MessageEmbed()
      .setColor(chika_pink)
      .setThumbnail(chika_crying_png)
      .setTitle("what the heck")
      .setDescription("The game crashed for some reason.")
  );
};
