// Digimon TCG Ban/Restricted List
// Updated as of latest format - you should update this regularly

export interface BanlistEntry {
  cardNumber: string;
  name: string;
  restriction: 'banned' | 'limited'; // limited = max 1 copy
}

export const BANLIST: BanlistEntry[] = [
  // Banned cards (0 copies allowed)
  { cardNumber: 'BT5-109', name: 'Mega Digimon Fusion!', restriction: 'banned' },
  { cardNumber: 'BT2-090', name: 'Matt Ishida', restriction: 'banned' },
  
  // Limited cards (1 copy max)
  { cardNumber: 'BT3-103', name: 'Hidden Potential Discovered!', restriction: 'limited' },
  { cardNumber: 'BT2-047', name: 'Argomon', restriction: 'limited' },
  { cardNumber: 'EX1-068', name: 'Ice Wall!', restriction: 'limited' },
  { cardNumber: 'BT6-100', name: 'Reinforcing Memory Boost!', restriction: 'limited' },
  { cardNumber: 'BT7-038', name: 'JetSilphymon', restriction: 'limited' },
  { cardNumber: 'BT7-072', name: 'Eyesmon', restriction: 'limited' },
  { cardNumber: 'BT10-009', name: 'Shoutmon X4', restriction: 'limited' },
  { cardNumber: 'BT7-064', name: 'DoruGreymon', restriction: 'limited' },
  { cardNumber: 'BT9-099', name: 'Sunrise Blaster', restriction: 'limited' },
  { cardNumber: 'BT7-107', name: 'Calling from Darkness', restriction: 'limited' },
  { cardNumber: 'BT11-064', name: 'Greymon (X Antibody)', restriction: 'limited' },
  { cardNumber: 'P-025', name: 'GranKuwagamon', restriction: 'limited' },
  { cardNumber: 'P-008', name: 'WereGarurumon', restriction: 'limited' },
  { cardNumber: 'EX2-039', name: 'Impmon', restriction: 'limited' },
  { cardNumber: 'BT3-054', name: 'Blossomon', restriction: 'limited' },
  { cardNumber: 'BT7-069', name: 'Eyesmon: Scatter Mode', restriction: 'limited' },
  { cardNumber: 'EX4-019', name: 'MachGaogamon', restriction: 'limited' },
  { cardNumber: 'BT13-012', name: 'GeoGreymon', restriction: 'limited' },
  { cardNumber: 'BT2-069', name: 'Gabumon', restriction: 'limited' },
  { cardNumber: 'EX5-015', name: 'Gabumon (X Antibody)', restriction: 'limited' },
  { cardNumber: 'EX5-018', name: 'Garurumon (X Antibody)', restriction: 'limited' },
  { cardNumber: 'EX5-062', name: 'Anubismon', restriction: 'limited' },
  { cardNumber: 'BT15-102', name: 'Apocalymon', restriction: 'limited' },
  { cardNumber: 'BT14-002', name: 'Bukamon', restriction: 'limited' },
  { cardNumber: 'P-123', name: 'Ukkomon', restriction: 'limited' },
  { cardNumber: 'P-130', name: 'Lui Ohwada', restriction: 'limited' },
  { cardNumber: 'BT13-012', name: 'P-130', restriction: 'limited' },
  { cardNumber: 'ST2-13', name: 'Hammer Spark', restriction: 'limited' },
  { cardNumber: 'BT9-098', name: 'Awakening of the Golden Knight', restriction: 'limited' },
  { cardNumber: 'BT15-057', name: 'Numemon (X Antibody)', restriction: 'limited' },
  { cardNumber: 'BT14-084', name: 'T.K. Takaishi', restriction: 'limited' },
  { cardNumber: 'BT4-111', name: 'Jack Raid', restriction: 'limited' },
  { cardNumber: 'BT17-069', name: 'Fenriloogamon', restriction: 'limited' },
  { cardNumber: 'BT4-104', name: 'Blinding Ray', restriction: 'limited' },
  { cardNumber: 'EX4-030', name: 'Kuzuhamon', restriction: 'limited' },
  { cardNumber: 'P-029', name: 'Agunimon', restriction: 'limited' },
  { cardNumber: 'P-030', name: 'Lobomon', restriction: 'limited' },
  { cardNumber: 'BT11-033', name: 'MirageGaogamon', restriction: 'limited' },
  { cardNumber: 'ST9-09', name: 'Stingmon', restriction: 'limited' },
  // Add more entries as needed - check official Bandai banlist
];

export function getCardRestriction(cardNumber: string): 'banned' | 'limited' | 'unrestricted' {
  const entry = BANLIST.find(item => item.cardNumber === cardNumber);
  return entry?.restriction || 'unrestricted';
}

export function getMaxCopies(cardNumber: string): number {
  const restriction = getCardRestriction(cardNumber);
  
  if (restriction === 'banned') return 0;
  if (restriction === 'limited') return 1;
  
  // Standard limit for all cards
  return 4;
}