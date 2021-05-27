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
// TODO add add-playlist command

// TODO use ytdl.getInfo if url is given
// TODO optimize GET calls to only return fields we want

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

    // case 1: there is a queue obj + no args
    if (queue && args.length === 0) {
      // case 1a: but the queue is empty
      if (queue.queue.length === 0) {
        channel.send(lightErrorEmbed("There are no songs for me to play."));
        return;
      }
      // case 1b: queue is alr at max length
      const canAdd = isWithinQueueLength(channel, queue);
      if (!canAdd) return;

      // case 1c: can add to queue
      const connection = await member.voice.channel.join();
      queue.nowPlaying = queue.queue.shift()!;
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

    // case 2: no queue + no args
    if (!queue && args.length === 0) {
      channel.send(lightErrorEmbed("There are no songs for me to play."));
      return;
    }

    // case 3: no queue + args
    const videoInfo = await checkValidSearch(args);
    if (!videoInfo) {
      sendNoVideo(args.join(" "), channel);
      return;
    }
    const [link, videoData] = videoInfo;

    if (queue) {
      queue.queue.push({
        link,
        ...extractVideoData(videoData),
      });
      sendAddedToQueue({ videoData, author, channel, link });
      return;
    }

    // TODO self disconnect if no one in VC for some time

    // TODO abstract this to a higher order function
    // there are 2 scenarios for playing a song - from scratch, or with a queue

    const connection = await member.voice.channel.join();
    const dispatcher = playFromYt(connection, link);
    client.audioQueues.set(guild.id, {
      dispatcher,
      queue: [],
      nowPlaying: {
        link,
        title: videoData.snippet.title,
        thumbnailLink: videoData.snippet.thumbnails.default.url,
      },
    });
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
