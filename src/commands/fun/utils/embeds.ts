import { MessageEmbed, User } from 'discord.js';
import { chika_pink, kaguya_red } from '../../../shared/assets';
import { baseEmbed, lightErrorEmbed } from '../../../shared/embeds';
import type { ChatbotChar } from './types';

export const avatarEmbed = (user: User): MessageEmbed =>
  baseEmbed()
    .setImage(user.displayAvatarURL({ dynamic: true }))
    .setFooter(`${user.tag}'s avatar`);

const applyColor = (embed: MessageEmbed, char: ChatbotChar) => {
  switch (char) {
    case 'ck':
      embed.setColor(chika_pink);
      break;
    case 'ka':
      embed.setColor(kaguya_red);
      break;
    default:
      embed.setColor(chika_pink);
      break;
  }
  return embed;
};

export const chatbotLoadingError = (char: ChatbotChar) => {
  const embed = new MessageEmbed()
    .setDescription(
      `Thanks for chatting with me! Please give me a minute to get ready.`,
    )
    .setFooter('(The API takes a moment to load sometimes lol)');
  return applyColor(embed, char);
};

export const chatbotTimeoutError = (char: ChatbotChar) => {
  const embed = lightErrorEmbed(
    'I ran into an error while thinking of a reply.',
  );
  return applyColor(embed, char);
};

export const chatbotLimitError = (char: ChatbotChar) => {
  const embed = lightErrorEmbed(
    "Sorry! I'll be hibernating for the rest of the month. (ღ˘⌣˘ღ)",
  ).setFooter(
    "(The free API I'm using has a 30k character limit per month lol)",
  );
  return applyColor(embed, char);
};
