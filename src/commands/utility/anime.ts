import { TextChannel } from "discord.js";
import { PREFIX } from "../../constants";
import { getSdk, MediaType } from "../../generated/graphql";
import { lightErrorEmbed } from "../../shared/embeds";
import { Command } from "../../types/command";
import { RedisPrefix } from "../../types/redis";
import { animeInfoEmbed } from "./embeds/animeInfoEmbed";
import { sendNotFoundError } from "./embeds/errors";
import { client } from "./graphql/aniListClient";

export const anime: Command = {
  name: "anime",
  description: "Look up info for an anime.",
  argsCount: -2,
  category: "Utility",
  redis: RedisPrefix.default,
  usage: `${PREFIX}anime <anime_title>`,
  async execute(message, args) {
    const { channel } = message;
    const search = args.join(" ");

    const sdk = getSdk(client);
    sdk
      .searchAnime({ search, type: MediaType.Anime })
      .then((result) => {
        if (!result.Media) {
          sendNotFoundError(search, channel);
          return;
        }

        if (channel.isText()) {
          const textChannel = channel as TextChannel;
          if (!textChannel.nsfw && result.Media.isAdult) {
            channel.send(
              lightErrorEmbed(
                `This anime is marked as 18+! I can only show this in a NSFW channel.`
              )
            );
            return;
          }
        }

        const {
          averageScore,
          coverImage,
          description,
          source,
          episodes,
          genres,
          status,
          season,
          seasonYear,
          title,
        } = result.Media;

        channel.send(
          animeInfoEmbed({
            coverImage: coverImage?.medium,
            title: title?.userPreferred,
            description: description!,
            episodes,
            status,
            genres,
            source,
            averageScore,
            season,
            seasonYear,
          })
        );
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.log(err);
        sendNotFoundError(search, channel);
      });
  },
};

export default anime;
