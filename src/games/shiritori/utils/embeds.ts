import { baseEmbed } from "../../../shared/embeds";
import type { ShiritoriState } from "./types";
import { genCardsString } from "./cards";

export const shiritoriPlayerCardsEmbed = ({ p1, p2, cards }: ShiritoriState) =>
  baseEmbed()
    .setTitle("Your cards!")
    .addFields([
      {
        name: `**${p1.username}**'s cards`,
        value: genCardsString(cards.get(p1.id)!),
      },
      {
        name: `**${p2.username}**'s cards`,
        value: genCardsString(cards.get(p2.id)!),
      },
    ]);
