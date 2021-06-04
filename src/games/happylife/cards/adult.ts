import { next } from "../utils/next";
import { pickJob } from "../utils/pickJob";
import { LifeCardInfo } from "./types";

export const adultCards: LifeCardInfo[] = [
  {
    name: "Lose Your Job",
    description: "A new manager is hired and doesn't like you.",
    type: "Career",
    onLand(state, message, redis) {
      const thisPlayer = state.playOrder[state.toPlay];
      const thisPlayerStats = state.stats.get(thisPlayer.id)!;

      if (!thisPlayerStats.job) {
        message.channel.send(
          `But **${thisPlayer.username}** doesn't have a job! LOL! Nothing happens.`
        );
      } else {
        message.channel.send(
          `**${thisPlayer.username}** is no longer a ${thisPlayerStats.job}.`
        );
        thisPlayerStats.job = undefined;
      }

      next(state, message, redis);
    },
  },
  {
    name: "Mid-Career Switch",
    description: "You see no future in your current career track.",
    type: "Career",
    onLand(state, message, redis) {
      const thisPlayer = state.playOrder[state.toPlay];
      const thisPlayerStats = state.stats.get(thisPlayer.id)!;

      // TODO show jobs to choose from
      pickJob(thisPlayerStats, message.channel, message.client, redis);

      next(state, message, redis);
    },
  },
];
