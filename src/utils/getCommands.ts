import { Client, Collection } from "discord.js";
import fs from "fs";
import path from "path";
import { Command } from "@/types/command";

export const getCommands = (): Client["commands"] => {
  const commands = new Collection<string, Command>();
  const commandFiles = fs
    .readdirSync(path.join(__dirname, "../commands"))
    .filter((filename) => filename.endsWith(".js"));
  commandFiles.forEach((filename) => {
    const command: Command = require(`../commands/${filename}`).default;
    commands.set(command.name, command);
  });
  return commands;
};
