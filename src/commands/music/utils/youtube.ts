import { StreamDispatcher, VoiceConnection } from "discord.js";
import ytdl from "ytdl-core";
import ytpl from "ytpl";
import ytsr, { Video } from "ytsr";
import { QueueItem } from "../../../types/queue";
import { secToMin } from "./helpers";

const YOUTUBE_URL_RE = /^(https?:\/\/)?((www\.)?youtube\.com|youtu\.?be)\/.+$/;

export const searchVideo = async (
  title: string,
  maxResults = 10
): Promise<QueueItem[] | null> => {
  const vFilter = (await ytsr.getFilters(title)).get("Type")!.get("Video")!;
  const videos = (await ytsr(vFilter.url!, { limit: maxResults }))
    .items as Video[];
  if (videos.length === 0) return null;
  return videos.map(
    (video) =>
      ({
        title: video.title,
        duration: video.duration,
        thumbnailURL: video.bestThumbnail.url,
        url: video.url,
      } as QueueItem)
  );
};

export const playFromYt = async (
  connection: VoiceConnection,
  url: string
): Promise<StreamDispatcher | null> =>
  ytdl
    .getInfo(url)
    .then((info) =>
      connection.play(
        ytdl.downloadFromInfo(info, {
          filter: "audioonly",
          // eslint-disable-next-line no-bitwise
          highWaterMark: 1 << 25,
        })
      )
    )
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err);
      return null;
    });

export const validateArgs = async (
  args: string[]
): Promise<QueueItem | null> => {
  if (YOUTUBE_URL_RE.test(args[0])) {
    const [url] = args;
    if (!ytdl.validateURL(url)) return null;
    let res: ytdl.videoInfo;
    try {
      res = await ytdl.getBasicInfo(url);
    } catch (err) {
      return null;
    }
    const { videoDetails } = res;
    if (!videoDetails) return null;
    return {
      title: videoDetails.title,
      duration: secToMin(parseInt(videoDetails.lengthSeconds, 10)),
      url: videoDetails.video_url,
      thumbnailURL: videoDetails.thumbnails[0].url,
    };
  }

  const res = await searchVideo(args.join(" "), 1);
  if (!res) return null;
  return { ...res[0] };
};

interface PlaylistMetadata {
  title: string;
  thumbnailURL: string;
  url: string;
}

export const parsePlaylist = (
  res: ytpl.Result
): [PlaylistMetadata, QueueItem[]] => {
  const metadata: PlaylistMetadata = {
    title: res.title,
    url: res.url,
    thumbnailURL: res.bestThumbnail.url!,
  };
  const items = res.items.map(
    (item): QueueItem => ({
      url: item.shortUrl,
      title: item.title,
      thumbnailURL: item.bestThumbnail.url!,
      duration: item.duration!,
    })
  );
  return [metadata, items];
};
