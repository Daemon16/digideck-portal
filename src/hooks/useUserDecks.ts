import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { useAuth } from './useAuth';
import { UserDeck, DeckCard } from '../utils/types';

export function useUserDecks() {
  const [decks, setDecks] = useState<UserDeck[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, incrementActivity } = useAuth();

  const fetchDecks = async () => {
    if (!user) {
      setDecks([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_decks')
        .select('*')
        .eq('user_id', user?.id || '')
        .order('updated_at', { ascending: false });
        
      if (error) throw error;
      
      const transformedDecks: UserDeck[] = data.map(deck => ({
        id: deck.id,
        name: deck.name,
        description: deck.description,
        userId: deck.user_id,
        format: deck.format,
        cards: deck.cards || [],
        createdAt: new Date(deck.created_at),
        updatedAt: new Date(deck.updated_at)
      }));
      
      setDecks(transformedDecks);
    } catch (error) {
      console.error('Error fetching decks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDecks();
  }, [user]);

  const createDeck = async (params: { name: string; description?: string; format?: string }): Promise<UserDeck | null> => {
    if (!user) return null;

    const newDeck: Omit<UserDeck, 'id' | 'createdAt' | 'updatedAt'> = {
      name: params.name,
      description: params.description,
      userId: user.id,
      format: params.format || 'standard',
      cards: []
    };

    try {
      const { data: deck, error } = await supabase
        .from('user_decks')
        .insert([{
          name: newDeck.name,
          description: newDeck.description,
          user_id: newDeck.userId,
          format: newDeck.format,
          cards: newDeck.cards
        }])
        .select()
        .single();

      if (error) throw error;

      const transformedDeck: UserDeck = {
        id: deck.id,
        name: deck.name,
        description: deck.description,
        userId: deck.user_id,
        format: deck.format,
        cards: deck.cards || [],
        createdAt: new Date(deck.created_at),
        updatedAt: new Date(deck.updated_at)
      };

      setDecks(prev => [transformedDeck, ...prev]);
      return transformedDeck;
      
    } catch (error) {
      console.error('Error creating deck:', error);
      return null;
    }
  };

  const updateDeck = async (deck: UserDeck): Promise<void> => {
    try {
      const { error } = await supabase
        .from('user_decks')
        .update({
          name: deck.name,
          description: deck.description,
          cards: deck.cards,
          updated_at: new Date().toISOString()
        })
        .eq('id', deck.id);
        
      if (error) throw error;
      
      setDecks(prev => prev.map(d => d.id === deck.id ? { ...deck, updatedAt: new Date() } : d));
    } catch (error) {
      console.error('Error updating deck:', error);
    }
  };

  const deleteDeck = async (deckId: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('user_decks')
        .delete()
        .eq('id', deckId);
        
      if (error) throw error;
      
      setDecks(prev => prev.filter(d => d.id !== deckId));
    } catch (error) {
      console.error('Error deleting deck:', error);
    }
  };

  return {
    decks,
    loading,
    createDeck,
    updateDeck,
    deleteDeck,
  };
}