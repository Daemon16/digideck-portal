import { config } from 'dotenv';
config({ path: '../.env' });
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { TournamentDeck } from '../src/utils/types';

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

// Helper functions
const cleanString = (str: string) => {
  if (!str) return '';
  return str
    .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Remove control characters
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove Unicode control chars
    .replace(/[\uFEFF\uFFFE\uFFFF]/g, '') // Remove BOM and other problematic chars
    .trim()
    .substring(0, 500); // Limit length
};

const cleanUrl = (url: string) => {
  if (!url) return '';
  try {
    // Basic URL validation
    if (url.startsWith('http') && url.includes('digimonmeta.com')) {
      return url.substring(0, 2000); // Limit URL length
    }
    return '';
  } catch {
    return '';
  }
};

const parseDate = (dateStr: string) => {
  try {
    if (!dateStr) return new Date();
    const parsed = new Date(dateStr);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  } catch {
    return new Date();
  }
};

const cleanSetName = (str: string) => {
  if (!str) return '';
  return str
    .replace(/[^a-zA-Z0-9\s]/g, '') // Keep only letters, numbers, and spaces
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();
};

async function scrapeLatestMeta(): Promise<void> {
  try {
    console.log('🎯 Starting meta scraping with pagination from digimonmeta.com...');
    
    const baseUrl = 'https://digimonmeta.com/deck-list/decklist-jp-cn-en-ex9-versus-monsters-bt22-cyber-eden/';
    const metaSetsCollection = collection(db, 'metaSets');
    let totalProcessedDecks = 0;
    let currentPage = 1;
    let hasMorePages = true;
    let setName = '';
    let allDecks: TournamentDeck[] = [];
    
    while (hasMorePages) {
      const pageUrl = currentPage === 1 ? baseUrl : `${baseUrl}page/${currentPage}/`;
      console.log(`📊 Fetching page ${currentPage}: ${pageUrl}`);
      
      try {
        const response = await fetch(pageUrl);
        const html = await response.text();
        
        // Extract set name from h2 tag on first page
        if (currentPage === 1) {
          setName = extractSetName(html);
          console.log(`📦 Set name: ${setName}`);
        }
        
        if (html.includes('404') || html.includes('Not Found')) {
          console.log(`📄 Page ${currentPage} not found, stopping pagination`);
          hasMorePages = false;
          break;
        }
        
        const pageDecks = await extractDecksFromPage(html, currentPage);
        
        if (pageDecks.length === 0) {
          console.log(`📄 No decks found on page ${currentPage}, stopping pagination`);
          hasMorePages = false;
          break;
        }
        
        allDecks.push(...pageDecks);
        totalProcessedDecks += pageDecks.length;
        
        console.log(`📄 Page ${currentPage}: Found ${pageDecks.length} decks`);
        
        const nextPagePattern = /href="[^"]*page\/(\d+)\/"[^>]*>Next|href="[^"]*page\/(\d+)\/"[^>]*>\d+/;
        const nextPageMatch = html.match(nextPagePattern);
        
        if (!nextPageMatch || pageDecks.length < 10) {
          hasMorePages = false;
        } else {
          currentPage++;
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
      } catch (pageError) {
        console.error(`❌ Error fetching page ${currentPage}:`, pageError);
        hasMorePages = false;
      }
    }
    
    // Save individual decks with set reference
    if (allDecks.length > 0 && setName) {
      const decksCollection = collection(db, 'metaDecks');
      
      for (let i = 0; i < allDecks.length; i++) {
        const deck = {
          ...allDecks[i],
          setName: cleanSetName(setName),
          setId: cleanSetName(setName).toLowerCase().replace(/[^a-z0-9]/g, '-')
        };
        
        try {
          const docRef = await addDoc(decksCollection, deck);
          console.log(`✅ Saved deck ${i + 1}/${allDecks.length}: ${deck.name} by ${deck.player} (Set: ${setName})`);
        } catch (saveError) {
          console.error(`❌ Error saving deck ${i + 1}: ${saveError}`);
        }
        
        // Small delay between saves
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      // Save set metadata
      const setMetadata = {
        name: cleanSetName(setName),
        setId: cleanSetName(setName).toLowerCase().replace(/[^a-z0-9]/g, '-'),
        totalDecks: allDecks.length,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const setDocRef = await addDoc(metaSetsCollection, setMetadata);
      console.log(`✅ Saved set metadata "${setName}" (ID: ${setDocRef.id})`);
    }
    
    console.log(`🌟 Successfully processed ${totalProcessedDecks} tournament decks from ${currentPage - 1} pages`);
    
  } catch (error) {
    console.error('💥 Error scraping meta:', error);
    console.log('📝 Creating fallback meta data...');
    await createFallbackMeta();
  }
}

async function extractDecksFromPage(html: string, pageNumber: number): Promise<TournamentDeck[]> {
  const decks: TournamentDeck[] = [];
  
  // Find the table with deck data
  const tableMatch = html.match(/<table[^>]*>([\s\S]*?)<\/table>/);
  if (!tableMatch) {
    console.log(`⚠️ No table found on page ${pageNumber}`);
    return decks;
  }
  
  // Extract all table rows
  const rowPattern = /<tr[^>]*>([\s\S]*?)<\/tr>/g;
  const rows = [...tableMatch[1].matchAll(rowPattern)];
  
  console.log(`📋 Found ${rows.length} table rows on page ${pageNumber}`);
  
  // Skip header row and process all data rows
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i][1];
    
    // Extract cell data
    const cellPattern = /<td[^>]*>([\s\S]*?)<\/td>/g;
    const cells = [...row.matchAll(cellPattern)];
    
    // Clean cell content
    const cleanCell = (html: string) => html.replace(/<[^>]*>/g, '').trim();
    
    if (cells.length < 11) {
      continue; // Skip incomplete rows
    }
    
    const detailsHtml = cells[0][1]; // Details (contains link)
    const color = cleanCell(cells[2][1]); // Color
    const deckProfile = cleanCell(cells[3][1]); // Deck Profile (archetype)
    const date = cleanCell(cells[5][1]); // Date
    const country = cleanCell(cells[6][1]); // Country
    const author = cleanCell(cells[7][1]); // Author (player)
    const placement = cleanCell(cells[8][1]); // Placement
    const tournament = cleanCell(cells[9][1]); // Tournament
    const host = cleanCell(cells[10][1]); // Host
    
    // Find the td with column-2 class from current row cells
    let detailsUrl = null;
    let column2Cell = null;
    
    for (let j = 0; j < cells.length; j++) {
      const cellHtml = cells[j][0]; // Full cell HTML including tags
      if (cellHtml.includes('column-2')) {
        column2Cell = cells[j][1]; // Cell content
        const urlMatch = column2Cell.match(/href=['"]([^'"]+)['"]/); // Handle both single and double quotes
        detailsUrl = urlMatch ? urlMatch[1] : null;
        
        // Build the correct URL format
        if (detailsUrl && !detailsUrl.startsWith('http')) {
          // Decode HTML entities first
          detailsUrl = detailsUrl.replace(/&amp;/g, '&');
          // Build proper URL with deck-list path
          detailsUrl = `https://digimonmeta.com/deck-list/${detailsUrl}`;
        }
        break;
      }
    }
    
    // Skip empty rows
    if (!deckProfile || !author) {
      continue;
    }
    
    // Scrape deck cards if details URL exists
    let deckCards: any[] = [];
    if (detailsUrl) {
      deckCards = await scrapeDeckCards(detailsUrl);
      console.log(`🃏 ${deckProfile} by ${author}: ${deckCards.length} cards`);
    }
    
    // Use global helper functions
    
    const tournamentDeck = {
      name: cleanString(deckProfile) || 'Unknown Deck',
      archetype: cleanString(deckProfile) || 'Unknown',
      player: cleanString(author) || 'Unknown Player',
      placement: Math.max(1, parseInt((placement || '1').replace(/[^0-9]/g, '')) || 1),
      region: cleanString(country) || 'Unknown',
      tournament: cleanString(`${tournament || ''} ${host || ''}`) || 'Unknown Tournament',
      format: 'standard',
      cards: deckCards.slice(0, 50), // Smaller limit
      totalCards: Math.min(50, deckCards.reduce((sum, card) => sum + (card.quantity || 0), 0) || 50),
      colors: [cleanString(color) || 'Yellow'],
      date: parseDate(date)
    };
    
    decks.push(tournamentDeck);
  }
  
  return decks;
}

async function scrapeDeckCards(detailsUrl: string): Promise<any[]> {
  try {
    const response = await fetch(detailsUrl);
    const html = await response.text();
    const cards: any[] = [];
    
    // Look for all div elements with class "column" in the entire HTML
    const columnPattern = /<div[^>]*class="column"[^>]*>([\s\S]*?)<\/div>/gi;
    const columnMatches = [...html.matchAll(columnPattern)];
    
    for (const columnMatch of columnMatches) {
      const columnHtml = columnMatch[1];
      
      // Look for img with digimonmeta.com src within this column
      const imgMatch = columnHtml.match(/<img[^>]*src="([^"]*digimonmeta\.com[^"]+)"[^>]*>/i);
      if (!imgMatch) continue;
      
      const imageUrl = imgMatch[1];
      
      // Skip non-card images (logos, backgrounds, etc.)
      if (imageUrl.includes('LOGO') || imageUrl.includes('webp') || imageUrl.includes('wp-content/uploads/20')) {
        continue;
      }
      
      // Look for figcaption within this column
      const figcaptionMatch = columnHtml.match(/<figcaption[^>]*>([^<]+)<\/figcaption>/i);
      
      if (figcaptionMatch) {
        // Extract quantity from figcaption (remove 'x' and trim)
        const quantityText = figcaptionMatch[1].trim().replace(/^x\s*/, '');
        const quantity = parseInt(quantityText) || 1;
        
        // Extract card number from image URL
        const cardNumberMatch = imageUrl.match(/([A-Z0-9-]+)(?:\.(jpg|png|jpeg))?$/i);
        const cardNumber = cardNumberMatch ? cardNumberMatch[1] : `card-${cards.length}`;
        
        // Validate and clean card data
        const cleanCardNumber = cleanString(cardNumber);
        const cleanImageUrl = cleanUrl(imageUrl);
        const validQuantity = Math.max(1, Math.min(4, quantity || 1));
        
        if (cleanCardNumber && cleanImageUrl && cleanCardNumber.length > 0) {
          cards.push({
            cardId: cleanCardNumber,
            name: cleanCardNumber,
            quantity: validQuantity,
            cardNumber: cleanCardNumber,
            image: cleanImageUrl,
            type: cleanCardNumber.toLowerCase().includes('st') ? 'Digitama' : 'Digimon'
          });
        }
      }
    }
    
    return cards;
  } catch (error) {
    console.error(`❌ Error parsing deck cards from ${detailsUrl}:`, error);
    return [];
  }
}



function extractSetName(html: string): string {
  // Look for h2 tag with class elementor-heading-title
  const h2Match = html.match(/<h2[^>]*class="[^"]*elementor-heading-title[^"]*"[^>]*>([^<]+)<\/h2>/i);
  
  if (h2Match) {
    const fullTitle = h2Match[1].trim();
    console.log(`📋 Full title: ${fullTitle}`);
    
    // Extract only the set part (after the colon)
    // Example: "JP + CN + EN Decks: EX9 (Versus Monsters) + BT22 (Cyber Eden)" -> "EX9 (Versus Monsters) + BT22 (Cyber Eden)"
    const colonIndex = fullTitle.indexOf(':');
    let setName = colonIndex !== -1 ? fullTitle.substring(colonIndex + 1).trim() : fullTitle;
    
    // Clean the set name to remove special characters
    setName = cleanSetName(setName);
    console.log(`📦 Cleaned set name: ${setName}`);
    
    return setName;
  }
  
  return 'Unknown Set';
}

async function createFallbackMeta(): Promise<void> {
  const metaSetsCollection = collection(db, 'metaSets');
  
  const fallbackDecks = [
    {
      name: 'Imperialdramon Control',
      archetype: 'Imperialdramon',
      player: 'Sample Player 1',
      placement: 1,
      region: 'Japan',
      tournament: 'EX9 Versus Monsters & BT22 Cyber Eden',
      date: new Date(),
      format: 'standard',
      cards: [],
      totalCards: 50,
      colors: ['Blue']
    },
    {
      name: 'Jesmon Aggro',
      archetype: 'Jesmon',
      player: 'Sample Player 2',
      placement: 2,
      region: 'USA',
      tournament: 'EX9 Versus Monsters & BT22 Cyber Eden',
      date: new Date(),
      format: 'standard',
      cards: [],
      totalCards: 50,
      colors: ['Red']
    }
  ];
  
  const setName = 'EX9 (Versus Monsters) + BT22 (Cyber Eden)';
  const decksCollection = collection(db, 'metaDecks');
  
  // Save individual decks
  for (const deck of fallbackDecks) {
    const deckWithSet = {
      ...deck,
      setName: cleanSetName(setName),
      setId: cleanSetName(setName).toLowerCase().replace(/[^a-z0-9]/g, '-')
    };
    
    const docRef = await addDoc(decksCollection, deckWithSet);
    console.log(`✅ Seeded fallback deck: ${deck.name}`);
  }
  
  // Save set metadata
  const setMetadata = {
    name: cleanSetName(setName),
    setId: cleanSetName(setName).toLowerCase().replace(/[^a-z0-9]/g, '-'),
    totalDecks: fallbackDecks.length,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  const setDocRef = await addDoc(metaSetsCollection, setMetadata);
  console.log(`✅ Seeded fallback set metadata: ${setName}`);
}

scrapeLatestMeta();