export type DigimonCardType = 'Digimon' | 'Tamer' | 'Option';
export type DigimonColor = 'Red' | 'Blue' | 'Yellow' | 'Green' | 'Black' | 'Purple' | 'White';
export type DigimonRarity = 'Common' | 'Uncommon' | 'Rare' | 'Super Rare' | 'Secret Rare' | 'Alternative Art';
export type DigimonAttribute = 'Vaccine' | 'Data' | 'Virus' | 'Free' | 'Variable';

export interface DigimonCard {
  id: string;
  name: string;
  image: string | null;
  type: DigimonCardType;
  color: DigimonColor[];
  level?: number;
  playCost?: number;
  evolutionCost?: number;
  dp?: number;
  rarity: DigimonRarity;
  set: string[];
  cardNumber: string;
  effects: string;
  keywords: string[];
  traits?: string[];
  attribute?: DigimonAttribute;
  form?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type DeckType = 'tournament' | 'user' | 'meta';
export type TournamentFormat = 'standard' | 'limited' | 'casual';

export interface DeckCard {
  cardId: string;
  name: string;
  quantity: number;
  cardNumber?: string;
  type?: DigimonCardType;
  form?: string;
  level?: number;
  color?: DigimonColor[];
  image?: string;
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
  format: TournamentFormat;
  cards: DeckCard[];
  mainDeck: DeckCard[];
  eggDeck: DeckCard[];
  sideboardDeck?: DeckCard[];
  totalCards: number;
  colors: DigimonColor[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserDeck {
  id: string;
  name: string;
  description?: string;
  userId: string;
  format: string;
  cards: DeckCard[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DetailedDeck {
  id: string;
  name: string;
  archetype: string;
  player: string;
  placement: number;
  region: string;
  tournament: string;
  date: Date;
  format: TournamentFormat;
  cards: DeckCard[];
  totalCards: number;
  setId: string;
  createdAt: Date;
  updatedAt: Date;
  // Optional fields from tournament data
  deckProfile?: string;
  country?: string;
  host?: string;
  detailsUrl?: string;
  cardBreakdown?: {
    digimon: DeckCard[];
    tamers: DeckCard[];
    options: DeckCard[];
  };
  strategy?: string;
  keyCards?: string[];
  winCondition?: string;
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

export interface CardFilters {
  type?: DigimonCardType;
  color?: DigimonColor;
  set?: string;
  searchTerm?: string;
  rarity?: DigimonRarity;
}

export interface PaginationState {
  page: number;
  limit: number;
  hasMore: boolean;
  total: number;
}

export interface UseCardsResult {
  cards: DigimonCard[];
  loading: boolean;
  error: string | null;
  pagination: PaginationState;
  loadMore: () => void;
  refresh: () => void;
}

export interface UseDecksResult {
  decks: TournamentDeck[];
  loading: boolean;
  error: string | null;
  pagination: PaginationState;
  loadMore: () => void;
  refresh: () => void;
}

// API Response Types
export interface ApiCardResponse {
  id?: string;
  cardnumber?: string;
  name?: string;
  image_url?: string;
  cardimage?: string;
  type?: string;
  color?: string | string[];
  lv?: string | number;
  playcost?: string | number;
  evolutioncost?: string | number;
  dp?: string | number;
  rarity?: string;
  set_name?: string;
  effect?: string;
  cardtext?: string;
  attribute?: string;
  form?: string;
}

// Utility Types
export type CardSortField = 'name' | 'cardNumber' | 'type' | 'color' | 'level' | 'playCost' | 'set' | 'rarity';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: CardSortField;
  direction: SortDirection;
}

export interface CardSearchFilters extends CardFilters {
  sortBy?: SortConfig;
  includeKeywords?: string[];
  excludeKeywords?: string[];
  minLevel?: number;
  maxLevel?: number;
  minPlayCost?: number;
  maxPlayCost?: number;
}

export interface DeckDetailsPageProps {
  deckId: string;
}

export interface UseDeckDetailsResult {
  deck: DetailedDeck | null;
  loading: boolean;
  error: string | null;
}

export interface SynergyData {
  cardA: string;
  cardB: string;
  coOccurrence: number;
  winRate: number;
  popularity: number;
}

export interface MetaSet {
  id: string;
  name: string;
  setId: string;
  totalDecks: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SetDeck extends TournamentDeck {
  setName: string;
  setId: string;
}