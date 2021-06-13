import { Command, CommandCategory } from "../../types/command";
import { avatarEmbed } from "./utils/embeds";

const avatar = new Command({
  name: "avatar",
  description: "Retrieves users' avatars.",
  category: CommandCategory.FUN,
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
});

export default avatar;
