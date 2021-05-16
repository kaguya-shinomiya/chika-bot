import { Client } from "discord.js";
import dotenv from "dotenv-safe";
import { PREFIX } from "./constants";
dotenv.config();

const client = new Client();

client.once("ready", () => {
  console.log("ready!");
});

client.on("message", ({ content, channel, author, mentions, ...message }) => {
  if (!content.startsWith(PREFIX) || author.bot) return;

  const args = content.split(/ +/);
  const command = args.shift()?.toLowerCase().replace("ck!", "");

  switch (command) {
    case "ping":
      channel.send(`Yo ${author.toString()}, Love Detective Chika here.`);
      break;
    case "fight":
      if (!mentions.users.size) {
        // size attr returns 0 if the collection is empty
        channel.send("Tag the person you want to fight, yo.");
        return;
      }
      const taggedUser = mentions.users.first();
      channel.send(
        `${author.toString()} has challenged ${taggedUser?.toString()} to a fight!`
      );
      break;
    case "avatar":
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
      break;
    default:
      channel.send("I didn't understand that command.");
  }
});

client.login(process.env.APP_TOKEN);
