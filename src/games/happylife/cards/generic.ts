import { next } from "../utils/next";
import { LifeCardInfo } from "./types";

export const genericCards: LifeCardInfo[] = [
  {
    type: "Bad luck",
    name: "Instant death",
    description: "Die and take the last place.",
    onLand: (state, message, redis) => {
      const thisPlayer = state.playOrder[state.toPlay];

      message.channel.send(
        `**${thisPlayer.username}** dies from unknown causes. GG.`
      );

      // state.playOrder.splice(state.toPlay, 1);

      next(state, message, redis);
    },
  },
  {
    type: "Bad luck",
    name: "Traffic accident",
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
    name: "Win a lucky draw.",
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
];
