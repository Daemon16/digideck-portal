// seedCards.js
import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🧼 Map and clean each card for our DigimonCard interface
function mapCard(apiCard) {
  try {
    const card = {
      id: apiCard.cardnumber || apiCard.id || `card-${Date.now()}`,
      name: apiCard.name || 'Unknown Card',
      image: apiCard.image_url || apiCard.cardimage || null,
      type: apiCard.type || 'Digimon',
      color: apiCard.color ? (Array.isArray(apiCard.color) ? apiCard.color : [apiCard.color]) : [],
      level: apiCard.lv ? parseInt(apiCard.lv) : undefined,
      playCost: apiCard.playcost ? parseInt(apiCard.playcost) : undefined,
      evolutionCost: apiCard.evolutioncost ? parseInt(apiCard.evolutioncost) : undefined,
      dp: apiCard.dp ? parseInt(apiCard.dp) : undefined,
      rarity: apiCard.rarity || 'Common',
      set: apiCard.set_name || apiCard.cardnumber?.split('-')[0] || 'Unknown',
      cardNumber: apiCard.cardnumber || apiCard.id || 'Unknown',
      effects: apiCard.effect || apiCard.cardtext || '',
      keywords: extractKeywords(apiCard.effect || apiCard.cardtext || ''),
      traits: apiCard.attribute ? [apiCard.attribute] : [],
      attribute: apiCard.attribute || undefined,
      form: apiCard.form || undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    return card;
  } catch (error) {
    console.error('Error mapping card:', apiCard.name, error);
    return null;
  }
}

function extractKeywords(effects) {
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

// 🌱 Seed all cards into Firestore
async function seedCards() {
  try {
    console.log('🌱 Starting card seeding...');
    const res = await fetch('https://www.digimoncard.io/api-public/search.php?sort=name');
    const cards = await res.json();
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
        console.error(`🚨 Message:`, err.message);
        break;
      }
    }

    console.log('🌟 All cards seeded (or until first error).');
  } catch (err) {
    console.error('💥 Top-level error:', err.message);
  }
}

seedCards();
