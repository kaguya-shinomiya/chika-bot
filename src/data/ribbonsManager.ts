import { Collection } from "discord.js";
import type { User } from "discord.js";
import { GLOBAL_RIBBONS } from "../shared/constants";
import { ribbons } from "./redisManager";

export const incrRibbons = (user: User, incrby: number) =>
  ribbons.zincrby(GLOBAL_RIBBONS, incrby, user.tag);

export const decrRibbons = (user: User, decrby: number) =>
  ribbons.zincrby(GLOBAL_RIBBONS, -decrby, user.tag);

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
