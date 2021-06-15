import { CmdCategory } from "@prisma/client";
import { prisma } from "../../data/prismaClient";
import { genericErrorEmbed } from "../../shared/embeds";
import { Command } from "../../types/command";
import { sendTop } from "./utils/embeds";

const globalTop = new Command({
  name: "global-top",
  description: `Track down the top 1%.`,
  args: [],
  category: CmdCategory.CURRENCY,
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
});

export default globalTop;
