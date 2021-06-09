import { Event } from "../types/event";

const ready: Event = {
  name: "ready",
  once: true,
  listener(client) {
    const {
      redisManager: { default: defaultRedis },
    } = client;
    // eslint-disable-next-line no-console
    console.log("Chika bot is ready!");
    defaultRedis.set(
      "ping",
      `Redis is up and running at ${process.env.REDISCLOUD_URL}!`
    );
    // eslint-disable-next-line no-console
    defaultRedis.get("ping").then((res) => console.log(res));
  },
};

export default ready;
