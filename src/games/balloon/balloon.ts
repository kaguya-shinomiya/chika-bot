import type { Client, Collection, Message, User } from "discord.js";
import { balloon_rules_jpg, ribbon_emoji } from "../../shared/assets";
import { baseEmbed } from "../../shared/embeds";
import { BlockingLevel } from "../../types/blockingLevel";
import { GenericChannel } from "../../types/command";
import { Game } from "../../types/game";
import { createBalloonListener } from "./utils/listener";
import { BalloonState } from "./utils/types";

export class Balloon extends Game {
  title = "balloon";

  displayTitle = "Balloon";

  minPlayerCount = 2;

  maxPlayerCount = 6;

  sessionDuration = 1000 * 60 * 10;

  blockingLevel = BlockingLevel.guild;

  pregame(message: Message) {
    const { channel, client } = message;
    this.collectPlayers(message, {
      onTimeoutAccept: (players) => {
        this.sendParticipants(
          channel,
          players.map((user) => user),
          {
            startsInMessage: `Carry on with your lives. ʕ•ᴥ•ʔ Each time you send something, the balloon gets pumped. You'll know when it pops.`,
          }
        );
        this.startGame(players, { channel, client });
      },
    });
  }

  startGame(
    players: Collection<string, User>,
    meta: { channel: GenericChannel; client: Client }
  ) {
    const { channel, client } = meta;
    const tolerance = Math.floor(Math.random() * 500 + 10);
    const initState: BalloonState = {
      gameTitle: this.title,
      channelId: channel.id,
      currentVolume: 0,
      tolerance,
      players,
    };

    client.once("message", createBalloonListener(initState));
  }

  rules = baseEmbed()
    .setTitle("Balloon :balloon:")
    .setImage(balloon_rules_jpg)
    .setFooter(`chapter 91 page 3`)
    .addFields([
      {
        name: "How it works",
        value: `
        Chika hands you a pump and a 
        balloon. Each message you send
        pumps the balloon by a certain
        amount.

        The balloon will pop! once it
        reaches its limit, which is randomly
        chosen each round. The player
        who pops it loses!`,
      },
      {
        name: "Player count",
        value: `${this.minPlayerCount} - ${this.maxPlayerCount} players`,
      },
      {
        name: "Losing",
        value: `
        The player who pops the balloon
        will pay ${ribbon_emoji} to all other players.`,
      },
      {
        name: "Options",
        value: `
        You may override the default
        balloon's volume range for 
        the server:
        \`balloon-lower\`
        Set lower bound for volume.
        \`balloon-upper\`
        Set upper bound for volume.`,
      },
    ]);
}
