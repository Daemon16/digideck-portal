import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

interface DigimonSet {
  code: string;
  name: string;
  category: 'booster' | 'starter' | 'special' | 'promo';
}

export function useSets() {
  const [sets, setSets] = useState<DigimonSet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSets() {
      try {
        // Get unique set names from cards table
        const { data, error } = await supabase
          .from('cards')
          .select('set_names')
          .not('set_names', 'is', null);
          
        if (error) throw error;
        
        // Extract unique sets
        const uniqueSets = new Set<string>();
        data.forEach(card => {
          if (card.set_names && Array.isArray(card.set_names)) {
            card.set_names.forEach(setName => uniqueSets.add(setName));
          }
        });
        
        const setsData = Array.from(uniqueSets).map(setName => ({
          code: setName.split(' ')[0] || setName,
          name: setName,
          category: getCategoryFromCode(setName.split(' ')[0] || setName)
        }));
        
        setSets(setsData.sort((a, b) => a.code.localeCompare(b.code)));
      } catch (error) {
        // Fallback to hardcoded comprehensive list
        setSets(getHardcodedSets());
      } finally {
        setLoading(false);
      }
    }

    fetchSets();
  }, []);

  return { sets, loading };
}

function getCategoryFromCode(code: string): 'booster' | 'starter' | 'special' | 'promo' {
  if (code.startsWith('BT')) return 'booster';
  if (code.startsWith('ST')) return 'starter';
  if (code.startsWith('EX')) return 'special';
  return 'promo';
}

function getHardcodedSets(): DigimonSet[] {
  return [
    // Booster Sets (Updated to BT21)
    { code: 'BT1.0', name: 'BT1.0 - Special Booster', category: 'booster' },
    { code: 'BT1.5', name: 'BT1.5 - Special Booster', category: 'booster' },
    { code: 'BT04', name: 'BT04 - Great Legend', category: 'booster' },
    { code: 'BT05', name: 'BT05 - Battle of Omni', category: 'booster' },
    { code: 'BT06', name: 'BT06 - Double Diamond', category: 'booster' },
    { code: 'BT07', name: 'BT07 - Next Adventure', category: 'booster' },
    { code: 'BT08', name: 'BT08 - New Awakening', category: 'booster' },
    { code: 'BT09', name: 'BT09 - X Record', category: 'booster' },
    { code: 'BT10', name: 'BT10 - Xros Encounter', category: 'booster' },
    { code: 'BT11', name: 'BT11 - Dimensional Phase', category: 'booster' },
    { code: 'BT12', name: 'BT12 - Across Time', category: 'booster' },
    { code: 'BT13', name: 'BT13 - Versus Royal Knights', category: 'booster' },
    { code: 'BT14', name: 'BT14 - Blast Ace', category: 'booster' },
    { code: 'BT15', name: 'BT15 - Exceed Apocalypse', category: 'booster' },
    { code: 'BT16', name: 'BT16 - Beginning Observer', category: 'booster' },
    { code: 'BT17', name: 'BT17 - Secret Crisis', category: 'booster' },
    { code: 'BT2.0', name: 'BT2.0 - Special Booster', category: 'booster' },
    { code: 'BT2.5', name: 'BT2.5 - Special Booster', category: 'booster' },
    { code: 'BT21', name: 'BT21 - World Convergence', category: 'booster' },
    
    // Special Sets (Updated to EX09)
    { code: 'EX01', name: 'EX01 - Classic Collection', category: 'special' },
    { code: 'EX02', name: 'EX02 - Digital Hazard', category: 'special' },
    { code: 'EX03', name: 'EX03 - Draconic Roar', category: 'special' },
    { code: 'EX04', name: 'EX04 - Alternative Being', category: 'special' },
    { code: 'EX05', name: 'EX05 - Animal Colosseum', category: 'special' },
    { code: 'EX06', name: 'EX06 - Infernal Ascension', category: 'special' },
    { code: 'EX07', name: 'EX07 - Digimon Liberator', category: 'special' },
    { code: 'EX08', name: 'EX08 - Chain of Liberation', category: 'special' },
    { code: 'EX09', name: 'EX09 - Versus Monsters', category: 'special' },
    
    // Starter Decks
    { code: 'ST01', name: 'ST01 - Gaia Red', category: 'starter' },
    { code: 'ST02', name: 'ST02 - Cocytus Blue', category: 'starter' },
    { code: 'ST03', name: 'ST03 - Heaven\'s Yellow', category: 'starter' },
    { code: 'ST04', name: 'ST04 - Giga Green', category: 'starter' },
    { code: 'ST05', name: 'ST05 - Machine Black', category: 'starter' },
    { code: 'ST06', name: 'ST06 - Venomous Violet', category: 'starter' },
    { code: 'ST07', name: 'ST07 - Gallantmon', category: 'starter' },
    { code: 'ST08', name: 'ST08 - UlforceVeedramon', category: 'starter' },
    { code: 'ST09', name: 'ST09 - Ultimate Ancient', category: 'starter' },
    { code: 'ST10', name: 'ST10 - Parallel World Tactician', category: 'starter' },
    { code: 'ST12', name: 'ST12 - Jesmon', category: 'starter' },
    { code: 'ST13', name: 'ST13 - RagnaLoardmon', category: 'starter' },
    { code: 'ST14', name: 'ST14 - Beelzemon', category: 'starter' },
    { code: 'ST15', name: 'ST15 - Dragon of Courage', category: 'starter' },
    { code: 'ST16', name: 'ST16 - Wolf of Friendship', category: 'starter' },
    { code: 'ST17', name: 'ST17 - Double Typhoon', category: 'starter' },
    { code: 'ST18', name: 'ST18 - Guardian Vortex', category: 'starter' },
    
    // Promotional
    { code: 'P', name: 'P - Promotional', category: 'promo' },
  ];
}