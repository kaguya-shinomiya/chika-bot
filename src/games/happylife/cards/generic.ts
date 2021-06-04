import { next } from "../utils/next";
import { LifeCardInfo } from "./types";

export const genericCards: LifeCardInfo[] = [
  {
    type: "Bad Luck",
    name: "Instant Death",
    description: "Die and take the last place.",
    onLand: (state, message, redis) => {
      const thisPlayer = state.playOrder[state.toPlay];
      const thisPlayerStats = state.stats.get(thisPlayer.id)!;

      message.channel.send(
        `
In Chika's original game, **${thisPlayer.username}** would have just died and been booted from the game.
In this version, you are just reset to the first card.`
      );

      thisPlayerStats.cursor = 0;

      next(state, message, redis);
    },
  },
  {
    type: "Bad Luck",
    name: "Traffic Accident",
    description: "You run into a traffic accident!",
    onLand: (state, message, redis) => {
      const thisPlayer = state.playOrder[state.toPlay];
      const thisPlayerStats = state.stats.get(thisPlayer.id)!;
      const medicalFees = Math.floor(Math.random() * 1000 + 4000);
      thisPlayerStats.netWorth -= medicalFees;
      message.channel.send(
        `**${thisPlayer.username}** pays $${medicalFees} in hospital bills.`
      );
      next(state, message, redis);
    },
  },
  {
    type: "Lucky",
    name: "Win a Lucky Draw",
    description: "You win a lucky draw!",
    onLand: (state, message, redis) => {
      const thisPlayer = state.playOrder[state.toPlay];
      const thisPlayerStats = state.stats.get(thisPlayer.id)!;
      const cash = Math.floor(Math.random() * 10000);
      thisPlayerStats.netWorth += cash;
      message.channel.send(`**${thisPlayer.username}** won $${cash}!`);

      next(state, message, redis);
    },
  },
  {
    type: "Pet",
    name: "Adopt a Pet",
    description: "You go to the local shelter and adopt a pet.",
    onLand: (state, message, redis) => {
      const thisPlayer = state.playOrder[state.toPlay];
      const thisPlayerStats = state.stats.get(thisPlayer.id)!;
      const cash = Math.floor(Math.random() * 10000);
      thisPlayerStats.netWorth += cash;
      message.channel.send(`**${thisPlayer.username}** won $${cash}!`);

      next(state, message, redis);
    },
  },
];
