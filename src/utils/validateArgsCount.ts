import { lightErrorEmbed } from '../shared/embeds';
import { Command, GenericChannel } from '../types/command';

export function validateArgsCount(
  command: Command,
  args: string[],
  channel: GenericChannel,
): string[] | null {
  let softMax = 0;
  let hasNoMulti = true;
  command.args.forEach((arg) => {
    if (!arg.optional) softMax += 1;
    if (arg.optional && !arg.multi) softMax += 1;
    if (arg.multi) hasNoMulti = false;
  });

  const min = command.args.filter((arg) => !arg.optional).length;
  const hasNoOptional = min === command.args.length;

  const provided = args.length;

  // only non-optional args
  // but either failed to give exact or gave too little
  if (
    hasNoOptional &&
    ((hasNoMulti && provided !== min) || (!hasNoMulti && provided < min))
  ) {
    channel.send(
      lightErrorEmbed(
        `Command **${command.name}** expected ${min} ${
          min === 1 ? 'argument' : 'arguments'
        } but got ${provided}.
        Use \`help ${command.name}\` to see usage info.`,
      ),
    );
    return null;
  }

  // has optional but gave less than min
  if (!hasNoOptional && provided < min) {
    channel.send(
      lightErrorEmbed(
        `Command **${command.name}** expected at least ${min} ${
          min === 1 ? 'argument' : 'arguments'
        } but got ${provided}.
        Use \`help ${command.name}\` to see usage info.`,
      ),
    );
    return null;
  }

  // has optional and no multi and gave more than soft cap
  if (!hasNoOptional && hasNoMulti && provided > softMax) {
    channel.send(
      lightErrorEmbed(
        `Command **${command.name}** expected at most ${softMax} ${
          softMax === 1 ? 'argument' : 'arguments'
        } but got ${provided}.
        Use \`help ${command.name}\` to see usage info.`,
      ),
    );
    return null;
  }

  return args;
}
