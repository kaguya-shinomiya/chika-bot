import { Message, MessageEmbed, User } from "discord.js";
import { v4 } from "uuid";
import { chika_rap_png } from "../assets";
import { chika_pink } from "../constants";
import { Game } from "../types/game";
import { GameState } from "../types/gameState";
import { sendGameCrashedError, sendNoTagError } from "./utils/errorSenders";
import { handleOpponentResponse } from "./utils/handleOpponentResponse";

class ShiritoriGameState extends GameState {
  p1Cards: string[];
  p2Cards: string[];

  constructor(
    channelID: string,
    players: string[],
    p1Cards: string[],
    p2Cards: string[]
  ) {
    super("shiritori", channelID, players);
    this.p1Cards = p1Cards;
    this.p2Cards = p2Cards;
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
    const [p1Cards, p2Cards] = this.genInitialCards();

    channel.send(
      this.genPlayerCardsEmbed(p1.username, p2.username, p1Cards, p2Cards)
    );

    // TODO send some kinda start message
    const gameID = v4();
    client.gameState.set(
      gameID,
      new ShiritoriGameState(channel.id, [p1.id, p2.id], p1Cards, p2Cards)
    );

    console.log(gameID, p1.username, p2.username);

    function stopListening() {
      client.removeListener("message", listener);
    }

    function listener({ author, content, channel }: Message) {
      const state = client.gameState.get(gameID);
      console.log(state);
      if (!state) {
        sendGameCrashedError(channel);
        // TODO terminate the game
        stopListening();
        return;
      }
      if (!(channel.id === state.channelID)) return;
      if (!state.players.includes(author.id)) return;

      console.log(channel.id, content);
      if (content === "!stop") {
        console.log("stop command received");
        stopListening();
      }
    }

    client.on("message", listener);
    console.log(client.listeners("message"));
  }

  genInitialCards() {
    // returns an array of 2 arrays
    // each has 5 random non-repeating alphabets
    let cards: string[] = [];
    while (cards.length < 10) {
      const newChar = String.fromCharCode(97 + Math.floor(Math.random() * 26));
      if (cards.includes(newChar)) continue;
      cards.push(newChar);
    }
    return [cards.slice(0, 5), cards.slice(5, 10)];
  }

  genCardsString(chars: string[]): string {
    // helper function to produce alphabet emojis
    let generated = "";
    chars.forEach((char) => (generated += `:regional_indicator_${char}: `));
    return generated;
  }

  genPlayerCardsEmbed(
    p1Username: string,
    p2Username: string,
    p1Cards: string[],
    p2Cards: string[]
  ) {
    return new MessageEmbed()
      .setColor(chika_pink)
      .setThumbnail(chika_rap_png)
      .setTitle("Distributing your cards!")
      .addFields([
        {
          name: `**${p1Username}**'s cards`,
          value: this.genCardsString(p1Cards),
        },
        {
          name: `**${p2Username}**'s cards`,
          value: this.genCardsString(p2Cards),
        },
      ]);
  }
}

export default new Shiritori("shiritori", "1v1");
