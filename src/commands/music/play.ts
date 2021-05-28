import { StreamDispatcher } from "discord.js";
import { PREFIX } from "../../constants";
import { lightErrorEmbed } from "../../shared/embeds";
import { Command } from "../../types/command";
import { tryToConnect } from "./utils/client";
import {
  sendAddedToQueue,
  sendCannotPlay,
  sendNotInGuild,
  sendNotInVoiceChannel,
  sendNoVideo,
  sendNoVoicePermissions,
  sendNowPlaying,
} from "./utils/embeds";
import { createFinishListener } from "./utils/listener";
import { playFromYt, validateArgs } from "./utils/youtube";

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

      // case 1b: queue has something
      const connection = await tryToConnect(member.voice.channel);
      if (!connection) {
        sendNoVoicePermissions(channel);
        return;
      }
      queue.nowPlaying = queue.queue.shift()!;
      const finishListener = createFinishListener({
        connection,
        channel,
        guild,
        client,
      });
      const { title, url } = queue.nowPlaying;
      try {
        queue.dispatcher = await playFromYt(connection, url);
        sendNowPlaying(channel, queue.nowPlaying);
        queue.dispatcher.on("finish", finishListener);
      } catch (err) {
        sendCannotPlay(title, url, channel);
        finishListener();
        return;
      }
    }

    // case 2: no queue + no args
    if (!queue && args.length === 0) {
      channel.send(lightErrorEmbed("There are no songs for me to play."));
      return;
    }

    // case 3: no queue + args
    const videoData = await validateArgs(args);
    if (!videoData) {
      sendNoVideo(args.join(" "), channel);
      return;
    }

    if (queue) {
      queue.queue.push(videoData);
      sendAddedToQueue({ videoData, author, channel });
      return;
    }

    const connection = await tryToConnect(member.voice.channel);
    if (!connection) {
      sendNoVoicePermissions(channel);
      return;
    }
    let dispatcher: StreamDispatcher;
    try {
      dispatcher = await playFromYt(connection, videoData.url);
    } catch (err) {
      sendCannotPlay(videoData.title, videoData.url, channel);
      return;
    }
    client.audioQueues.set(guild.id, {
      dispatcher,
      queue: [],
      nowPlaying: videoData,
    });

    sendNowPlaying(channel, videoData);
    dispatcher.on(
      "finish",
      createFinishListener({ channel, client, connection, guild })
    );

    // TODO error handling
    connection.on("disconnect", () => {
      client.audioQueues.delete(guild.id);
    });
  },
};

export default play;
