import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import puppeteer from 'puppeteer';

admin.initializeApp();

// Scheduled function to sync cards daily
export const syncCards = functions.pubsub.schedule('0 6 * * *')
  .timeZone('America/New_York')
  .onRun(async (context) => {
    console.log('Starting scheduled card sync...');
    
    try {
      await scrapeAndSyncCards();
      console.log('Card sync completed successfully');
    } catch (error) {
      console.error('Card sync failed:', error);
    }
  });

// Scheduled function to sync tournament decks daily
export const syncDecks = functions.pubsub.schedule('0 8 * * *')
  .timeZone('America/New_York')
  .onRun(async (context) => {
    console.log('Starting scheduled deck sync...');
    
    try {
      await scrapeAndSyncDecks();
      console.log('Deck sync completed successfully');
    } catch (error) {
      console.error('Deck sync failed:', error);
    }
  });

// HTTP function to manually trigger card sync
export const triggerCardSync = functions.https.onRequest(async (req, res) => {
  try {
    await scrapeAndSyncCards();
    res.json({ success: true, message: 'Card sync completed' });
  } catch (error) {
    console.error('Manual card sync failed:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// HTTP function to manually trigger deck sync
export const triggerDeckSync = functions.https.onRequest(async (req, res) => {
  try {
    await scrapeAndSyncDecks();
    res.json({ success: true, message: 'Deck sync completed' });
  } catch (error) {
    console.error('Manual deck sync failed:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

async function scrapeAndSyncCards() {
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.goto('https://digimoncard.dev/cards', { waitUntil: 'networkidle2' });
    
    // Scraping logic similar to syncCards.ts
    const cards = await page.evaluate(() => {
      const cardElements = document.querySelectorAll('.card-item');
      const cardData: any[] = [];
      
      cardElements.forEach((card, index) => {
        if (index > 200) return; // Limit for cloud function
        
        const nameEl = card.querySelector('.card-name');
        const imageEl = card.querySelector('img');
        const typeEl = card.querySelector('.card-type');
        
        if (nameEl && imageEl) {
          cardData.push({
            name: nameEl.textContent?.trim() || '',
            image: imageEl.src || '',
            type: typeEl?.textContent?.trim() || 'Digimon',
            cardNumber: `AUTO-${String(index + 1).padStart(3, '0')}`,
          });
        }
      });
      
      return cardData;
    });
    
    // Save to Firestore
    const db = admin.firestore();
    const batch = db.batch();
    
    cards.forEach((cardData) => {
      const cardRef = db.collection('cards').doc(cardData.cardNumber);
      batch.set(cardRef, {
        ...cardData,
        color: ['Red'], // Default
        rarity: 'Common',
        set: 'AUTO',
        effects: '',
        keywords: [],
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });
    
    await batch.commit();
    console.log(`Synced ${cards.length} cards`);
    
  } finally {
    await browser.close();
  }
}

async function scrapeAndSyncDecks() {
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Try multiple sources
    const sources = [
      'https://digimonmeta.com/tournaments',
      'https://play.limitlesstcg.com/tournaments/completed?game=DIGIMON'
    ];
    
    const allDecks: any[] = [];
    
    for (const url of sources) {
      try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 10000 });
        
        const decks = await page.evaluate(() => {
          const deckElements = document.querySelectorAll('.tournament-result, .deck-result');
          const deckData: any[] = [];
          
          deckElements.forEach((deck, index) => {
            if (index > 50) return; // Limit per source
            
            const playerEl = deck.querySelector('.player-name, .player');
            const archetypeEl = deck.querySelector('.archetype, .deck-name');
            
            if (playerEl && archetypeEl) {
              deckData.push({
                player: playerEl.textContent?.trim() || 'Unknown',
                archetype: archetypeEl.textContent?.trim() || 'Unknown',
                placement: Math.floor(Math.random() * 8) + 1, // Random for demo
                region: 'Global',
                tournament: 'Auto Tournament',
                date: new Date().toISOString(),
              });
            }
          });
          
          return deckData;
        });
        
        allDecks.push(...decks);
      } catch (error) {
        console.error(`Failed to scrape ${url}:`, error);
      }
    }
    
    // Save to Firestore
    const db = admin.firestore();
    const batch = db.batch();
    
    allDecks.forEach((deckData, index) => {
      const deckRef = db.collection('decks').doc(`auto-${Date.now()}-${index}`);
      batch.set(deckRef, {
        id: `auto-${Date.now()}-${index}`,
        name: `${deckData.archetype} - ${deckData.player}`,
        ...deckData,
        cards: [],
        mainDeck: [],
        eggDeck: [],
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });
    
    await batch.commit();
    console.log(`Synced ${allDecks.length} decks`);
    
  } finally {
    await browser.close();
  }
}