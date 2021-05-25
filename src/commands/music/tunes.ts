import ytdl from "ytdl-core";
import { PREFIX } from "../../constants";
import { Command } from "../../types/command";
import {
  sendAddedToQueue,
  sendNotInVoiceChannel,
  sendNoVideo,
  sendNowPlaying,
} from "./utils/embeds";
import { checkValidSearch } from "./utils/youtube";

const tunes: Command = {
  name: "tunes",
  usage: `${PREFIX}tunes <URL|search_string>`,
  argsCount: -1,
  category: "Music",
  description: "Let Chika play some music for you.",
  async execute({ channel, guild, member, client }, args) {
    if (!guild) return;

    if (!member?.voice.channel) {
      sendNotInVoiceChannel(channel);
      return;
    }

    const videoInfo = await checkValidSearch(args);
    if (!videoInfo) {
      sendNoVideo(args.join(" "), channel);
      return;
    }
    const [link, videoData] = videoInfo;

    const queue = client.audioQueues.get(channel.id);
    if (queue) {
      queue.queue.unshift({
        link,
        title: videoData.snippet.title,
        thumbnailLink: videoData.snippet.thumbnails.default.url,
      });
      sendAddedToQueue(videoData, channel);
      return;
    }

    // TODO check if we're already in a voice channel?
    const connection = await member.voice.channel.join();

    const dispatcher = connection.play(ytdl(link, { filter: "audioonly" }));
    client.audioQueues.set(channel.id, { dispatcher, queue: [] });
    sendNowPlaying(channel, { videoData });

    const songFinishListener = () => {
      const nowQueue = client.audioQueues.get(channel.id)!;
      if (!nowQueue.queue.length) {
        nowQueue.dispatcher.destroy();
        connection.disconnect();
        client.audioQueues.delete(channel.id);
        return;
      }

      const { title, thumbnailLink, link: nextLink } = nowQueue.queue.pop()!;
      sendNowPlaying(channel, {
        title,
        thumbnailLink,
      });
      nowQueue.dispatcher = connection.play(
        ytdl(nextLink, { filter: "audioonly" })
      );
      nowQueue.dispatcher.on("finish", songFinishListener); // another one
      // TODO handle errors for dispatcher
    };

    dispatcher.on("finish", songFinishListener); // register a listener

    // TODO error handling
    connection.on("disconnect", () => {
      client.audioQueues.delete(channel.id);
    });
  },
};

export default tunes;
