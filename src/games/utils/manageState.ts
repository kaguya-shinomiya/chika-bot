/* eslint-disable prefer-promise-reject-errors */
import type { Message } from "discord.js";
import { BlockingLevel } from "../../types/blockingLevel";
import type { Game } from "../../types/game";

export const checkAndBlock = (game: Game, message: Message): Promise<void> => {
  const {
    guild,
    channel,
    client: {
      cache: { inGameStates },
    },
  } = message;

  let inGame;

  switch (game.blockingLevel) {
    case BlockingLevel.channel:
      inGame = inGameStates.get(channel.id);
      if (inGame)
        return Promise.reject(
          `There is already a game of **${inGame}** being played in this channel.`
        );
      inGameStates.set(channel.id, game.displayTitle);
      break;
    case BlockingLevel.guild:
      if (!guild)
        return Promise.reject(
          `${game.displayTitle} can only be played in a guild.`
        );
      inGame = inGameStates.get(guild.id);
      if (inGame)
        return Promise.reject(
          `There is already a game of **${inGame}** being played in this server.`
        );
      inGameStates.set(guild.id, game.displayTitle);
      break;
    case BlockingLevel.selfChannel:
      inGame = inGameStates.get(`${game.title}:${channel.id}`);
      if (inGame)
        return Promise.reject(
          `There is already a game of **${inGame}** being played in this channel.`
        );
      inGameStates.set(`${game.title}:${channel.id}`, game.displayTitle);
      break;
    case BlockingLevel.selfGuild:
      if (!guild)
        return Promise.reject(
          `${game.displayTitle} can only be played in a guild.`
        );
      inGame = inGameStates.get(`${game.title}:${guild.id}`);
      if (inGame)
        return Promise.reject(
          `There is already a game of **${inGame}** being played in this channel.`
        );
      inGameStates.set(`${game.title}:${guild.id}`, game.displayTitle);
      break;
    default:
      break;
  }
  return Promise.resolve();
};

export const isGameActive = (game: Game, message: Message): boolean => {
  const {
    client: {
      cache: { inGameStates },
    },
    channel,
    guild,
  } = message;
  let gameActive: boolean = false;
  switch (game.blockingLevel) {
    case BlockingLevel.channel:
      gameActive = !!inGameStates.get(channel.id);
      break;
    case BlockingLevel.guild:
      if (!guild)
        throw new Error(`${game.displayTitle} is a guild-level game.`);
      gameActive = !!inGameStates.get(guild.id);
      break;
    case BlockingLevel.selfChannel:
      gameActive = !!inGameStates.get(`${game.title}:${channel.id}`);
      break;
    case BlockingLevel.selfGuild:
      if (!guild)
        throw new Error(`${game.displayTitle} is a guild-level game.`);
      gameActive = !!inGameStates.get(`${game.title}:${guild.id}`);
      break;
    default:
      break;
  }
  return gameActive;
};

export const unblock = (game: Game, message: Message): void => {
  const {
    client: {
      cache: { inGameStates },
    },
    channel,
    guild,
  } = message;

  switch (game.blockingLevel) {
    case BlockingLevel.channel:
      inGameStates.delete(channel.id);
      break;
    case BlockingLevel.guild:
      if (!guild)
        throw new Error(`${game.displayTitle} is a guild-level game.`);
      inGameStates.delete(guild.id);
      break;
    case BlockingLevel.selfChannel:
      inGameStates.delete(`${game.title}:${channel.id}`);
      break;
    case BlockingLevel.selfGuild:
      if (!guild)
        throw new Error(`${game.displayTitle} is a guild-level game.`);
      inGameStates.delete(`${game.title}:${guild.id}`);
      break;
    default:
      break;
  }
};

export const blindUnblock = (message: Message): Promise<boolean> => {
  const {
    channel,
    guild,
    client: {
      cache: { inGameStates },
    },
  } = message;

  if (inGameStates.delete(channel.id)) return Promise.resolve(true);
  if (guild && inGameStates.delete(guild.id)) return Promise.resolve(true);
  return Promise.reject(`I couldn't find an active game.`);
};
