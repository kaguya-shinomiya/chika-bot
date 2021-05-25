import { PREFIX } from "../../constants";
import { detectiveEmbed, lightErrorEmbed } from "../../shared/embeds";
import { Command } from "../../types/command";
import { QueueItem } from "../../types/queue";
import { sendNotInGuild } from "./utils/embeds";

// TODO set max queue length
const queueEmbed = (tracks: QueueItem[]) => {
  let desc = "";
  tracks.reverse().forEach((track, i) => {
    desc += `\`${i + 1}\` [${track.title.substring(0, 40)}${
      track.title.length > 40 ? " ..." : ""
    }](${track.link})\n`;
  });
  return detectiveEmbed().setTitle("Tracks Queued").setDescription(desc);
};

const queue: Command = {
  name: "queue",
  description: "Display tracks in the queue.",
  aliases: ["q"],
  argsCount: 0,
  category: "Music",
  usage: `${PREFIX}queue`,
  execute({ channel, client, guild }) {
    if (!guild) {
      sendNotInGuild(channel);
      return;
    }

    const nowQueue = client.audioQueues.get(channel.id);
    if (!nowQueue) {
      channel.send(lightErrorEmbed("There are no tracks queued."));
      return;
    }

    channel.send(queueEmbed(nowQueue.queue));
  },
};

export default queue;
