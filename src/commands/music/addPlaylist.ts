import ytpl from "ytpl";
import { DEFAULT_PREFIX } from "../../shared/constants";
import { queue } from "../../data/redisManager";
import { cryingEmbed, withAuthorEmbed } from "../../shared/embeds";
import { Command, CommandCategory } from "../../types/command";
import { sendMusicOnlyInGuild, toUrlString } from "./utils/embeds";
import { parsePlaylist } from "./utils/youtube";

const addPlaylist: Command = {
  name: "add-playlist",
  argsCount: 1,
  aliases: ["ap"],
  category: CommandCategory.music,
  description: "Add a YouTube playlist to the queue.",
  usage: `${DEFAULT_PREFIX}addp <url>`,
  execute(message, args) {
    const { guild, channel, author } = message;
    if (!guild) {
      sendMusicOnlyInGuild(channel);
      return;
    }
    const [playlistURL] = args;
    ytpl(playlistURL)
      .then((res) => {
        const [playlistMetadata, videos] = parsePlaylist(res);
        queue.rpush(guild.id, ...videos.map((video) => JSON.stringify(video)));
        channel.send(
          withAuthorEmbed(author)
            .setTitle("Added Playlist")
            .setDescription(
              `${toUrlString(playlistMetadata.title, playlistMetadata.url, 40)}`
            )
            .setThumbnail(playlistMetadata.thumbnailURL)
        );
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
