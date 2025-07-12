import { useState, useEffect, useCallback, useMemo } from 'react';
import { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '../utils/supabase';
import { DigimonCard, CardFilters } from '../utils/types';

interface UseCardsResult {
  cards: DigimonCard[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  searchCards: (query: string) => Promise<void>;
  loadMore: () => Promise<void>;
  totalCount: number;
}

const CARDS_PER_PAGE = 20;

export function useCardsWithPagination(filters: CardFilters = {}): UseCardsResult {
  const [cards, setCards] = useState<DigimonCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  // Memoize the filter conditions to prevent unnecessary query rebuilds
  const filterConditions = useMemo(() => ({
    type: filters.type,
    color: filters.color,
    set: filters.set,
    searchTerm: filters.searchTerm
  }), [filters.type, filters.color, filters.set, filters.searchTerm]);

  const fetchCards = useCallback(async (page = 0, append = false) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      // Build the base query
      let query = supabase
        .from('cards')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filterConditions.type) {
        query = query.eq('type', filterConditions.type);
      }
      if (filterConditions.color) {
        query = query.contains('color', [filterConditions.color]);
      }
      if (filterConditions.set) {
        query = query.contains('set_names', [filterConditions.set]);
      }

      // Apply search with improved text search
      if (filterConditions.searchTerm?.trim()) {
        query = query.or(`name.ilike.%${filterConditions.searchTerm}%,effects.ilike.%${filterConditions.searchTerm}%`);
      }

      // Get total count first
      const { count } = await query;
      if (count !== null) {
        setTotalCount(count);
      }

      // Apply pagination and ordering
      query = query
        .order('name')
        .range(page * CARDS_PER_PAGE, (page + 1) * CARDS_PER_PAGE - 1);

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error('No data returned from the server');
      }

      const transformedCards = data.map(card => ({
        id: card.id,
        name: card.name,
        cardNumber: card.card_number,
        type: card.type,
        form: card.form,
        level: card.level,
        image: card.image,
        effects: card.effects,
        color: card.color || [],
        set: card.set_names || [],
        rarity: card.rarity,
        keywords: card.keywords || [],
        playCost: card.play_cost,
        evolutionCost: card.evolution_cost,
        dp: card.dp,
        traits: card.traits || [],
        attribute: card.attribute,
        createdAt: new Date(card.created_at),
        updatedAt: new Date(card.updated_at)
      }));

      setCards(prev => append ? [...prev, ...transformedCards] : transformedCards);
      setHasMore(transformedCards.length === CARDS_PER_PAGE);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 
        err instanceof PostgrestError ? err.message :
        'Failed to fetch cards';
      setError(errorMessage);
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [filterConditions]);

  const searchCards = useCallback(async (query: string) => {
    setCurrentPage(0);
    await fetchCards(0, false);
  }, [fetchCards]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loading || loadingMore) return;
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    await fetchCards(nextPage, true);
  }, [fetchCards, currentPage, hasMore, loading, loadingMore]);

  // Reset and fetch cards when filters change
  useEffect(() => {
    setCurrentPage(0);
    fetchCards(0, false);
  }, [filterConditions, fetchCards]);

  return { 
    cards, 
    loading, 
    error, 
    hasMore, 
    loadingMore, 
    searchCards, 
    loadMore,
    totalCount 
  };
}