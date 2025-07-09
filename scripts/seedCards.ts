import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import { DigimonCard, DigimonCardType, DigimonColor, DigimonRarity, DigimonAttribute } from '../src/utils/types';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY!,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.VITE_FIREBASE_APP_ID!,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

interface ApiCard {
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

function mapCard(apiCard: any): DigimonCard | null {
  try {
    const card: any = {
      id: apiCard.id || `card-${Date.now()}`,
      name: apiCard.name || 'Unknown Card',
      image: `https://images.digimoncard.io/images/cards/${apiCard.id}.jpg`,
      type: apiCard.type || 'Digimon',
      color: apiCard.color ? [apiCard.color] : [],
      rarity: apiCard.rarity || 'Common',
      set: apiCard.set_name || ['Unknown'],
      cardNumber: apiCard.id || 'Unknown',
      effects: apiCard.main_effect || '',
      keywords: extractKeywords(apiCard.main_effect || ''),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // Only add optional fields if they have valid values
    if (apiCard.level && apiCard.level !== null) {
      card.level = parseInt(apiCard.level);
    }
    if (apiCard.play_cost && apiCard.play_cost !== null) {
      card.playCost = parseInt(apiCard.play_cost);
    }
    if (apiCard.evolution_cost && apiCard.evolution_cost !== null) {
      card.evolutionCost = parseInt(apiCard.evolution_cost);
    }
    if (apiCard.dp && apiCard.dp !== null) {
      card.dp = parseInt(apiCard.dp);
    }
    if (apiCard.attribute && apiCard.attribute !== null) {
      card.attribute = apiCard.attribute;
      card.traits = [apiCard.attribute];
    }
    if (apiCard.form && apiCard.form !== null) {
      card.form = apiCard.form;
    }
    
    return card as DigimonCard;
  } catch (error) {
    console.error('Error mapping card:', apiCard.name, error);
    return null;
  }
}

function extractKeywords(effects: string): string[] {
  if (!effects) return [];
  
  const keywords = [
    'Blocker', 'Rush', 'Piercing', 'Reboot', 'Security Attack',
    'Jamming', 'De-Digivolve', 'Draw', 'Recovery', 'Suspend',
    'Unsuspend', 'Delete', 'Return', 'Trash', 'Hand', 'Deck'
  ];
  
  return keywords.filter(keyword => 
    effects.toLowerCase().includes(keyword.toLowerCase())
  );
}

async function seedCards(): Promise<void> {
  try {
    console.log('🌱 Starting card seeding...');
    const res = await fetch('https://www.digimoncard.io/api-public/search.php?sort=name');
    const cards: ApiCard[] = await res.json();
    const cardCollection = collection(db, 'cards');

    for (let i = 0; i < cards.length; i++) {
      const apiCard = cards[i];
      try {
        const mappedCard = mapCard(apiCard);

        if (!mappedCard) {
          console.warn(`⚠️ Skipping "${apiCard.name}" — mapping failed.`);
          continue;
        }

        console.log(`📄 Uploading: "${mappedCard.name}" (${mappedCard.cardNumber})`);
        console.log(`   Set: ${mappedCard.set}, Effects: ${mappedCard.effects ? 'Yes' : 'No'}, Image: ${mappedCard.image ? 'Yes' : 'No'}`);

        await setDoc(doc(cardCollection, mappedCard.id), mappedCard);
        console.log(`✅ Seeded: ${mappedCard.name}`);
        
        if (i % 10 === 0) {
          console.log(`Progress: ${i + 1}/${cards.length} cards processed`);
        }
      } catch (err) {
        console.error(`❌ Firestore rejected "${apiCard.name}" (ID: ${apiCard.id})`);
        console.error(`🚨 Message:`, (err as Error).message);
        break;
      }
    }

    console.log('🌟 All cards seeded (or until first error).');
  } catch (err) {
    console.error('💥 Top-level error:', (err as Error).message);
  }
}

seedCards();