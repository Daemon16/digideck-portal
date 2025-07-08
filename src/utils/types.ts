export interface DigimonCard {
  id: string;
  name: string;
  image: string;
  type: 'Digimon' | 'Tamer' | 'Option';
  color: string[];
  level?: number;
  playCost?: number;
  evolutionCost?: number;
  dp?: number;
  rarity: string;
  set: string;
  cardNumber: string;
  effects: string;
  keywords: string[];
  traits?: string[];
  attribute?: string;
  form?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TournamentDeck {
  id: string;
  name: string;
  archetype: string;
  player: string;
  placement: number;
  region: string;
  tournament: string;
  date: Date;
  cards: DeckCard[];
  mainDeck: DeckCard[];
  eggDeck: DeckCard[];
  createdAt: Date;
}

export interface DeckCard {
  cardId: string;
  name: string;
  quantity: number;
}

export interface MetaData {
  id: string;
  archetype: string;
  winRate: number;
  popularity: number;
  avgPlacement: number;
  region: string;
  timeframe: string;
  lastUpdated: Date;
}

export interface UserProfile {
  id: string;
  username: string;
  partnerDigimon: string;
  level: number;
  experience: number;
  visitCount: number;
  favoriteArchetype: string;
  createdAt: Date;
  lastActive: Date;
}

export interface SynergyData {
  cardA: string;
  cardB: string;
  coOccurrence: number;
  winRate: number;
  popularity: number;
}