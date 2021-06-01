import { LifeCard } from "./types";

export const genericCards: LifeCard[] = [
  {
    type: "Bad luck",
    name: "Instant death",
    description: "Die and take the last place.",
    onLand: () => {},
  },
  {
    type: "Bad luck",
    name: "Traffic accident",
    description: "You run into a traffic accident!",
    onLand: () => {},
  },
];
