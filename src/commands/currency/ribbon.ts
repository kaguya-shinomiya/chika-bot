import { Collection, User } from "discord.js";
import { DEFAULT_PREFIX } from "../../shared/constants";
import { ribbons } from "../../data/redisManager";
import { Command } from "../../types/command";
import { sendRibbonStock } from "./utils/embeds";

export const ribbon: Command = {
  name: "ribbon",
  description: "Check how many ribbons you have.",
  argsCount: -1,
  category: "Currency",
  aliases: ["r"],
  usage: `${DEFAULT_PREFIX}ribbon [user ...]`,
  async execute(message) {
    const { mentions, author, channel } = message;
    const taggedUsers = mentions.users;
    const ribbonStock = new Collection<User, string | null>();

    if (!taggedUsers.size) {
      const authorRibbons = await ribbons.get(author.id);
      ribbonStock.set(author, authorRibbons);
    } else {
      const stocks = await ribbons.mget(taggedUsers.map((_user, id) => id));
      taggedUsers.forEach((user) => ribbonStock.set(user, stocks.shift()!));
    }

    sendRibbonStock(channel, ribbonStock);
  },
};

export default ribbon;
