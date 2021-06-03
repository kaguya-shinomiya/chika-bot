import { genericCards } from "./generic";

const shuffleCards = () =>
  genericCards.map((card, index) => ({ id: index, ...card }));

export default shuffleCards;
