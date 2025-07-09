import { db } from '../utils/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import { DigimonCard } from '../utils/types';

const DIGIMON_CARD_DB_URL = 'https://digimoncard.io/api-public/search.php?sort=name';

export async function scrapeDigimonCards(): Promise<void> {
  try {
    console.log('Fetching cards from Digimon API...');
    const response = await fetch(DIGIMON_CARD_DB_URL);
    
    if (!response.ok) {
      throw new Error('API request failed');
    }
    
    const data = await response.json();
    const cards = data.slice(0, 100); // Start with first 100 cards
    
    console.log(`Processing ${cards.length} cards...`);
    
    const cardsCollection = collection(db, 'cards');
    
    for (const apiCard of cards) {
      const card: DigimonCard = {
        id: apiCard.cardnumber || apiCard.id,
        name: apiCard.name,
        image: apiCard.image_url || null,
        type: apiCard.type,
        color: apiCard.color ? [apiCard.color] : [],
        level: apiCard.lv ? parseInt(apiCard.lv) : undefined,
        playCost: apiCard.playcost ? parseInt(apiCard.playcost) : undefined,
        evolutionCost: apiCard.evolutioncost ? parseInt(apiCard.evolutioncost) : undefined,
        dp: apiCard.dp ? parseInt(apiCard.dp) : undefined,
        rarity: apiCard.rarity || 'Common',
        set: apiCard.cardnumber?.split('-')[0] || 'Unknown',
        cardNumber: apiCard.cardnumber || apiCard.id,
        effects: apiCard.effect || '',
        keywords: extractKeywords(apiCard.effect || ''),
        traits: apiCard.attribute ? [apiCard.attribute] : [],
        attribute: apiCard.attribute,
        form: apiCard.form,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      await setDoc(doc(cardsCollection, card.id), card);
    }
    
    console.log(`Successfully imported ${cards.length} cards`);
  } catch (error) {
    console.error('Failed to fetch from API, using fallback:', error);
    await seedFallbackCards();
  }
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
      image: 'https://images.digimoncard.io/images/cards/BT01-001.jpg'
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
      image: 'https://images.digimoncard.io/images/cards/BT01-019.jpg'
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