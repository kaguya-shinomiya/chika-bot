import { Command, PartialCommand } from "../types/command";

export const genUsage = (command: PartialCommand) => {
  const { name, args } = command;
  const usage = `${name} ${args
    .map((arg) => {
      if (!arg.optional) return `<${arg.name}>`;
      if (arg.optional && !arg.multi) return `[${arg.name}]`;
      return `[${arg.name} ...]`;
    })
    .join(" ")}`;
  // eslint-disable-next-line no-param-reassign
  (command as Command).usage = usage;
};
