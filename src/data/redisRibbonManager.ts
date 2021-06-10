import type { User } from "discord.js";
import { Collection } from "discord.js";
import _ from "lodash";
import { GLOBAL_RIBBONS } from "../shared/constants";
import { ribbons } from "./redisClient";

export const getRibbons = (user: User) =>
  ribbons.zscore(GLOBAL_RIBBONS, user.tag).then((res) => {
    if (!res) return Promise.resolve(0);
    return Promise.resolve(parseInt(res, 10));
  });

export const mgetRibbons = async (users: User[]) => {
  const col = new Collection<User, number>();
  const promises = users.map((user) => getRibbons(user));
  const stock = await Promise.all(promises);
  stock.forEach((_stock) => col.set(users.shift()!, _stock));
  return col;
};

export const getGlobalTop = (top = 10) =>
  ribbons
    .zrevrange(GLOBAL_RIBBONS, 0, top - 1, "WITHSCORES")
    .then((pairs) => Promise.resolve(_.chunk(pairs, 2)));
