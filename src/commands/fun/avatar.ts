import { Command, CommandCategory, PartialCommand } from "../../types/command";
import { genUsage } from "../../utils/genUsage";
import { avatarEmbed } from "./utils/embeds";

const avatar: PartialCommand = {
  name: "avatar",
  description: "Retrieves users' avatars.",
  category: CommandCategory.fun,
  args: [{ name: "user", optional: true, multi: true }],

  async execute(message) {
    const { mentions, author, channel } = message;
    if (!mentions.users.size) {
      channel.send(avatarEmbed(author));
      return;
    }
    mentions.users.forEach((user) => {
      channel.send(avatarEmbed(user));
    });
  },
};

genUsage(avatar);
export default avatar as Command;
