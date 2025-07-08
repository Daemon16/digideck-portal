import { db } from '../utils/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import { TournamentDeck, DeckCard } from '../utils/types';

const DIGIMON_META_URL = 'https://digimonmeta.com/tournaments';
const LIMITLESS_URL = 'https://play.limitlesstcg.com/tournaments/completed?game=DIGIMON';

export async function scrapeTournamentDecks(): Promise<void> {
  console.log('Seeding fallback decks...');
  await seedFallbackDecks();
}



function generateSampleDeckList(archetype: string): DeckCard[] {
  const archetypeCards: Record<string, DeckCard[]> = {
    'Red Hybrid': [
      { cardId: 'BT07-009', name: 'Takuya Kanbara', quantity: 4 },
      { cardId: 'BT07-012', name: 'Agunimon', quantity: 4 },
      { cardId: 'BT07-015', name: 'BurningGreymon', quantity: 3 },
    ],
    'Blue Flamedramon': [
      { cardId: 'BT03-031', name: 'Veemon', quantity: 4 },
      { cardId: 'BT03-034', name: 'Flamedramon', quantity: 4 },
      { cardId: 'BT03-025', name: 'Davis Motomiya', quantity: 3 },
    ],
    'Yellow Security': [
      { cardId: 'BT01-085', name: 'Patamon', quantity: 4 },
      { cardId: 'BT01-090', name: 'Angemon', quantity: 4 },
      { cardId: 'BT01-096', name: 'MagnaAngemon', quantity: 3 },
    ]
  };
  
  return archetypeCards[archetype] || archetypeCards['Red Hybrid'];
}

function generateSampleEggDeck(): DeckCard[] {
  return [
    { cardId: 'BT01-001', name: 'Koromon', quantity: 4 },
    { cardId: 'BT01-002', name: 'Tsunomon', quantity: 1 },
  ];
}

async function seedFallbackDecks(): Promise<void> {
  const fallbackDecks: TournamentDeck[] = [
    {
      id: 'fallback-1',
      name: 'Red Hybrid - Champion',
      archetype: 'Red Hybrid',
      player: 'Sample Player 1',
      placement: 1,
      region: 'NA',
      tournament: 'Sample Tournament',
      date: new Date('2024-01-15'),
      cards: generateSampleDeckList('Red Hybrid'),
      mainDeck: generateSampleDeckList('Red Hybrid'),
      eggDeck: generateSampleEggDeck(),
      createdAt: new Date(),
    },
    {
      id: 'fallback-2',
      name: 'Blue Flamedramon - Runner-up',
      archetype: 'Blue Flamedramon',
      player: 'Sample Player 2',
      placement: 2,
      region: 'EU',
      tournament: 'Sample Tournament',
      date: new Date('2024-01-15'),
      cards: generateSampleDeckList('Blue Flamedramon'),
      mainDeck: generateSampleDeckList('Blue Flamedramon'),
      eggDeck: generateSampleEggDeck(),
      createdAt: new Date(),
    }
  ];
  
  const decksCollection = collection(db, 'decks');
  
  for (const deck of fallbackDecks) {
    await setDoc(doc(decksCollection, deck.id), deck);
  }
  
  console.log('Fallback decks seeded');
}

if (typeof require !== 'undefined' && require.main === module) {
  scrapeTournamentDecks().catch(console.error);
}