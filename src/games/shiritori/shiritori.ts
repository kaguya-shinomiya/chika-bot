import axios from "axios";
import { Message, User } from "discord.js";
import {
  chika_beating_yu_gif,
  red_cross,
  shiritori_rules_png,
} from "../../assets";
import { baseEmbed, lightErrorEmbed } from "../../shared/embeds";
import { Game, GameType } from "../../types/game";
import { STOP_GAME_RE } from "../utils/constants";
import { sendGameStartsIn, sendTaggedSelfError } from "../utils/embeds";
import { handleOpponentResponse } from "../utils/handleOpponentResponse";
import { ShiritoriGameState } from "./types";

export class Shiritori extends Game {
  static title = "shiritori";

  static type = GameType.Versus;

  static pregame(message: Message) {
    const { channel, mentions, author } = message;
    const opponent = mentions.users.first()!;

    if (author.id === opponent.id) {
      sendTaggedSelfError(channel);
      return;
    }

    handleOpponentResponse(
      message,
      opponent,
      () => {
        Shiritori.startGame(message, author, opponent);
      },
      () =>
        channel.send(
          lightErrorEmbed(
            `**${opponent.username}** does not want to play Shiritori.`
          )
        )
    );
  }

  static createOnceListener(gameState: ShiritoriGameState) {
    const shiritoriListener = async (message: Message) => {
      const { author, content, channel, client } = message;
      const noChange = Shiritori.createOnceListener(gameState);

      if (
        !(gameState.p1.id === author.id) &&
        !(gameState.p2.id === author.id)
      ) {
        client.once("message", noChange);
        return;
      }
      if (!(channel.id === gameState.channelID)) {
        client.once("message", noChange);
        return;
      }

      if (STOP_GAME_RE.test(content)) {
        channel.send(
          lightErrorEmbed(`**${author.username}** has stopped the game.`)
        );
        endGame();
        return;
      }

      const playerCards =
        author.id === gameState.p1.id ? gameState.p1Cards : gameState.p2Cards;

      if (!content.startsWith(gameState.startingChar!)) {
        message.react(red_cross);
        client.once("message", noChange);
        return;
      }

      const lastChar = content[content.length - 1];
      if (!playerCards.includes(content[content.length - 1])) {
        message.react(red_cross);
        client.once("message", noChange);
        return;
      }

      const isValidWord = await Shiritori.checkWord(content);
      if (!isValidWord) {
        message.react(red_cross);
        client.once("message", noChange);
        return;
      }

      playerCards.splice(playerCards.indexOf(lastChar), 1);
      if (playerCards.length === 0) {
        channel.send(
          baseEmbed()
            .setTitle(`**${author.username}** wins!`)
            .setImage(chika_beating_yu_gif)
        );
        endGame();
        return;
      }
      client.once("message", Shiritori.createOnceListener(gameState));
      channel
        .send(Shiritori.playerCardsEmbed(gameState))
        .then(() => channel.send(`:regional_indicator_${lastChar}:`));

      // eslint-disable-next-line no-param-reassign
      gameState.startingChar = lastChar;

      function endGame() {
        client.gameStates.delete(channel.id);
      }
    };

    return shiritoriListener;
  }

  static startGame({ client, channel }: Message, p1: User, p2: User) {
    const [p1Cards, p2Cards, stack] = Shiritori.genInitialCards();

    const state = client.gameStates
      .set(
        channel.id,
        new ShiritoriGameState({
          channelID: channel.id,
          p1,
          p2,
          p1Cards,
          p2Cards,
          stack,
        })
      )
      .get(channel.id)! as ShiritoriGameState;

    sendGameStartsIn({
      channel,
      title: "shiritori",
      timeout: 5,
      message: "I'll reveal the first card in 5 seconds.",
    }).then(() => channel.send(Shiritori.playerCardsEmbed(state)));

    const [firstChar] = Shiritori.popRandom(state.stack);
    state.startingChar = firstChar;
    setTimeout(() => {
      channel.send(`:regional_indicator_${firstChar}:`);
    }, 5000);

    client.once("message", Shiritori.createOnceListener(state)); // register the new listener
  }

  static popRandom(arr: string[]) {
    const index = Math.floor(Math.random() * arr.length);
    return arr.splice(index, 1);
  }

  static genInitialCards() {
    const allChars: string[] = [];
    for (let i = 0; i < 26; i += 1) {
      allChars.push(String.fromCharCode(i + 97));
    }

    const cards: string[] = [];
    while (cards.length < 10) {
      const newChar = String.fromCharCode(97 + Math.floor(Math.random() * 26));
      if (!cards.includes(newChar)) {
        cards.push(newChar);
      }
    }

    return [
      cards.slice(0, 5),
      cards.slice(5, 10),
      allChars.filter((char) => !cards.includes(char)),
    ];
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

  static rules = baseEmbed()
    .setTitle("Shiritori :u55b6:")
    .addFields([
      {
        name: "How it works",
        value: `
      Each player is issued 5 cards.
      
      You must form a word which a) starts 
      with the last played card, and b) ends
      on one of your cards.
      
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
