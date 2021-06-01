type LifeCardType = "Bad luck" | "Lucky";

export interface LifeCard {
  type: LifeCardType;
  name: string;
  description: string;
  onLand: (...args: any[]) => void;
  hook?: (...args: any[]) => void;
}
