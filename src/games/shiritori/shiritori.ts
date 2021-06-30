import type { Message, Snowflake, User } from 'discord.js';
import { Collection } from 'discord.js';
import { shiritoriProvider } from '../../data/providers/shiritoriProvider';
import { shiritori_rules_jpg } from '../../shared/assets';
import { baseEmbed, lightErrorEmbed } from '../../shared/embeds';
import { BlockingLevel } from '../../types/blockingLevel';
import { Game } from '../../types/game';
import { sendTaggedSelfError } from '../utils/embeds';
import { genInitialCards } from './utils/cards';
import { shiritoriPlayerCardsEmbed } from './utils/embeds';
import { createOnceShiritoriListener } from './utils/listener';
import type { ShiritoriState } from './utils/types';

interface startShiritoriParams {
  p1: User;
  p2: User;
}

export class Shiritori extends Game {
  title = 'shiritori';

  displayTitle = 'Shiritori';

  minPlayerCount = 2;

  maxPlayerCount = 2;

  sessionDuration = 1000 * 60 * 10; // 10 min in ms

  blockingLevel = BlockingLevel.channel;

  pregame(message: Message) {
    const { channel, mentions, author } = message;
    const taggedOpponent = mentions.users.first();

    if (
      process.env.NODE_ENV !== 'development' &&
      taggedOpponent?.id === author.id
    ) {
      sendTaggedSelfError(channel);
      return;
    }

    if (!taggedOpponent) {
      this.collectPlayers(message, {
        onTimeoutAccept: (players) => {
          const [p1, p2] = players.map((player) => player);
          this.startGame(message, { p1, p2 });
        },
      });
      return;
    }

    this.getOpponentResponse(message, taggedOpponent, {
      onAccept: () =>
        this.startGame(message, { p1: author, p2: taggedOpponent }),
      onReject: () =>
        channel.send(
          lightErrorEmbed(
            `**${taggedOpponent.username}** does not want to play Shiritori.`,
          ),
        ),
    });
  }

  async startGame(message: Message, { p1, p2 }: startShiritoriParams) {
    const { channel, client, guild } = message;
    const size = await shiritoriProvider.getHandSize(guild!.id);
    const { p1Cards, p2Cards, startingChar } = genInitialCards(size);

    const cards = new Collection<Snowflake, string[]>();
    cards.set(p1.id, p1Cards);
    cards.set(p2.id, p2Cards);

    const minLen = await shiritoriProvider.getMinLen(message.guild?.id);

    const initState: ShiritoriState = {
      gameTitle: 'shiritori',
      cards,
      channelId: channel.id,
      p1,
      p2,
      startingChar,
      minLen,
    };

    this.sendParticipants(channel, [p1, p2], {
      startsInMessage: `Your words must have at least **${minLen}** ${
        minLen === 1 ? 'letter' : 'letters'
      }.
      I'll reveal the first card in 5 seconds!`,
    }).then(() => channel.send(shiritoriPlayerCardsEmbed(initState)));

    setTimeout(() => {
      client.once('message', createOnceShiritoriListener(initState, this)); // register the new listener
      channel.send(`:regional_indicator_${initState.startingChar}:`);
    }, 5000);
  }

  rules = baseEmbed()
    .setTitle('Shiritori :u55b6:')
    .addFields([
      {
        name: 'How it works',
        value: `
      Each player is issued 5 cards.
      
      You must form a word which a) starts 
      with the last played card, b) ends
      on one of your cards, and c) be at
      least 4 characters long.
      
      The game will start with a random 
      card.
      `,
      },
      {
        name: 'Player count',
        value: '2',
      },
      {
        name: 'To win',
        value: `Be the first to clear all 5 cards!`,
      },
      {
        name: 'Options',
        value: `
        You can override the default
        minimum word length, as well as the
        number of cards issued to each
        player.
        \`sh-min\`
        Set the minimum word length.
        \`sh-hand\`
        Set the initial card count.`,
      },
    ])
    .setImage(shiritori_rules_jpg)
    .setFooter(`chapter 188 page 4`);
}
