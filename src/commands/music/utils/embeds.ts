import { User } from "discord.js";
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

export const trackLinkAndDuration = ({
  title,
  url,
  duration,
}: {
  title: string;
  url: string;
  duration: string;
}) => `${toUrlString(title, url)} [${duration}]`;

export const sendNowPlaying = async (
  channel: GenericChannel,
  { title, thumbnailURL, url, duration }: QueueItem
) =>
  channel.send(
    baseEmbed()
      .setTitle("Now playing...")
      .setDescription(trackLinkAndDuration({ title, url, duration }))
      .setThumbnail(thumbnailURL)
  );

export const sendNoVideo = async (searched: string, channel: GenericChannel) =>
  channel.send(
    cryingEmbed()
      .setTitle("Sorry...")
      .setDescription(
        `I couldn't find anything at **${searched}**! It might be a restricted video.`
      )
  );

export const sendCannotPlay = async (
  title: string,
  url: string,
  channel: GenericChannel
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

interface sendAddedToQueueProps {
  videoData: QueueItem;
  channel: GenericChannel;
  author: User;
}

export const sendAddedToQueue = async ({
  videoData: { title, url, duration, thumbnailURL },
  channel,
  author,
}: sendAddedToQueueProps) =>
  channel.send(
    withAuthorEmbed(author)
      .setTitle("Added to queue!")
      .setDescription(trackLinkAndDuration({ title, url, duration }))
      .setThumbnail(thumbnailURL)
  );

export const sendNotInGuild = async (channel: GenericChannel) =>
  channel.send(lightErrorEmbed("I can only play music for you in a server!"));

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
  const urlTracks = tracks
    .slice(0, 10)
    .map((track) => toUrlString(track.title, track.url, 40));
  channel.send(
    listEmbed(urlTracks)
      .setTitle("Tracks Queued")
      .setThumbnail(tracks[0].thumbnailURL)
      .setFooter(
        `${tracks.length} ${tracks.length > 1 ? "tracks" : "track"} queued ${
          tracks.length > 10 ? "(showing first 10)" : ""
        }`
      )
  );
};

interface sendRepeatProps {
  channel: GenericChannel;
  author: User;
  videoData: QueueItem;
}
export const sendRepeat = async ({
  channel,
  author,
  videoData: { title, url, thumbnailURL, duration },
}: sendRepeatProps) =>
  channel.send(
    withAuthorEmbed(author)
      .setTitle("Track will repeat!")
      .setDescription(trackLinkAndDuration({ title, url, duration }))
      .setThumbnail(thumbnailURL)
  );

export const sendSearchResults = (
  res: QueueItem[],
  channel: GenericChannel
) => {
  const urlTitles = res.map((videoData) =>
    toUrlString(videoData.title, videoData.url, 40)
  );

  channel.send(
    listEmbed(urlTitles)
      .setTitle("I found these tracks:")
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
