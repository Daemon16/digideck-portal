import { db } from '../utils/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import { DigimonCard } from '../utils/types';

const DIGIMON_CARD_DB_URL = 'https://digimoncard.dev/cards';

export async function scrapeDigimonCards(): Promise<void> {
  console.log('Seeding fallback cards...');
  await seedFallbackCards();
}

function extractKeywords(effects: string): string[] {
  const keywords = [
    'Blocker', 'Rush', 'Piercing', 'Reboot', 'Security Attack',
    'Jamming', 'De-Digivolve', 'Draw', 'Recovery', 'Suspend',
    'Unsuspend', 'Delete', 'Return', 'Trash', 'Hand', 'Deck'
  ];
  
  return keywords.filter(keyword => 
    effects.toLowerCase().includes(keyword.toLowerCase())
  );
}

// Fallback data if scraping fails
export async function seedFallbackCards(): Promise<void> {
  const fallbackCards: Partial<DigimonCard>[] = [
    {
      id: 'BT01-001',
      name: 'Koromon',
      type: 'Digimon',
      color: ['Red'],
      level: 2,
      rarity: 'Common',
      set: 'BT01',
      cardNumber: 'BT01-001',
      effects: '[Your Turn] When this Digimon digivolves, gain +1 memory.',
      keywords: [],
      image: 'https://via.placeholder.com/300x400/ff6b35/ffffff?text=Koromon'
    },
    {
      id: 'BT01-019',
      name: 'Greymon',
      type: 'Digimon',
      color: ['Red'],
      level: 4,
      rarity: 'Common',
      set: 'BT01',
      cardNumber: 'BT01-019',
      effects: '[When Digivolving] Delete 1 of your opponent\'s Digimon with 3000 DP or less.',
      keywords: [],
      image: 'https://via.placeholder.com/300x400/ff6b35/ffffff?text=Greymon'
    }
  ];
  
  const cardsCollection = collection(db, 'cards');
  
  for (const cardData of fallbackCards) {
    const card: DigimonCard = {
      ...cardData,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as DigimonCard;
    
    await setDoc(doc(cardsCollection, card.id), card);
  }
  
  console.log('Fallback cards seeded');
}

if (typeof require !== 'undefined' && require.main === module) {
  scrapeDigimonCards().catch(console.error);
}