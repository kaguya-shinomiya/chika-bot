import axios from "axios";
import { Collection, Message, Snowflake, User } from "discord.js";
import { Redis } from "ioredis";
import {
  chika_beating_yu_gif,
  shiritori_rules_png,
  white_check_mark,
} from "../../assets";
import { baseEmbed, lightErrorEmbed } from "../../shared/embeds";
import { Game } from "../../types/game";
import { pingRedis } from "../utils/helpers";
import { ShiritoriGameState } from "./types";

interface startShiritoriGameParams {
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

  async startGame({ message, p1, p2, redis }: startShiritoriGameParams) {
    if (!(await pingRedis(redis, message.channel.id))) return;

    const { channel, client } = message;
    const { p1Cards, p2Cards, startingChar } = Shiritori.genInitialCards();

    const cards = new Collection<Snowflake, string[]>();
    cards.set(p1.id, p1Cards);
    cards.set(p2.id, p2Cards);

    const initState = new ShiritoriGameState({
      p1,
      p2,
      cards,
      startingChar,
      channelID: channel.id,
    });

    this.sendParticipants(channel, [p1, p2], {
      startsInMessage: `I'll reveal the first card in 5 seconds!`,
    }).then(() => channel.send(Shiritori.playerCardsEmbed(initState)));

    if (!(await pingRedis(redis, channel.id))) return;

    setTimeout(() => {
      client.once("message", Shiritori.createOnceListener(initState, redis)); // register the new listener
      channel.send(`:regional_indicator_${initState.startingChar}:`);
    }, 5000);
  }

  static createOnceListener(state: ShiritoriGameState, redis: Redis) {
    const shiritoriListener = async (message: Message) => {
      if (!(await pingRedis(redis, state.channelID))) return;

      const { author, content, channel, client } = message;

      const onRejectListener = Shiritori.createOnceListener(state, redis);
      const reject = () => client.once("message", onRejectListener);

      // 1. only accept from those 2 players
      if (author.id !== state.p1.id && author.id !== state.p2.id) {
        reject();
        return;
      }
      // 2. and they must be sending from the right channel
      if (!(channel.id === state.channelID)) {
        reject();
        return;
      }

      if (content.length < 4) {
        reject();
        return;
      }
      if (!content.startsWith(state.startingChar!)) {
        reject();
        return;
      }

      const playerCards = state.cards.get(author.id)!;

      const lastChar = content[content.length - 1];
      if (!playerCards.includes(content[content.length - 1])) {
        reject();
        return;
      }

      const isValidWord = await Shiritori.checkWord(content);
      if (!isValidWord) {
        reject();
        return;
      }

      channel.send(`I accept **${content}**! ${white_check_mark}`);
      playerCards.splice(playerCards.indexOf(lastChar), 1); // it's valid, pop that word out

      if (playerCards.length === 0) {
        channel.send(
          baseEmbed()
            .setDescription(
              `**${author.username}** defeats **${
                author.id === state.p1.id
                  ? state.p2.username
                  : state.p1.username
              }!**`
            )
            .setImage(chika_beating_yu_gif)
        );
        stopGame();
        return;
      }

      client.once("message", Shiritori.createOnceListener(state, redis));
      channel
        .send(Shiritori.playerCardsEmbed(state))
        .then(() => channel.send(`:regional_indicator_${lastChar}:`));

      // eslint-disable-next-line no-param-reassign
      state.startingChar = lastChar;

      function stopGame() {
        redis.del(channel.id);
      }
    };

    return shiritoriListener;
  }

  static genInitialCards() {
    const allChars: string[] = [];
    for (let i = 0; i < 26; i += 1) {
      allChars.push(String.fromCharCode(i + 97));
    }

    const cards: string[] = [];
    while (cards.length < 11) {
      const newChar = String.fromCharCode(97 + Math.floor(Math.random() * 26));
      if (!cards.includes(newChar)) {
        cards.push(newChar);
      }
    }

    return {
      p1Cards: cards.slice(0, 5),
      p2Cards: cards.slice(5, 10),
      startingChar: cards.pop()!,
    };
  }

  static genCardsString(chars: string[]): string {
    // helper function to produce alphabet emojis
    let generated = "";
    chars.forEach((char) => {
      generated += `:regional_indicator_${char}: `;
    });
    return generated;
  }

  static playerCardsEmbed({ p1, p2, cards }: ShiritoriGameState) {
    return baseEmbed()
      .setTitle("Your cards!")
      .addFields([
        {
          name: `**${p1.username}**'s cards`,
          value: Shiritori.genCardsString(cards.get(p1.id)!),
        },
        {
          name: `**${p2.username}**'s cards`,
          value: Shiritori.genCardsString(cards.get(p2.id)!),
        },
      ]);
  }

  static async checkWord(word: string): Promise<boolean> {
    const uri = `http://api.datamuse.com/words?sp=${word}&max=1`;
    // TODO catch errors
    return axios
      .get(uri)
      .then((response) => response.data.length === 1)
      .catch(() => false);
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
