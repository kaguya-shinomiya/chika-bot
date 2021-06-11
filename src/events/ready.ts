import { redis } from "../data/redisClient";
import { Event } from "../types/event";

const ready: Event = {
  name: "ready",
  once: true,
  listener() {
    // eslint-disable-next-line no-console
    console.log("Chika bot is ready!");
    redis.set(
      "ping",
      `Redis is up and running at ${process.env.REDISCLOUD_URL}!`
    );
  },
};

export default ready;
