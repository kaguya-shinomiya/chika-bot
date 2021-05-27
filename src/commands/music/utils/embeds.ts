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
      .replace("[", "\uFF3B")
      .replace("]", "\uFF3D")}](${link})`;
  }
  return `[${decodedTitle
    .substring(0, truncate)
    .replace("[", "\uFF3B")
    .replace("]", "\uFF3D")} ${title.length > truncate ? "..." : ""}](${link})`;
};

export const sendNowPlaying = async (
  channel: GenericChannel,
  { title, thumbnailURL, url }: QueueItem
) =>
  channel.send(
    baseEmbed()
      .setTitle("Now playing...")
      .setDescription(toUrlString(title, url))
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
  videoData,
  channel,
  author,
}: sendAddedToQueueProps) =>
  channel.send(
    withAuthorEmbed(author)
      .setTitle("Added to queue!")
      .setDescription(toUrlString(videoData.title, videoData.url))
      .setThumbnail(videoData.thumbnailURL)
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
    toUrlString(track.title, track.url, 50)
  );
  channel.send(
    listEmbed(urlTracks)
      .setTitle("Tracks Queued")
      .setThumbnail(tracks[0].thumbnailURL)
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
  videoData: { title, url, thumbnailURL },
}: sendRepeatProps) =>
  channel.send(
    withAuthorEmbed(author)
      .setTitle("Track will repeat!")
      .setDescription(toUrlString(title, url))
      .setThumbnail(thumbnailURL)
  );

export const sendSearchResults = (
  res: QueueItem[],
  channel: GenericChannel
) => {
  const urlTitles = res.map((videoData) =>
    toUrlString(videoData.title, videoData.url, 50)
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
