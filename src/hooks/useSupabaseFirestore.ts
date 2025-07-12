import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { MetaSet, DetailedDeck } from '../utils/types';

export function useMetaSets() {
  const [data, setData] = useState<MetaSet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSets() {
      try {
        const { data: sets, error } = await supabase
          .from('meta_sets')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        const transformedSets = sets.map(set => ({
          id: set.id,
          name: set.name,
          setId: set.set_id,
          totalDecks: set.total_decks,
          createdAt: new Date(set.created_at)
        }));
        
        setData(transformedSets);
      } catch (error) {
        console.error('Error fetching meta sets:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSets();
  }, []);

  return { data, loading };
}

export function useSetDecks(selectedSet?: MetaSet, options: { region?: string; limit?: number } = {}) {
  const [data, setData] = useState<DetailedDeck[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchDecks = async (reset = false) => {
    if (!selectedSet) return;
    
    setLoading(true);
    
    try {
      let query = supabase
        .from('meta_decks')
        .select('*')
        .eq('set_id', selectedSet.setId);
        
      if (options.region) {
        query = query.eq('region', options.region);
      }
      
      query = query
        .order('placement')
        .limit(options.limit || 12);
        
      if (!reset && data.length > 0) {
        query = query.range(data.length, data.length + (options.limit || 12) - 1);
      }
      
      const { data: decks, error } = await query;
      
      if (error) throw error;
      
      const transformedDecks = decks.map(deck => ({
        id: deck.id,
        archetype: deck.archetype,
        player: deck.player,
        placement: deck.placement,
        region: deck.region,
        tournament: deck.tournament,
        date: deck.date ? new Date(deck.date) : null,
        setId: deck.set_id,
        totalCards: deck.total_cards,
        cards: deck.cards || [],
        createdAt: new Date(deck.created_at)
      }));
      
      if (reset) {
        setData(transformedDecks);
      } else {
        setData(prev => [...prev, ...transformedDecks]);
      }
      
      setHasMore(transformedDecks.length === (options.limit || 12));
    } catch (error) {
      console.error('Error fetching decks:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => fetchDecks(false);

  useEffect(() => {
    if (selectedSet) {
      setData([]);
      setHasMore(true);
      fetchDecks(true);
    }
  }, [selectedSet, options.region]);

  return { data, loading, hasMore, loadMore };
}

export function useSetStats(selectedSet?: MetaSet, options: { region?: string } = {}) {
  const [stats, setStats] = useState({
    totalDecks: 0,
    totalArchetypes: 0,
    totalTournaments: 0,
    totalRegions: 0,
    topArchetypes: [] as { name: string; count: number }[]
  });

  useEffect(() => {
    async function fetchStats() {
      if (!selectedSet) return;
      
      try {
        let query = supabase
          .from('meta_decks')
          .select('archetype, tournament, region')
          .eq('set_id', selectedSet.setId);
          
        if (options.region) {
          query = query.eq('region', options.region);
        }
        
        const { data: decks, error } = await query;
        
        if (error) throw error;
        
        const archetypes = new Map<string, number>();
        const tournaments = new Set<string>();
        const regions = new Set<string>();
        
        decks.forEach(deck => {
          archetypes.set(deck.archetype, (archetypes.get(deck.archetype) || 0) + 1);
          if (deck.tournament) tournaments.add(deck.tournament);
          if (deck.region) regions.add(deck.region);
        });
        
        const topArchetypes = Array.from(archetypes.entries())
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count);
        
        setStats({
          totalDecks: decks.length,
          totalArchetypes: archetypes.size,
          totalTournaments: tournaments.size,
          totalRegions: regions.size,
          topArchetypes
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    }

    fetchStats();
  }, [selectedSet, options.region]);

  return { stats };
}