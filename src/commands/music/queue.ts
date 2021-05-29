import { PREFIX } from "../../constants";
import { lightErrorEmbed } from "../../shared/embeds";
import { Command } from "../../types/command";
import { sendNotInGuild, sendQueued } from "./utils/embeds";

const queue: Command = {
  name: "queue",
  description: "Display tracks in the queue.",
  aliases: ["q"],
  argsCount: 0,
  category: "Music",
  usage: `${PREFIX}queue`,
  async execute({ channel, client, guild }) {
    if (!guild) {
      sendNotInGuild(channel);
      return;
    }

    const nowQueue = client.audioQueues.get(guild.id);
    if (!nowQueue || (nowQueue.queue.length === 0 && !nowQueue.nowPlaying)) {
      channel.send(lightErrorEmbed("There are no tracks queued."));
      return;
    }

    sendQueued({
      channel,
      tracks: nowQueue.queue,
      nowPlaying: nowQueue.nowPlaying,
      isPaused: nowQueue.dispatcher?.paused,
      current: nowQueue.dispatcher?.streamTime,
    });
  },
};

export default queue;
