import { Command } from "@/types/command";

const goodnight: Command = {
  name: "goodnight",
  description: "Greets goodnight.",
  aliases: ["gn"],
  execute({ channel }, _args) {
    channel.send("Goodnight!", {
      files: [
        "https://i.pinimg.com/originals/41/72/fa/4172fa1b40d8aba47a6c9b2e79b0c565.gif",
      ],
    });
  },
};

export default goodnight;
