import { User } from "discord.js";
import he from "he";
import { chika_detective_png } from "../../../assets";
import {
  baseEmbed,
  lightErrorEmbed,
  withAuthorEmbed,
} from "../../../shared/embeds";
import { GenericChannel } from "../../../types/command";
import { QueueItem } from "../../../types/queue";
import { linkFromVideoData } from "./youtube";

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

export const listEmbed = (arr: string[]) => {
  let desc = "";
  arr.forEach((item, i) => {
    desc += `\`${i + 1}\` ${item}\n`;
  });
  return baseEmbed().setDescription(desc);
};

export const sendQueued = async (
  tracks: QueueItem[],
  channel: GenericChannel
) => {
  const urlTracks = tracks.map((track) =>
    toUrlString(track.title, track.link, 40)
  );
  channel.send(
    listEmbed(urlTracks)
      .setTitle("Tracks Queued")
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

export const sendSearchResults = (res: any[], channel: GenericChannel) => {
  const urlTitles = res.map((videoData) =>
    toUrlString(videoData.snippet.title, linkFromVideoData(videoData), 40)
  );

  channel.send(
    listEmbed(urlTitles)
      .setTitle("I found these tracks")
      .setThumbnail(chika_detective_png)
  );
};
