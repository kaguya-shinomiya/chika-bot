import { DMChannel, MessageEmbed, NewsChannel, TextChannel } from "discord.js";
import { chika_pink, chika_rap_png } from "../../constants";

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
