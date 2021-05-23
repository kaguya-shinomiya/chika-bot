import { DMChannel, MessageEmbed, NewsChannel, TextChannel } from "discord.js";
import { chika_pink } from "../../constants";
import { chika_rap_png } from "../../assets";

export const sendNoGameSelectedEmbed = async (
  channel: TextChannel | DMChannel | NewsChannel
) => {
  channel.send(
    new MessageEmbed()
      .setColor(chika_pink)
      .setTitle("Rejected!")
      .setThumbnail(chika_rap_png)
      .setDescription("Tell me which game you wanna play, yo.")
  );
};
