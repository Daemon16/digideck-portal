import { config } from 'dotenv';
config({ path: '../.env' });
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

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

async function testMinimalWrite() {
  try {
    console.log('Testing with cards array...');
    
    const deckWithCards = {
      name: 'Test Deck',
      archetype: 'Test',
      player: 'Test Player',
      placement: 1,
      region: 'Japan',
      tournament: 'Test Tournament',
      format: 'standard',
      totalCards: 50,
      date: new Date(),
      colors: ['Red'],
      cards: [
        {
          cardId: 'BT1-001',
          name: 'Test Card',
          quantity: 4,
          cardNumber: 'BT1-001',
          image: 'https://example.com/image.jpg',
          type: 'Digimon'
        }
      ]
    };
    
    console.log('Writing deck with cards...');
    
    const docRef = await addDoc(collection(db, 'metaDecks'), deckWithCards);
    console.log('✅ Success! Document ID:', docRef.id);
    
  } catch (error) {
    console.error('❌ Error with cards:', error);
    
    // Try without cards array
    console.log('\nTrying without cards array...');
    const deckWithoutCards = {
      name: 'Test Deck 2',
      archetype: 'Test',
      player: 'Test Player',
      placement: 1,
      region: 'Japan',
      tournament: 'Test Tournament',
      format: 'standard',
      totalCards: 50,
      date: new Date(),
      colors: ['Red']
    };
    
    try {
      const docRef2 = await addDoc(collection(db, 'metaDecks'), deckWithoutCards);
      console.log('✅ Success without cards! Document ID:', docRef2.id);
    } catch (error2) {
      console.error('❌ Error without cards:', error2);
    }
  }
}

testMinimalWrite();