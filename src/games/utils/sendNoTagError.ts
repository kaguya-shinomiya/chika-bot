import { DMChannel, MessageEmbed, NewsChannel, TextChannel } from "discord.js";
import { chika_pink } from "../../constants";
import { chika_rap_png } from "../../assets";

export const sendNoTagError = async (
  gameName: string,
  channel: TextChannel | DMChannel | NewsChannel,
  single: boolean
) => {
  channel.send(
    new MessageEmbed()
      .setColor(chika_pink)
      .setTitle("Rejected!")
      .setThumbnail(chika_rap_png)
      .setDescription(
        single
          ? `You must tag another user to play *${gameName}* with.`
          : `Tag some other users to play *${gameName}* with.`
      )
  );
};
