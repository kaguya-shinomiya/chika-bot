import { Client, Message } from "discord.js";
import { Redis } from "ioredis";
import { baseEmbed } from "../../../shared/embeds";
import { validateMessage } from "../../../shared/validateMessage";
import { GenericChannel } from "../../../types/command";
import { shuffle } from "../../../utils/shuffle";
import { toListString } from "../../../utils/text";
import { pingRedis } from "../../utils/helpers";
import { Job, jobs } from "../jobs";
import { HappyLifeStats } from "../lifeStats";

export const pickJob = (
  playerStats: HappyLifeStats,
  channel: GenericChannel,
  client: Client,
  redis: Redis
): Job | null => {
  const shuffledJobs = shuffle(jobs);
  const picks = shuffledJobs.slice(0, 3);

  channel.send(
    baseEmbed()
      .setTitle(`You consider these jobs:`)
      .setDescription(
        toListString(picks.map((pick) => `${pick.title} - $${pick.salary}`))
      )
      .setFooter(`Select the number for the job you'd like to choose.`)
  );

  let selectedJob: Job | null | undefined;

  // TODO set a time out to move on with no job if player does not respond

  const jobChoiceListener = async (message: Message) => {
    if (!(await pingRedis(redis, channel.id))) {
      selectedJob = null;
      return;
    }

    if (
      !validateMessage(message, {
        channelID: channel.id,
        userID: playerStats.userID,
      })
    )
      return;

    const res = parseInt(message.content, 10);
    if (Number.isNaN(res) || res > picks.length || res < 1) return;

    selectedJob = picks[res - 1];
    channel.send(
      `**${playerStats.username}** is now a **${selectedJob.title}**!`
    );
  };

  while (selectedJob === undefined) {
    client.once("message", jobChoiceListener);
  }

  return selectedJob;
};
