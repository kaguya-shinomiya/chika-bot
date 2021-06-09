import { PREFIX } from "../../types/constants";
import { queue } from "../../data/redisManager";
import { lightErrorEmbed } from "../../shared/embeds";
import { Command } from "../../types/command";
import { QueueItem } from "../../types/queue";
import { tryToConnect } from "./utils/client";
import {
  sendAddedToQueue,
  sendMusicOnlyInGuild,
  sendNotInVoiceChannel,
  sendNoVideo,
  sendNoVoicePermissions,
} from "./utils/embeds";
import { createFinishListener } from "./utils/listener";
import { playThis, validateArgs } from "./utils/youtube";

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
      sendMusicOnlyInGuild(channel);
      return;
    }
    if (!member?.voice.channel) {
      sendNotInVoiceChannel(channel);
      return;
    }

    const next = await queue.lpop(guild.id);
    const audioUtils = client.cache.audioUtils.get(guild.id);

    // they called ck;play with no args
    if (args.length === 0) {
      if (!next) {
        channel.send(
          lightErrorEmbed("There are no songs in the queue for me to play.")
        );
        return;
      }
      if (audioUtils) {
        channel.send(lightErrorEmbed("I'm already playing some music!"));
        return;
      }
      const connection = await tryToConnect(member.voice.channel);
      if (!connection) {
        sendNoVoicePermissions(channel);
        return;
      }
      connection.on("disconnect", () =>
        client.cache.audioUtils.delete(guild.id)
      );
      const nextData = JSON.parse(next) as QueueItem;
      playThis(connection, nextData, {
        channel,
        client,
        guildId: guild.id,
        onFinish: createFinishListener(guild, {
          client,
          channel,
        }),
      });
      return;
    }

    if (next) queue.lpush(guild.id, next); // push next track back

    const videoData = await validateArgs(args);
    if (!videoData) {
      sendNoVideo(channel, args.join(" "));
      return;
    }

    // there's a song playing
    // push to the redis queue
    if (audioUtils) {
      queue.rpush(guild.id, JSON.stringify(videoData));
      sendAddedToQueue(channel, { videoData, author });
      return;
    }

    // nothing is playing now
    // start playing
    const connection = await tryToConnect(member.voice.channel);
    if (!connection) {
      sendNoVoicePermissions(channel);
      return;
    }
    connection.on("disconnect", () => client.cache.audioUtils.delete(guild.id));
    playThis(connection, videoData, {
      channel,
      client,
      guildId: guild.id,
      onFinish: createFinishListener(guild, { channel, client }),
    });
  },
};

export default play;
