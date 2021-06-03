import { LifeCard, next } from "./types";

export const genericCards: LifeCard[] = [
  // {
  //   type: "Bad luck",
  //   name: "Instant death",
  //   description: "Die and take the last place.",
  //   onLand: () => {},
  // },
  // {
  //   type: "Bad luck",
  //   name: "Traffic accident",
  //   description: "You run into a traffic accident!",
  //   onLand: () => {},
  // },
  {
    type: "Lucky",
    name: "Win a lucky draw.",
    description: "You win a lucky draw!",
    onLand: (state, message) => {
      const thisPlayer = state.playOrder[state.toPlay];
      const thisPlayerStats = state.stats.get(thisPlayer.id)!;
      const cash = Math.floor(Math.random() * 10000);
      thisPlayerStats.netWorth += cash;
      message.channel.send(`**${thisPlayer.username}** won $${cash}!`);

      next(state, message);
      // TODO go to next
      // toPlay should be an index that keeps track of the position in queue
      // send message for next player to roll (attach listener)
      // move that player and execute onLand for that tile
    },
  },
];
