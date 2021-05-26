import { PREFIX } from "../../constants";
import { lightErrorEmbed } from "../../shared/embeds";
import { Command } from "../../types/command";
import { isWithinQueueLength } from "./utils/checks";
import {
  sendAddedToQueue,
  sendNotInGuild,
  sendNotInVoiceChannel,
  sendNoVideo,
  sendNowPlaying,
} from "./utils/embeds";
import { createFinishListener } from "./utils/listener";
import {
  checkValidSearch,
  extractVideoData,
  playFromYt,
} from "./utils/youtube";

// TODO add nowplaying command
// TODO add repeat command
// TODO add add-playlist command

const play: Command = {
  name: "play",
  aliases: ["tunes"],
  usage: `${PREFIX}tunes <URL|search_string>`,
  argsCount: -1,
  category: "Music",
  description: "Let Chika play some music from YouTube for you.",
  async execute(message, args) {
    const { channel, member, guild, client, author } = message;
    if (!guild) {
      sendNotInGuild(channel);
      return;
    }
    if (!member?.voice.channel) {
      sendNotInVoiceChannel(channel);
      return;
    }
    const queue = client.audioQueues.get(guild.id);

    if (queue && args.length === 0) {
      const canAdd = isWithinQueueLength(channel, queue);
      if (!canAdd) return;

      const connection = await member.voice.channel.join();
      queue.nowPlaying = queue.queue.pop()!;
      const { link, thumbnailLink, title } = queue.nowPlaying;
      sendNowPlaying(channel, {
        title,
        thumbnailLink,
        link,
      });
      queue.dispatcher = playFromYt(connection, link);
      queue.dispatcher.on(
        "finish",
        createFinishListener({ connection, channel, client, guild })
      );
      // TODO handle errors for dispatcher
      // TODO this is the same logic as createFinishListener
      return;
    }

    if (!queue && args.length === 0) {
      channel.send(lightErrorEmbed("There are no songs for me to play."));
      return;
    }

    const videoInfo = await checkValidSearch(args);
    if (!videoInfo) {
      sendNoVideo(args.join(" "), channel);
      return;
    }
    const [link, videoData] = videoInfo;

    if (queue) {
      queue.queue.unshift({
        link,
        ...extractVideoData(videoData),
      });
      sendAddedToQueue({ videoData, author, channel, link });
      return;
    }

    // TODO check if we're already in a voice channel?
    // TODO self disconnect if no one in VC for some time
    const connection = await member.voice.channel.join();
    const dispatcher = playFromYt(connection, link);
    client.audioQueues.set(guild.id, { dispatcher, queue: [] });
    sendNowPlaying(channel, { videoData, link });

    dispatcher.on(
      "finish",
      createFinishListener({ channel, client, connection, guild })
    ); // register a listener

    // TODO error handling
    connection.on("disconnect", () => {
      client.audioQueues.delete(guild.id);
    });
  },
};

export default play;
