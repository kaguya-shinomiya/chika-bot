import axios from "axios";
import { Message, MessageEmbed, User } from "discord.js";
import { v4 } from "uuid";
import {
  chika_beating_yu_gif,
  chika_crying_png,
  chika_rap_png,
  red_cross,
} from "../../assets";
import { chika_pink } from "../../constants";
import { Game } from "../../types/game";
import { STOP_GAME_RE } from "../utils/constants";
import { sendGameCrashedError, sendNoTagError } from "../utils/errorSenders";
import { handleOpponentResponse } from "../utils/handleOpponentResponse";
import { ShiritoriGameState } from "./types";

export class Shiritori extends Game {
  pregame(message: Message) {
    const { channel, mentions, author } = message;
    const opponent = mentions.users.first();
    if (!opponent) {
      sendNoTagError(this.name, channel, true);
      return;
    }
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
          `**${opponent.username}** does not want to play Shiritori.`
        )
    );
  }

  static startGame({ client, channel }: Message, p1: User, p2: User) {
    const [p1Cards, p2Cards, stack] = Shiritori.genInitialCards();

    // TODO send some kinda start message
    const gameID = v4();
    client.gameStates.set(
      gameID,
      new ShiritoriGameState({
        channelID: channel.id,
        p1,
        p2,
        p1Cards,
        p2Cards,
        stack,
      })
    );

    const state = client.gameStates.get(gameID) as ShiritoriGameState;
    channel.send(Shiritori.genPlayerCardsEmbed(state));

    const listener = async (message: Message) => {
      // this function contains the main 'loop' logic
      const {
        author,
        content,
        channel: nowChannel,
        client: nowClient,
      } = message;
      const nowState = nowClient.gameStates.get(gameID) as ShiritoriGameState;
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
          new MessageEmbed()
            .setColor(chika_pink)
            .setDescription(`**${author.username}** has stopped the game.`)
            .setThumbnail(chika_crying_png)
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
          new MessageEmbed()
            .setColor(chika_pink)
            .setTitle(`**${author.username}** wins!`)
            .setImage(chika_beating_yu_gif)
        );
        endGame();
        return;
      }
      nowChannel.send(Shiritori.genPlayerCardsEmbed(nowState));
      nowState.startingChar = lastChar;
      nowChannel.send(`:regional_indicator_${lastChar}:`);
    };

    function endGame() {
      client.removeListener("message", listener);
      client.gameStates.delete(gameID);
    }

    function popRandom(arr: string[]) {
      const index = Math.floor(Math.random() * arr.length);
      return arr.splice(index, 1);
    }

    // TODO some kinda countdown timer...
    const [firstChar] = popRandom(state.stack);
    state.startingChar = firstChar;
    channel.send(`:regional_indicator_${firstChar}:`);

    client.on("message", listener); // register the new listener
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

  static genPlayerCardsEmbed({ p1, p2, p1Cards, p2Cards }: ShiritoriGameState) {
    return new MessageEmbed()
      .setColor(chika_pink)
      .setThumbnail(chika_rap_png)
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
    return axios.get(uri).then((response) => response.data.length === 1);
  }
}
