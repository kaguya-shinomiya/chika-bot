import { MessageEmbed } from "discord.js";
import { Message, User } from "discord.js";
import { v4 } from "uuid";
import { chika_rap_png } from "../assets";
import { chika_pink } from "../constants";
import { Game } from "../types/game";
import { GameState } from "../types/gameState";
import { sendNoTagError } from "./utils/errorSenders";
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
    let p1Cards: string[] = [];
    let p2Cards: string[] = [];

    // TODO there should be no duplicate alphabets
    for (let i = 0; i < 5; i++) {
      p1Cards.push(String.fromCharCode(97 + Math.floor(Math.random() * 26)));
    }
    for (let i = 0; i < 5; i++) {
      p2Cards.push(String.fromCharCode(97 + Math.floor(Math.random() * 26)));
    }

    const genCardsString = (chars: string[]): string => {
      let generated = "";
      chars.forEach((char) => (generated += `:regional_indicator_${char}: `));
      return generated;
    };

    channel.send(
      new MessageEmbed()
        .setColor(chika_pink)
        .setThumbnail(chika_rap_png)
        .setTitle("Distributing your cards!")
        .addFields([
          {
            name: `**${p1.username}**'s cards`,
            value: genCardsString(p1Cards),
          },
          {
            name: `**${p2.username}**'s cards`,
            value: genCardsString(p2Cards),
          },
        ])
    );

    // TODO send some kinda start message
    const gameID = v4();
    client.gameState.set(
      gameID,
      new ShiritoriGameState(channel.id, [p1.id, p2.id], p1Cards, p2Cards)
    );

    client.on("message", ({ channel, author, content }) => {
      // TODO guard conditions
      const state = client.gameState.get(gameID)!; // TODO remove non-null assertion and end game
      if (!(channel.id === state.channelID)) return;
      if (!state.players.includes(author.id)) return;

      console.log(content);
    });
  }

  registerMessageListener() {}
}

export default new Shiritori("shiritori", "1v1");
