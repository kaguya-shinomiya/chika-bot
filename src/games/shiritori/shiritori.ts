import type { Message, Snowflake, User } from "discord.js";
import { Collection } from "discord.js";
import type { Redis } from "ioredis";
import { shiritori_rules_png } from "../../assets";
import { baseEmbed, lightErrorEmbed } from "../../shared/embeds";
import { Game } from "../../types/game";
import { genInitialCards } from "./utils/cards";
import { shiritoriPlayerCardsEmbed } from "./utils/embeds";
import { createOnceShiritoriListener } from "./utils/listener";
import type { ShiritoriState } from "./utils/types";

interface startShiritoriParams {
  message: Message;
  p1: User;
  p2: User;
  redis: Redis;
}

export class Shiritori extends Game {
  title = "shiritori";

  displayTitle = "Shiritori";

  minPlayerCount = 2;

  maxPlayerCount = 2;

  sessionDuration = 1000 * 60 * 10; // 10 min in ms

  // eslint-disable-next-line class-methods-use-this
  pregame(message: Message, redis: Redis) {
    const { channel, mentions, author } = message;
    const taggedOpponent = mentions.users.first();

    if (!taggedOpponent) {
      this.collectPlayers({
        message,
        onTimeoutAccept: (players) => {
          const [p1, p2] = players.map((player) => player);
          this.startGame({ message, p1, p2, redis });
        },
        redis,
      });
      return;
    }

    this.getOpponentResponse({
      redis,
      message,
      taggedOpponent,
      onAccept: () =>
        this.startGame({ message, p1: author, p2: taggedOpponent, redis }),
      onReject: () =>
        channel.send(
          lightErrorEmbed(
            `**${taggedOpponent.username}** does not want to play Shiritori.`
          )
        ),
    });
  }

  async startGame({ message, p1, p2, redis }: startShiritoriParams) {
    const { channel, client } = message;
    const { p1Cards, p2Cards, startingChar } = genInitialCards();

    const cards = new Collection<Snowflake, string[]>();
    cards.set(p1.id, p1Cards);
    cards.set(p2.id, p2Cards);

    const initState: ShiritoriState = {
      gameTitle: "shiritori",
      cards,
      channelId: channel.id,
      p1,
      p2,
      startingChar,
    };

    this.sendParticipants(channel, [p1, p2], {
      startsInMessage: `I'll reveal the first card in 5 seconds!`,
    }).then(() => channel.send(shiritoriPlayerCardsEmbed(initState)));

    setTimeout(() => {
      client.once("message", createOnceShiritoriListener(initState, redis)); // register the new listener
      channel.send(`:regional_indicator_${initState.startingChar}:`);
    }, 5000);
  }

  rules = baseEmbed()
    .setTitle("Shiritori :u55b6:")
    .addFields([
      {
        name: "How it works",
        value: `
      Each player is issued 5 cards.
      
      You must form a word which a) starts 
      with the last played card, b) ends
      on one of your cards, and c) be at
      least 4 characters long.
      
      The game will start with a random card.
      `,
      },
      {
        name: "To win",
        value: `Be the first to clear all 5 cards!`,
      },
    ])
    .setImage(shiritori_rules_png)
    .setFooter(`chapter 188 page 4`);
}
