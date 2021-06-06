import { PREFIX } from "../../constants";
import { lightErrorEmbed } from "../../shared/embeds";
import { Command } from "../../types/command";
import { QueueItem } from "../../types/queue";
import { RedisPrefix } from "../../types/redis";
import { tryToConnect } from "./utils/client";
import {
  sendAddedToQueue,
  sendMusicOnlyInGuild,
  sendNotInVoiceChannel,
  sendNoVideo,
  sendNoVoicePermissions,
} from "./utils/embeds";
import { createFinishListener, playThis } from "./utils/listener";
import { validateArgs } from "./utils/youtube";

const play: Command = {
  name: "play",
  aliases: ["tunes"],
  usage: `${PREFIX}tunes <URL|search_string>`,
  argsCount: -1,
  category: "Music",
  description: "Let Chika play some music from YouTube for you.",
  redis: RedisPrefix.tracks,
  async execute(message, args, redis) {
    const { channel, member, guild, client, author } = message;
    if (!guild) {
      sendMusicOnlyInGuild(channel);
      return;
    }
    if (!member?.voice.channel) {
      sendNotInVoiceChannel(channel);
      return;
    }

    const next = await redis.lpop(guild.id);
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
      playThis({
        videoData: nextData,
        connection,
        channel,
        client,
        guildId: guild.id,
        onFinish: createFinishListener({ channel, client, guild, redis }),
      });
      return;
    }

    if (next) redis.lpush(guild.id, next); // push next track back

    const videoData = await validateArgs(args);
    if (!videoData) {
      sendNoVideo(args.join(" "), channel);
      return;
    }

    // there's a song playing
    // push to the redis queue
    if (audioUtils) {
      redis.rpush(guild.id, JSON.stringify(videoData));
      sendAddedToQueue({ videoData, author, channel });
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
    playThis({
      videoData,
      channel,
      client,
      connection,
      guildId: guild.id,
      onFinish: createFinishListener({ channel, client, guild, redis }),
    });
  },
};

export default play;
