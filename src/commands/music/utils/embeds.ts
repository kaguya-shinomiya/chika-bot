import type { User } from "discord.js";
import he from "he";
import { chika_detective_png } from "../../../assets";
import {
  baseEmbed,
  cryingEmbed,
  lightErrorEmbed,
  withAuthorEmbed,
} from "../../../shared/embeds";
import { GenericChannel } from "../../../types/command";
import { QueueItem } from "../../../types/queue";
import { secToString, stringToSec } from "./helpers";

export const toUrlString = (
  title: string,
  link: string,
  truncate?: number
): string => {
  const decodedTitle = he.decode(title);
  if (!truncate) {
    return `[${decodedTitle
      .replace(/\[/g, "\uFF3B")
      .replace(/\]/g, "\uFF3D")}](${link})`;
  }
  return `[${decodedTitle
    .substring(0, truncate)
    .replace(/\[/g, "\uFF3B")
    .replace(/\]/g, "\uFF3D")} ${
    title.length > truncate ? "..." : ""
  }](${link})`;
};

export const trackLinkAndDuration = (
  title: string,
  url: string,
  duration: string,
  options?: { truncate?: number }
) => `${toUrlString(title, url, options?.truncate)} [${duration}]`;

export const genPlayBar = (current: number, total: string) => {
  // current is in milliseconds
  const totalMillis = stringToSec(total) * 1000;
  const currentMin = secToString(Math.floor(current / 1000));
  const cursor = Math.floor((current / totalMillis) * 29);
  return `${currentMin} ${"-".repeat(cursor)}o${"-".repeat(
    29 - cursor
  )} ${total}`;
};

interface sendNowPlayingOptions {
  streamTime: number;
}

export const sendNowPlaying = async (
  channel: GenericChannel,
  videoData: QueueItem,
  withBar?: sendNowPlayingOptions
) => {
  const { title, url, duration, thumbnailURL } = videoData;
  channel.send(
    baseEmbed()
      .setTitle("Now playing...")
      .setDescription(
        `${toUrlString(title, url)}${
          withBar ? `\n${genPlayBar(withBar.streamTime, duration)}` : ""
        }`
      )
      .setThumbnail(thumbnailURL)
  );
};

export const sendNoVideo = async (channel: GenericChannel, searched: string) =>
  channel.send(
    cryingEmbed()
      .setTitle("Sorry...")
      .setDescription(
        `I couldn't find anything at **${searched}**! It might be a restricted video.`
      )
  );

export const sendCannotPlay = async (
  channel: GenericChannel,
  title: string,
  url: string
) =>
  channel.send(
    cryingEmbed()
      .setTitle("Sorry...")
      .setDescription(
        `I couldn't play [${title}](${url})! Maybe it's a restricted video?`
      )
  );

export const sendNotInVoiceChannel = async (channel: GenericChannel) =>
  channel.send(lightErrorEmbed("Join a voice channel first!"));

interface sendAddedToQueueOptions {
  videoData: QueueItem;
  author: User;
}

export const sendAddedToQueue = async (
  channel: GenericChannel,
  {
    videoData: { title, url, duration, thumbnailURL },
    author,
  }: sendAddedToQueueOptions
) =>
  channel.send(
    withAuthorEmbed(author)
      .setTitle("Added to queue!")
      .setDescription(trackLinkAndDuration(title, url, duration))
      .setThumbnail(thumbnailURL)
  );

export const sendMusicOnlyInGuild = async (channel: GenericChannel) =>
  channel.send(lightErrorEmbed("I can only play music for you in a server!"));

export const toListString = (arr: string[]): string => {
  const withCount = arr.map((item, i) => `\`${i + 1}\` ${item}`);
  return withCount.join(`\n`);
};

interface sendQueueCurrentTrack {
  nowPlaying?: QueueItem;
  isPaused?: boolean;
  current?: number;
}

export const sendQueue = async (
  channel: GenericChannel,
  tracks: QueueItem[],
  info: sendQueueCurrentTrack
) => {
  const { current, isPaused, nowPlaying } = info;
  const urlTracks = tracks
    .slice(0, 10)
    .map((track) => toUrlString(track.title, track.url, 40));
  const now = nowPlaying
    ? `${isPaused ? ":pause_button:" : ":arrow_forward:"} ${toUrlString(
        nowPlaying.title,
        nowPlaying.url,
        30
      )} [${secToString(Math.floor(current! / 1000))} / ${nowPlaying.duration}]`
    : "";
  const partialEmbed = baseEmbed()
    .setTitle("Tracks Queued")
    .setDescription(toListString(urlTracks))
    .setThumbnail(tracks[0]?.thumbnailURL || nowPlaying!.thumbnailURL)
    .setFooter(
      `${tracks.length} ${tracks.length === 1 ? "track" : "tracks"} queued ${
        tracks.length > 10 ? "(showing first 10)" : ""
      } | ${
        nowPlaying
          ? `One track ${isPaused ? "paused" : "playing"}`
          : `Nothing playing now`
      }`
    );
  if (nowPlaying) {
    channel.send(partialEmbed.addField(`Now playing`, now));
    return;
  }
  channel.send(partialEmbed);
};

interface sendRepeatProps {
  author: User;
  videoData: QueueItem;
}
export const sendRepeat = async (
  channel: GenericChannel,
  { author, videoData: { title, url, thumbnailURL, duration } }: sendRepeatProps
) =>
  channel.send(
    withAuthorEmbed(author)
      .setTitle("Track will repeat!")
      .setDescription(trackLinkAndDuration(title, url, duration))
      .setThumbnail(thumbnailURL)
  );

export const sendSearchResults = (
  channel: GenericChannel,
  res: QueueItem[]
) => {
  const urlTitles = res.map((videoData) =>
    toUrlString(videoData.title, videoData.url, 36)
  );

  channel.send(
    baseEmbed()
      .setTitle("I found these tracks:")
      .setDescription(toListString(urlTitles))
      .setThumbnail(chika_detective_png)
      .addField(
        "\u200b",
        "Send me the track's number and I'll add it to the queue!"
      )
  );
};

export const sendNoVoicePermissions = (channel: GenericChannel) =>
  channel.send(
    lightErrorEmbed(`Please give me permissions to join your voice chat.`)
  );

export const sendFinishedAllTracks = (channel: GenericChannel) =>
  channel.send(
    baseEmbed().setDescription(`All requested tracks have finished playing.`)
  );
