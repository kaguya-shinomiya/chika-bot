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
import { sendGameCrashedError, sendGameStartsIn } from "../utils/embeds";
import { handleOpponentResponse } from "../utils/handleOpponentResponse";
import { ShiritoriGameState } from "./types";

export class Shiritori extends Game {
  static title = "shiritori";

  static type = GameType.Versus;

  static pregame(message: Message) {
    const { channel, mentions, author } = message;
    const opponent = mentions.users.first()!;

    // if (author.id === opponent.id) {
    //   sendTaggedSelfError(channel);
    //   return;
    // }

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

  static startGame({ client, channel }: Message, p1: User, p2: User) {
    const [p1Cards, p2Cards, stack] = Shiritori.genInitialCards();

    // TODO send some kinda start message
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

    const shiritoriListener = async (message: Message) => {
      // this function contains the main 'loop' logic
      const {
        author,
        content,
        channel: nowChannel,
        client: nowClient,
      } = message;
      const nowState = nowClient.gameStates.get(
        nowChannel.id
      ) as ShiritoriGameState;
      if (!nowState) {
        sendGameCrashedError(nowChannel);
        endGame();
        return;
      }
      if (!(nowChannel.id === nowState.channelID)) return;
      if (!(nowState.p1.id === author.id) && !(nowState.p2.id === author.id))
        return;

      if (STOP_GAME_RE.test(content)) {
        nowChannel.send(
          lightErrorEmbed(`**${author.username}** has stopped the game.`)
        );
        endGame();
        return;
      }

      const playerCards =
        author.id === nowState.p1.id ? nowState.p1Cards : nowState.p2Cards;

      if (!content.startsWith(nowState.startingChar!)) {
        message.react(red_cross);
        return;
      }
      const lastChar = content[content.length - 1];
      if (!playerCards.includes(content[content.length - 1])) {
        message.react(red_cross);
        return;
      }
      const isValidWord = await Shiritori.checkWord(content);
      if (!isValidWord) {
        message.react(red_cross);
        return;
      }

      playerCards.splice(playerCards.indexOf(lastChar), 1);
      if (playerCards.length === 0) {
        nowChannel.send(
          baseEmbed()
            .setTitle(`**${author.username}** wins!`)
            .setImage(chika_beating_yu_gif)
        );
        endGame();
        return;
      }
      nowChannel
        .send(Shiritori.playerCardsEmbed(nowState))
        .then(() => nowChannel.send(`:regional_indicator_${lastChar}:`));
      nowState.startingChar = lastChar;
    };

    function endGame() {
      client.removeListener("message", shiritoriListener);
      client.gameStates.delete(channel.id);
    }

    function popRandom(arr: string[]) {
      const index = Math.floor(Math.random() * arr.length);
      return arr.splice(index, 1);
    }

    const [firstChar] = popRandom(state.stack);
    state.startingChar = firstChar;
    setTimeout(() => {
      channel.send(`:regional_indicator_${firstChar}:`);
    }, 5000);

    client.on("message", shiritoriListener); // register the new listener
  }

  static genInitialCards() {
    // returns an array of 3 arrays
    // first 2 contains 5 cards each for p1 and p2
    // 3rd array contains the remaining 16 alphabets
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
    .setTitle("Shiritori :u556b:")
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
    .setImage(shiritori_rules_png);
}
