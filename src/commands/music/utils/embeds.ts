import { MessageEmbed } from "discord.js";
import { chika_crying_png, chika_pointing_png } from "../../../assets";
import { chika_pink } from "../../../constants";
import { GenericChannel } from "../../../types/game";

interface GenericVideoProps {
  videoData?: any;
  title?: string;
  thumbnailLink?: string;
}

export const sendNowPlaying = async (
  channel: GenericChannel,
  { videoData, title, thumbnailLink }: GenericVideoProps
) => {
  const partialEmbed = new MessageEmbed()
    .setColor(chika_pink)
    .setTitle("Now playing...");
  if (videoData) {
    channel.send(
      partialEmbed
        .setDescription(videoData.snippet.title)
        .setThumbnail(videoData.snippet.thumbnails.default.url)
    );
    return;
  }
  channel.send(partialEmbed.setDescription(title).setThumbnail(thumbnailLink!));
};

export const sendNoVideo = async (searched: string, channel: GenericChannel) =>
  channel.send(
    new MessageEmbed()
      .setColor(chika_pink)
      .setTitle("What the heck")
      .setDescription(`I couldn't find anything at **${searched}**.`)
      .setThumbnail(chika_pointing_png)
  );

export const sendNotInVoiceChannel = async (channel: GenericChannel) =>
  channel.send(
    new MessageEmbed()
      .setColor(chika_pink)
      .setThumbnail(chika_crying_png)
      .setTitle("I can play music for you!")
      .setDescription("But you must join a voice channel first.")
  );

export const sendAddedToQueue = async (
  videoData: any,
  channel: GenericChannel
) =>
  channel.send(
    new MessageEmbed()
      .setColor(chika_pink)
      .setTitle("Added to queue!")
      .setDescription(videoData.snippet.title)
      .setThumbnail(videoData.snippet.thumbnails.default.url)
  );
