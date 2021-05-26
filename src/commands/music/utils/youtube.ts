import axios from "axios";
import { StreamDispatcher, VoiceConnection } from "discord.js";
import he from "he";
import ytdl from "ytdl-core";
import { QueueItem } from "../../../types/queue";

const YOUTUBE_URL_ID_RE = /youtu(?:.*\/v\/|.*v=|\.be\/)([A-Za-z0-9_-]{11})/;
const YOUTUBE_URL_RE = /^(https?:\/\/)?((www\.)?youtube\.com|youtu\.?be)\/.+$/;

export const getVideoByLink = (link: string) => {
  const vid = link.match(YOUTUBE_URL_ID_RE)![1];
  return axios
    .get("https://youtube.googleapis.com/youtube/v3/videos", {
      params: { part: "snippet", id: vid, key: process.env.YOUTUBE_API_KEY },
    })
    .then((response) => response.data);
};

export const searchOneVideo = (title: string) =>
  axios
    .get("https://youtube.googleapis.com/youtube/v3/search", {
      params: {
        key: process.env.YOUTUBE_API_KEY,
        part: "snippet",
        q: title,
        maxResults: 1,
      },
    })
    .then((response) => response.data);

export const checkValidSearch = async (
  args: string[]
): Promise<[string, any] | null> => {
  let link: string;
  let videoData: any;
  if (YOUTUBE_URL_RE.test(args[0])) {
    [link] = args;
    [videoData] = (await getVideoByLink(link)).items;
    if (!videoData) {
      return null;
    }
  } else {
    const searchString = args.join(" ");
    [videoData] = (await searchOneVideo(searchString)).items;
    if (!videoData) {
      return null;
    }
    link = `https://www.youtube.com/watch?v=${videoData.id.videoId}`;
  }
  return Promise.resolve([link, videoData]);
};

export const extractVideoData = (videoData: any): Omit<QueueItem, "link"> => ({
  title: he.decode(videoData.snippet.title),
  thumbnailLink: videoData.snippet.thumbnails.default.url,
});

export const playFromYt = (
  connection: VoiceConnection,
  link: string
): StreamDispatcher =>
  // eslint-disable-next-line no-bitwise
  connection.play(ytdl(link, { filter: "audioonly", highWaterMark: 1 << 25 }));
