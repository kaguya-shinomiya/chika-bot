import { MessageEmbed } from "discord.js";
import ytdl from "ytdl-core";
import { chika_crying_png } from "../../assets";
import { chika_pink, PREFIX } from "../../constants";
import { Command } from "../../types/command";
import { sendAddedToQueue, sendNoVideo, sendNowPlaying } from "./utils/embeds";
import { getVideoByLink, searchOneVideo } from "./utils/youtube";

const YOUTUBE_URL_RE = /^(https?:\/\/)?((www\.)?youtube\.com|youtu\.?be)\/.+$/;

const tunes: Command = {
  name: "tunes",
  usage: `${PREFIX}tunes <URL|search_string>`,
  argsCount: -1,
  category: "Music",
  description: "Let Chika play some music for you.",
  async execute({ channel, guild, member, client }, args) {
    if (!guild) return;

    if (!member?.voice.channel) {
      channel.send(
        new MessageEmbed()
          .setColor(chika_pink)
          .setThumbnail(chika_crying_png)
          .setTitle("I can play music for you!")
          .setDescription("But you must join a voice channel first.")
      );
      return;
    }

    let link: string;
    let videoData: any;

    if (YOUTUBE_URL_RE.test(args[0])) {
      [link] = args;
      [videoData] = (await getVideoByLink(link)).items;
      if (!videoData) {
        sendNoVideo(link, channel);
        return;
      }
    } else {
      const searchString = args.join(" ");
      [videoData] = (await searchOneVideo(searchString)).items;
      if (!videoData) {
        sendNoVideo(searchString, channel);
        return;
      }
      link = `https://www.youtube.com/watch?v=${videoData.id.videoId}`;
    }

    // TODO check if we're already in a voice channel
    const connection = await member.voice.channel.join();
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

    const dispatcher = connection.play(ytdl(link, { filter: "audioonly" }));
    client.audioQueues.set(channel.id, { dispatcher, queue: [] });
    sendNowPlaying(channel, { videoData });

    const songFinishListener = () => {
      // TODO check if there are songs in queue
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
    };

    dispatcher.on("finish", songFinishListener); // register a listener

    // TODO error handling
    connection.on("disconnect", () => {
      client.audioQueues.delete(channel.id);
    });
  },
};

export default tunes;
