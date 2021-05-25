import he from "he";
import { baseEmbed, lightErrorEmbed } from "../../../shared/embeds";
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
  const partialEmbed = baseEmbed().setTitle("Now playing...");
  if (videoData) {
    channel.send(
      partialEmbed
        .setDescription(he.decode(videoData.snippet.title))
        .setThumbnail(videoData.snippet.thumbnails.default.url)
    );
    return;
  }
  channel.send(partialEmbed.setDescription(title).setThumbnail(thumbnailLink!));
};

export const sendNoVideo = async (searched: string, channel: GenericChannel) =>
  channel.send(
    lightErrorEmbed(`I couldn't find any songs at **${searched}**.`)
  );

export const sendNotInVoiceChannel = async (channel: GenericChannel) =>
  channel.send(lightErrorEmbed("I can only play music for you in a server!"));

export const sendAddedToQueue = async (
  videoData: any,
  channel: GenericChannel
) =>
  channel.send(
    baseEmbed()
      .setTitle("Added to queue!")
      .setDescription(he.decode(videoData.snippet.title))
      .setThumbnail(videoData.snippet.thumbnails.default.url)
  );

export const sendEmptyQueue = async (channel: GenericChannel) =>
  channel.send(lightErrorEmbed(`There are no songs queued for me to play!`));

export const sendNotInGuild = async (channel: GenericChannel) =>
  channel.send(lightErrorEmbed("I can only play songs for you in a server!"));

export const sendMaxTracksQueued = async (channel: GenericChannel) =>
  channel.send(lightErrorEmbed("Maximum number of tracks queued!"));
