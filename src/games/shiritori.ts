import axios from "axios";
import { Message, MessageEmbed, User } from "discord.js";
import { v4 } from "uuid";
import {
  chika_crying_png,
  chika_rap_png,
  chika_spin_gif,
  red_cross,
} from "../assets";
import { chika_pink } from "../constants";
import { Game } from "../types/game";
import { GameState } from "../types/gameState";
import { STOP_GAME_RE } from "./utils/constants";
import { sendGameCrashedError, sendNoTagError } from "./utils/errorSenders";
import { handleOpponentResponse } from "./utils/handleOpponentResponse";

// TODO game timeout on inactivity
interface ShiritoriGameStateConstructorProps {
  channelID: string;
  p1: User;
  p2: User;
  p1Cards: string[];
  p2Cards: string[];
  stack: string[];
}

class ShiritoriGameState extends GameState {
  p1: User;
  p2: User;
  p1Cards: string[];
  p2Cards: string[];
  stack: string[];
  startingChar?: string;

  // TODO refactor this constructor to take an object instead
  constructor({
    channelID,
    p1,
    p2,
    p1Cards,
    p2Cards,
    stack,
  }: ShiritoriGameStateConstructorProps) {
    super("shiritori", channelID);
    this.p1 = p1;
    this.p2 = p2;
    this.p1Cards = p1Cards;
    this.p2Cards = p2Cards;
    this.stack = stack;
  }
}

class Shiritori extends Game {
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
        this.startGame(message, author, opponent);
      },
      () =>
        channel.send(
          `**${opponent.username}** does not want to play Shiritori.`
        )
    );
  }

  startGame({ client, channel }: Message, p1: User, p2: User) {
    const [p1Cards, p2Cards, stack] = this.genInitialCards();

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
    channel.send(this.genPlayerCardsEmbed(state));

    console.log(gameID, p1.username, p2.username);

    function endGame() {
      client.removeListener("message", listener);
      client.gameStates.delete(gameID);
    }

    const listener = async (message: Message) => {
      // this function contains the main 'loop' logic
      const { author, content, channel, client } = message;
      const state = client.gameStates.get(gameID) as ShiritoriGameState;
      if (!state) {
        sendGameCrashedError(channel);
        endGame();
        return;
      }
      if (!(channel.id === state.channelID)) return;
      if (!(state.p1.id === author.id) && !(state.p2.id === author.id)) return;

      if (STOP_GAME_RE.test(content)) {
        channel.send(
          new MessageEmbed()
            .setColor(chika_pink)
            .setDescription(`**${author.username}** has stopped the game.`)
            .setThumbnail(chika_crying_png)
        );
        endGame();
        return;
      }

      const playerCards =
        author.id === state.p1.id ? state.p1Cards : state.p2Cards;

      if (!content.startsWith(state.startingChar!)) {
        message.react(red_cross);
        return;
      }
      const lastChar = content[content.length - 1];
      if (!playerCards.includes(content[content.length - 1])) {
        message.react(red_cross);
        return;
      }
      const isValidWord = await this.checkWord(content);
      if (!isValidWord) {
        message.react(red_cross);
        return;
      }

      playerCards.splice(playerCards.indexOf(lastChar), 1);
      if (playerCards.length === 0) {
        channel.send(
          new MessageEmbed()
            .setColor(chika_pink)
            .setTitle(`${author.username} won!`)
            .setImage(chika_spin_gif)
        );
        endGame();
        return;
      }
      channel.send(this.genPlayerCardsEmbed(state));
      state.startingChar = lastChar;
      channel.send(`:regional_indicator_${lastChar}:`);
    };

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

  genInitialCards() {
    // returns an array of 3 arrays
    // first 2 contains 5 cards each for p1 and p2
    // 3rd array contains the remaining 16 alphabets
    let allChars: string[] = [];
    for (let i = 0; i < 26; i++) {
      allChars.push(String.fromCharCode(i + 97));
    }

    let cards: string[] = [];
    while (cards.length < 10) {
      const newChar = String.fromCharCode(97 + Math.floor(Math.random() * 26));
      if (cards.includes(newChar)) continue;
      cards.push(newChar);
    }

    return [
      cards.slice(0, 5),
      cards.slice(5, 10),
      allChars.filter((char) => !cards.includes(char)),
    ];
  }

  genCardsString(chars: string[]): string {
    // helper function to produce alphabet emojis
    let generated = "";
    chars.forEach((char) => (generated += `:regional_indicator_${char}: `));
    return generated;
  }

  genPlayerCardsEmbed({ p1, p2, p1Cards, p2Cards }: ShiritoriGameState) {
    return new MessageEmbed()
      .setColor(chika_pink)
      .setThumbnail(chika_rap_png)
      .setTitle("Your cards!")
      .addFields([
        {
          name: `**${p1.username}**'s cards`,
          value: this.genCardsString(p1Cards),
        },
        {
          name: `**${p2.username}**'s cards`,
          value: this.genCardsString(p2Cards),
        },
      ]);
  }

  async checkWord(word: string): Promise<boolean> {
    const uri = `http://api.datamuse.com/words?sp=${word}&max=1`;
    return axios.get(uri).then((response) => response.data.length === 1);
  }
}

export default new Shiritori("shiritori", "1v1");
