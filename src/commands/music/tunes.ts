import { MessageEmbed } from "discord.js";
import ytdl from "ytdl-core";
import { chika_crying_png } from "../../assets";
import { chika_pink, PREFIX } from "../../constants";
import { Command } from "../../types/command";
import { sendNowPlaying } from "./utils/embeds";
import { getVideoByLink, searchOneVideo } from "./utils/youtube";

const YOUTUBE_URL_RE = /^(https?:\/\/)?((www\.)?youtube\.com|youtu\.?be)\/.+$/;

const tunes: Command = {
  name: "tunes",
  usage: `${PREFIX}tunes [URL|search_string]`,
  argsCount: -1,
  category: "Music",
  description: "Let Chika play some music for you.",
  async execute({ channel, guild, member }, args) {
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
      if (!videoData) return; // TODO send invalid link message
    } else {
      const searchString = args.join(" ");
      [videoData] = (await searchOneVideo(searchString)).items;
      if (!videoData) return; // TODO send video not found message
      link = `https://www.youtube.com/watch?v=${videoData.id.videoId}`;
    }
    const connection = await member.voice.channel.join();
    connection.play(ytdl(link, { filter: "audioonly" }));
    sendNowPlaying(videoData, channel);
  },
};

export default tunes;
