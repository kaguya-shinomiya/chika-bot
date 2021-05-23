import { DMChannel, MessageEmbed, NewsChannel, TextChannel } from "discord.js";
import { chika_pink } from "../../constants";
import {
  chika_crying_png,
  chika_peeking_png,
  chika_rap_png,
} from "../../assets";

export const sendNoGameSelectedError = async (
  channel: TextChannel | DMChannel | NewsChannel
) => {
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
  channel: TextChannel | DMChannel | NewsChannel,
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

export const sendTaggedSelfError = async (
  channel: TextChannel | DMChannel | NewsChannel
) => {
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
  channel: TextChannel | DMChannel | NewsChannel
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
