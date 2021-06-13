import { redis } from "../data/redisClient";
import { Event } from "../types/event";

const ready: Event = {
  name: "ready",
  once: true,
  listener() {
    redis.ping().catch((err) => {
      // eslint-disable-next-line no-console
      console.error(err);
      Promise.reject(err);
    });
  },
};

export default ready;
