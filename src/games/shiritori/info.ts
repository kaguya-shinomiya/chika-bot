import { shiritori_rules_png } from "../../assets";
import { baseEmbed } from "../../shared/embeds";

export const shiritoriInfo = baseEmbed()
  .setTitle("Shiritori")
  .addFields([
    {
      name: "How it works",
      value: `
      Each player is issued 5 cards.
      
      You must form a word which a) starts 
      with the last played card, and b) ends
      on one of your cards.
      
      The game will start with a random card.
      `,
    },
    {
      name: "To win",
      value: `Be the first to clear all 5 cards!`,
    },
  ])
  .setImage(shiritori_rules_png);
