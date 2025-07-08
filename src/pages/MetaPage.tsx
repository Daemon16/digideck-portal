import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Calendar, MapPin, Users, TrendingUp } from 'lucide-react';
import { useDecks } from '../hooks/useFirestore';
import { TournamentDeck } from '../utils/types';

export default function MetaPage() {
  const [regionFilter, setRegionFilter] = useState('');
  const [archetypeFilter, setArchetypeFilter] = useState('');
  
  const { data: decks, loading, error } = useDecks({
    region: regionFilter || undefined,
    archetype: archetypeFilter || undefined,
    limit: 50,
  });

  const topArchetypes = getTopArchetypes(decks);
  const recentTournaments = getRecentTournaments(decks);

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-digi-orange border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Loading tournament data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Meta Analysis</h1>
          <p className="text-gray-400">
            Live tournament results and deck performance from competitive play
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-4">
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="digi-input"
          >
            <option value="">All Regions</option>
            <option value="NA">North America</option>
            <option value="EU">Europe</option>
            <option value="JP">Japan</option>
            <option value="APAC">Asia Pacific</option>
          </select>

          <select
            value={archetypeFilter}
            onChange={(e) => setArchetypeFilter(e.target.value)}
            className="digi-input"
          >
            <option value="">All Archetypes</option>
            {topArchetypes.map((archetype) => (
              <option key={archetype.name} value={archetype.name}>
                {archetype.name}
              </option>
            ))}
          </select>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="digi-card text-center"
          >
            <Trophy className="mx-auto text-digi-orange mb-2" size={32} />
            <div className="text-2xl font-bold text-white">{decks.length}</div>
            <div className="text-gray-400">Tournament Decks</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="digi-card text-center"
          >
            <Users className="mx-auto text-digi-blue mb-2" size={32} />
            <div className="text-2xl font-bold text-white">{topArchetypes.length}</div>
            <div className="text-gray-400">Active Archetypes</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="digi-card text-center"
          >
            <Calendar className="mx-auto text-digi-purple mb-2" size={32} />
            <div className="text-2xl font-bold text-white">{recentTournaments.length}</div>
            <div className="text-gray-400">Recent Events</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="digi-card text-center"
          >
            <TrendingUp className="mx-auto text-digi-green mb-2" size={32} />
            <div className="text-2xl font-bold text-white">
              {Math.round(getAverageWinRate(decks) * 100)}%
            </div>
            <div className="text-gray-400">Avg Win Rate</div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Archetypes */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="digi-card"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Trophy className="mr-2 text-digi-orange" size={24} />
              Top Archetypes
            </h2>
            
            <div className="space-y-4">
              {topArchetypes.slice(0, 8).map((archetype, index) => (
                <div key={archetype.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-digi-blue to-digi-purple rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <div className="text-white font-medium">{archetype.name}</div>
                      <div className="text-gray-400 text-sm">{archetype.count} decks</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-digi-green font-bold">
                      {Math.round(archetype.winRate * 100)}%
                    </div>
                    <div className="text-gray-400 text-sm">win rate</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Tournament Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="digi-card"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Calendar className="mr-2 text-digi-blue" size={24} />
              Recent Results
            </h2>
            
            <div className="space-y-4">
              {decks.slice(0, 8).map((deck) => (
                <DeckResultItem key={deck.id} deck={deck} />
              ))}
            </div>
          </motion.div>
        </div>

        {/* All Tournament Decks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Tournament Decks</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {decks.map((deck, index) => (
              <DeckCard key={deck.id} deck={deck} index={index} />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function DeckResultItem({ deck }: { deck: TournamentDeck }) {
  const placementColor = deck.placement === 1 ? 'text-yellow-400' : 
                        deck.placement <= 4 ? 'text-gray-300' : 'text-gray-500';
  
  return (
    <div className="flex items-center justify-between p-3 bg-digi-gray/50 rounded-lg">
      <div className="flex items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-3 ${
          deck.placement === 1 ? 'bg-yellow-400 text-black' : 'bg-digi-gray text-white'
        }`}>
          {deck.placement}
        </div>
        <div>
          <div className="text-white font-medium">{deck.player}</div>
          <div className="text-gray-400 text-sm">{deck.archetype}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-gray-400 text-sm flex items-center">
          <MapPin size={12} className="mr-1" />
          {deck.region}
        </div>
        <div className="text-gray-500 text-xs">
          {new Date(deck.date).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}

function DeckCard({ deck, index }: { deck: TournamentDeck; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="digi-card hover:border-digi-orange/60 cursor-pointer"
    >
      <div className="flex items-center justify-between mb-3">
        <span className={`px-2 py-1 rounded text-xs font-bold ${
          deck.placement === 1 ? 'bg-yellow-400 text-black' : 
          deck.placement <= 4 ? 'bg-digi-blue/20 text-digi-blue' : 'bg-digi-gray text-gray-400'
        }`}>
          #{deck.placement}
        </span>
        <span className="text-gray-400 text-sm">{deck.region}</span>
      </div>
      
      <h3 className="text-lg font-bold text-white mb-2">{deck.archetype}</h3>
      <p className="text-gray-400 text-sm mb-3">by {deck.player}</p>
      
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">{deck.tournament}</span>
        <span className="text-gray-500">
          {new Date(deck.date).toLocaleDateString()}
        </span>
      </div>
      
      <div className="mt-3 pt-3 border-t border-digi-gray">
        <div className="text-xs text-gray-400">
          {deck.mainDeck.length} main deck cards
        </div>
      </div>
    </motion.div>
  );
}

function getTopArchetypes(decks: TournamentDeck[]) {
  const archetypeStats: Record<string, { count: number; totalPlacement: number }> = {};
  
  decks.forEach(deck => {
    if (!archetypeStats[deck.archetype]) {
      archetypeStats[deck.archetype] = { count: 0, totalPlacement: 0 };
    }
    archetypeStats[deck.archetype].count++;
    archetypeStats[deck.archetype].totalPlacement += deck.placement;
  });
  
  return Object.entries(archetypeStats)
    .map(([name, stats]) => ({
      name,
      count: stats.count,
      winRate: 1 - (stats.totalPlacement / stats.count / 10), // Simplified win rate calculation
    }))
    .sort((a, b) => b.count - a.count);
}

function getRecentTournaments(decks: TournamentDeck[]) {
  const tournaments = [...new Set(decks.map(deck => deck.tournament))];
  return tournaments.slice(0, 5);
}

function getAverageWinRate(decks: TournamentDeck[]) {
  if (decks.length === 0) return 0;
  const avgPlacement = decks.reduce((sum, deck) => sum + deck.placement, 0) / decks.length;
  return Math.max(0, 1 - (avgPlacement / 10)); // Simplified calculation
}