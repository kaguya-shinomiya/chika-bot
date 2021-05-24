import { MessageEmbed } from "discord.js";
import { chika_pink } from "../../../constants";
import { GenericChannel } from "../../../types/game";

export const sendNowPlaying = async (videoData: any, channel: GenericChannel) =>
  channel.send(
    new MessageEmbed()
      .setColor(chika_pink)
      .setTitle("Now playing")
      .setDescription(videoData.snippet.title)
      .setThumbnail(videoData.snippet.thumbnails.default.url)
  );
