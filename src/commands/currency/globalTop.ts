import { prisma } from "../../data/prismaClient";
import { genericErrorEmbed } from "../../shared/embeds";
import { Command, CommandCategory, PartialCommand } from "../../types/command";
import { genUsage } from "../../utils/genUsage";
import { sendTop } from "./utils/embeds";

const globalTop: PartialCommand = {
  name: "global-top",
  description: `Track down the top 1%.`,
  args: [],
  category: CommandCategory.CURRENCY,
  aliases: ["gt"],

  async execute(message) {
    const { channel } = message;
    const top = await prisma.getGlobalTopRibbons();
    if (!top) {
      channel.send(genericErrorEmbed());
      return;
    }
    sendTop(channel, top);
  },
};

genUsage(globalTop);
export default globalTop as Command;
