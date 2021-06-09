import type { Collection, User } from "discord.js";
import { ribbon_emoji } from "../../../assets";
import { baseEmbed } from "../../../shared/embeds";
import { GenericChannel } from "../../../types/command";
import { toListString } from "../../music/utils/embeds";

export const sendRibbonStock = (
  channel: GenericChannel,
  stock: Collection<User, string | null>
) => {
  const lines = stock.map(
    (count, user) => `${user.toString()}: ${count || 0} ${ribbon_emoji}`
  );
  channel.send(
    baseEmbed().setDescription(toListString(lines, { noNum: true }))
  );
};
