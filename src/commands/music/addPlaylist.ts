import ytpl from "ytpl";
import { PREFIX } from "../../constants";
import { cryingEmbed, withAuthorEmbed } from "../../shared/embeds";
import { Command } from "../../types/command";
import { sendNotInGuild, toUrlString } from "./utils/embeds";
import { createQueueIfNotExists } from "./utils/client";
import { parsePlaylist } from "./utils/youtube";

const addPlaylist: Command = {
  name: "add-playlist",
  argsCount: 1,
  aliases: ["ap"],
  category: "Music",
  description: "Add a YouTube playlist to the queue.",
  usage: `${PREFIX}addp <url>`,
  execute(message, args) {
    const { guild, channel, client, author } = message;
    if (!guild) {
      sendNotInGuild(channel);
      return;
    }
    const [playlistURL] = args;
    ytpl(playlistURL)
      .then((res) => {
        const [playlistMetadata, videos] = parsePlaylist(res);
        channel.send(
          withAuthorEmbed(author)
            .setTitle("Added Playlist")
            .setDescription(
              `${toUrlString(playlistMetadata.title, playlistMetadata.url, 40)}`
            )
            .setThumbnail(playlistMetadata.thumbnailURL)
        );

        const queue = createQueueIfNotExists(client, guild.id);
        queue.queue.push(...videos);
      })
      .catch(() =>
        channel.send(
          cryingEmbed()
            .setTitle("Sorry...")
            .setDescription(
              `I couldn't find a playlist at ${toUrlString(
                playlistURL,
                playlistURL,
                40
              )}`
            )
            .addField("\u200b", "It might be a private playlist?")
        )
      );
  },
};

export default addPlaylist;
