import { PREFIX } from "../../constants";
import { Command } from "../../types/command";

const queue: Command = {
  name: "queue",
  description: "Display songs in the queue.",
  argsCount: 0,
  category: "Music",
  usage: `${PREFIX}queue`,
  execute() {},
};

export default queue;
