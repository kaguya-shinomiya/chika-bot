import axios from "axios";
import { Message, User } from "discord.js";
import { Redis } from "ioredis";
import {
  chika_beating_yu_gif,
  shiritori_rules_png,
  white_check_mark,
} from "../../assets";
import { baseEmbed, lightErrorEmbed } from "../../shared/embeds";
import { Game } from "../../types/game";
import { STOP_GAME_RE } from "../utils/constants";
import { sendParticipants } from "../utils/embeds";
import { getOpponentResponse } from "../utils/getOpponentResponse";
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

  static sessionDuration = 60 * 10;

  // eslint-disable-next-line class-methods-use-this
  pregame(message: Message, redis: Redis) {
    const { channel, mentions, author } = message;
    const taggedOpponent = mentions.users.first();

    if (!taggedOpponent) {
      this.collectPlayers({
        message,
        onTimeoutAccept: (players) => {
          const [p1, p2] = players.map((player) => player);
          Shiritori.startGame({ message, p1, p2, redis });
        },
      });
      return;
    }

    getOpponentResponse({
      gameTitle: "Shiritori",
      message,
      taggedOpponent,
      onAccept: () =>
        Shiritori.startGame({ message, p1: author, p2: taggedOpponent, redis }),
      onReject: () =>
        channel.send(
          lightErrorEmbed(
            `**${taggedOpponent.username}** does not want to play Shiritori.`
          )
        ),
    });
  }

  static startGame({ message, p1, p2, redis }: startShiritoriGameParams) {
    const { channel, client } = message;
    const { p1Cards, p2Cards, startingChar } = Shiritori.genInitialCards();

    const initState = new ShiritoriGameState({
      p1,
      p2,
      p1Cards,
      p2Cards,
      startingChar,
      channelID: channel.id,
    });

    // BUG this ttl doesn't affect anything
    redis.set(channel.id, "true", "ex", Shiritori.sessionDuration);

    sendParticipants({
      channel,
      gameTitle: "Shiritori",
      startsIn: `I'll reveal the first card in 5 seconds.`,
      participants: [p1, p2],
    }).then(() => channel.send(Shiritori.playerCardsEmbed(initState)));

    setTimeout(() => {
      client.once("message", Shiritori.createOnceListener(initState, redis)); // register the new listener
      channel.send(`:regional_indicator_${initState.startingChar}:`);
    }, 5000);
  }

  static createOnceListener(state: ShiritoriGameState, redis: Redis) {
    const shiritoriListener = async (message: Message) => {
      const { author, content, channel, client } = message;

      const onRejectListener = Shiritori.createOnceListener(state, redis);
      const reject = () => client.once("message", onRejectListener);

      // 1. only accept from those 2 players
      if (!(state.p1.id === author.id) && !(state.p2.id === author.id)) {
        reject();
        return;
      }
      // 2. and they must be sending from the right channel
      if (!(channel.id === state.channelID)) {
        reject();
        return;
      }

      if (STOP_GAME_RE.test(content)) {
        channel.send(
          lightErrorEmbed(`**${author.username}** has stopped the game.`)
        );
        stopGame();
        return;
      }

      if (content.length < 4) {
        // message.react(red_cross);
        reject();
        return;
      }

      const thisPlayerCards =
        author.id === state.p1.id ? state.p1Cards : state.p2Cards;

      if (!content.startsWith(state.startingChar!)) {
        // message.react(red_cross);
        reject();
        return;
      }

      const lastChar = content[content.length - 1];
      if (!thisPlayerCards.includes(content[content.length - 1])) {
        // message.react(red_cross);
        reject();
        return;
      }

      const isValidWord = await Shiritori.checkWord(content);
      if (!isValidWord) {
        // message.react(red_cross);
        reject();
        return;
      }
      channel.send(`I accept **${content}**! ${white_check_mark}`);
      thisPlayerCards.splice(thisPlayerCards.indexOf(lastChar), 1); // it's valid, pop that word out

      if (thisPlayerCards.length === 0) {
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

  static playerCardsEmbed({ p1, p2, p1Cards, p2Cards }: ShiritoriGameState) {
    return baseEmbed()
      .setTitle("Your cards!")
      .addFields([
        {
          name: `**${p1.username}**'s cards`,
          value: Shiritori.genCardsString(p1Cards),
        },
        {
          name: `**${p2.username}**'s cards`,
          value: Shiritori.genCardsString(p2Cards),
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
