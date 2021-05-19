import { Command } from "@/types/command";

const avatar: Command = {
  name: "avatar",
  description: "Retrieves avatars for specified users.",
  execute({ mentions, author, channel }, _args) {
    if (!mentions.users.size) {
      channel.send(`${author.toString()}'s avatar`, {
        files: [
          author.displayAvatarURL({
            format: "png",
            dynamic: true,
          }),
        ],
      });
      return;
    }
    mentions.users.forEach((user) => {
      channel.send(`${user.toString()}'s avatar`, {
        files: [
          user.displayAvatarURL({
            format: "png",
            dynamic: true,
          }),
        ],
      });
    });
  },
};

export default avatar;
