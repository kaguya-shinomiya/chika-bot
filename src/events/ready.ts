import { Event } from "../types/event";
const ready: Event = {
  name: "ready",
  once: true,
  listener() {
    console.log("Chika bot is ready!");
  },
};

export default ready;
