import { DMChannel, MessageEmbed, NewsChannel, TextChannel } from "discord.js";
import { chika_pink } from "../../constants";
import { chika_crying_png } from "../../assets";

export const sendUnknownGameError = async (
  gameName: string,
  channel: TextChannel | DMChannel | NewsChannel
) => {
  channel.send(
    new MessageEmbed()
      .setColor(chika_pink)
      .setThumbnail(chika_crying_png)
      .setTitle("Sorry...")
      .setDescription(`I don't know how to play *${gameName}*.`)
  );
  // TODO return a list of playable games
};
