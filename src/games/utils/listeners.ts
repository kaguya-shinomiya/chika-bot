import { Client, Message } from "discord.js";
import { KeyType, Redis } from "ioredis";
import { lightErrorEmbed } from "../../shared/embeds";
import { STOP_GAME } from "./constants";

export const pingRedis = async (redis: Redis, key: KeyType) => redis.get(key);

export const registerStopListener = (
  client: Client,
  channelID: string,
  redis: Redis
) => {
  const stopListener = async (_message: Message) => {
    if (!(await pingRedis(redis, channelID))) return; // check if game session is still valid
    if (
      channelID === _message.channel.id &&
      _message.content.toLowerCase().trim() === STOP_GAME &&
      !_message.author.bot
    ) {
      _message.channel.send(
        lightErrorEmbed(`**${_message.author.username}** has stopped the game.`)
      );
      redis.del(channelID);
      return;
    }
    _message.client.once("message", stopListener);
  };

  client.once("message", stopListener);
};
