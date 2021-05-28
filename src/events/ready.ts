import { Event } from "../types/event";

const ready: Event = {
  name: "ready",
  once: true,
  listener() {
    // eslint-disable-next-line no-console
    console.log("Chika bot is ready!");
  },
};

export default ready;
