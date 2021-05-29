import { Event } from "../types/event";

const ready: Event = {
  name: "ready",
  once: true,
  listener({ redis }) {
    const { defaultRedis } = redis;
    // eslint-disable-next-line no-console
    console.log("Chika bot is ready!");
    defaultRedis.set("ping", "Redis is up!");
    // eslint-disable-next-line no-console
    defaultRedis.get("ping").then((res) => console.log(res));
  },
};

export default ready;
