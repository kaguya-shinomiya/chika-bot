import { User } from "discord.js";
import he from "he";
import {
  baseEmbed,
  lightErrorEmbed,
  withAuthorEmbed,
} from "../../../shared/embeds";
import { GenericChannel } from "../../../types/command";
import { QueueItem } from "../../../types/queue";

export const toUrlString = (
  title: string,
  link: string,
  truncate?: number
): string => {
  const decodedTitle = he.decode(title);
  if (!truncate) {
    return `[${decodedTitle}](${link})`;
  }
  return `[${decodedTitle.substring(0, truncate)} ${
    title.length > truncate ? "..." : ""
  }](${link})`;
};

interface GenericVideoProps {
  videoData?: any;
  title?: string;
  thumbnailLink?: string;
  link: string;
}

export const sendNowPlaying = async (
  channel: GenericChannel,
  { videoData, title, thumbnailLink, link }: GenericVideoProps
) => {
  const partialEmbed = baseEmbed().setTitle("Now playing...");
  if (videoData) {
    channel.send(
      partialEmbed
        .setDescription(toUrlString(videoData.snippet.title, link))
        .setThumbnail(videoData.snippet.thumbnails.default.url)
    );
    return;
  }
  channel.send(
    partialEmbed
      .setDescription(toUrlString(title!, link))
      .setThumbnail(thumbnailLink!)
  );
};

export const sendNoVideo = async (searched: string, channel: GenericChannel) =>
  channel.send(
    lightErrorEmbed(`I couldn't find any songs at **${searched}**.`)
  );

export const sendNotInVoiceChannel = async (channel: GenericChannel) =>
  channel.send(lightErrorEmbed("Join a voice channel first!"));

interface sendAddedToQueueProps {
  videoData: any;
  link: string;
  channel: GenericChannel;
  author: User;
}

export const sendAddedToQueue = async ({
  videoData,
  link,
  channel,
  author,
}: sendAddedToQueueProps) =>
  channel.send(
    withAuthorEmbed(author)
      .setTitle("Added to queue!")
      .setDescription(toUrlString(videoData.snippet.title, link))
      .setThumbnail(videoData.snippet.thumbnails.default.url)
  );

export const sendNotInGuild = async (channel: GenericChannel) =>
  channel.send(lightErrorEmbed("I can only play songs for you in a server!"));

export const sendMaxTracksQueued = async (channel: GenericChannel) =>
  channel.send(lightErrorEmbed("Maximum number of tracks queued!"));

export const sendQueued = async (
  tracks: QueueItem[],
  channel: GenericChannel
) => {
  let desc = "";
  tracks.forEach((track, i) => {
    desc += `\`${i + 1}\` ${toUrlString(track.title, track.link, 40)}\n`;
  });
  channel.send(
    baseEmbed()
      .setTitle("Tracks Queued")
      .setDescription(desc)
      .setThumbnail(tracks[0].thumbnailLink)
  );
};

interface sendRepeatProps {
  channel: GenericChannel;
  author: User;
  title: string;
  link: string;
  thumbnailLink: string;
}
export const sendRepeat = async ({
  channel,
  author,
  title,
  link,
  thumbnailLink,
}: sendRepeatProps) =>
  channel.send(
    withAuthorEmbed(author)
      .setTitle("Track will repeat!")
      .setDescription(toUrlString(title, link))
      .setThumbnail(thumbnailLink)
  );
