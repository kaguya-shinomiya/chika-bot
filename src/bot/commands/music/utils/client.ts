import type { VoiceChannel, VoiceConnection } from 'discord.js';

export const tryToConnect = async (
  channel: VoiceChannel,
): Promise<VoiceConnection | null> =>
  channel
    .join()
    .then((conn) => conn)
    .catch(() => null);
