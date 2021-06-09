import { redis } from "../data/redisManager";
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
    // eslint-disable-next-line no-console
    redis.get("ping").then((res) => console.log(res));
  },
};

export default ready;
