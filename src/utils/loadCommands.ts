import { Client, Collection } from "discord.js";
import fs from "fs";
import path from "path";
import { Command } from "../types/command";

export const loadCommands = (): Client["commands"] => {
  const commands = new Collection<string, Command>();
  const commandFolders = fs.readdirSync(path.join(__dirname, "..", "commands"));
  commandFolders.forEach((folder) => {
    const commandFiles = fs
      .readdirSync(path.join(__dirname, "..", "commands", folder))
      .filter((filename) => filename.endsWith(".js"));
    commandFiles.forEach((filename) => {
      const command: Command =
        require(`../commands/${folder}/${filename}`).default;
      commands.set(command.name, command);
    });
  });
  return commands;
};
