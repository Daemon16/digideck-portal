import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Grid, List } from 'lucide-react';
import { useCards } from '../hooks/useFirestore';
import { DigimonCard } from '../utils/types';

export default function CardsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [colorFilter, setColorFilter] = useState('');
  const [setFilter, setSetFilter] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const { cards, loading, error } = useCards({
    type: typeFilter || undefined,
    color: colorFilter || undefined,
    set: setFilter || undefined,
    searchTerm: searchTerm || undefined,
  });

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-digi-blue border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Loading cards...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error loading cards: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="digi-button"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Card Database</h1>
          <p className="text-gray-400">
            Search through {cards.length} live Digimon TCG cards with advanced filters
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search cards by name or effect..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="digi-input w-full pl-10"
              />
            </div>

            {/* View Toggle */}
            <div className="flex bg-digi-gray rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-digi-blue text-white' : 'text-gray-400'}`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-digi-blue text-white' : 'text-gray-400'}`}
              >
                <List size={20} />
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="digi-input"
            >
              <option value="">All Types</option>
              <option value="Digimon">Digimon</option>
              <option value="Tamer">Tamer</option>
              <option value="Option">Option</option>
            </select>

            <select
              value={colorFilter}
              onChange={(e) => setColorFilter(e.target.value)}
              className="digi-input"
            >
              <option value="">All Colors</option>
              <option value="Red">Red</option>
              <option value="Blue">Blue</option>
              <option value="Yellow">Yellow</option>
              <option value="Green">Green</option>
              <option value="Black">Black</option>
              <option value="Purple">Purple</option>
              <option value="White">White</option>
            </select>

            <select
              value={setFilter}
              onChange={(e) => setSetFilter(e.target.value)}
              className="digi-input"
            >
              <option value="">All Sets</option>
              <option value="BT01">BT01 - New Evolution</option>
              <option value="BT02">BT02 - Ultimate Power</option>
              <option value="BT03">BT03 - Union Impact</option>
              <option value="BT04">BT04 - Great Legend</option>
              <option value="BT05">BT05 - Battle of Omni</option>
            </select>
          </div>
        </div>

        {/* Cards Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {cards.map((card, index) => (
              <CardGridItem key={card.id} card={card} index={index} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {cards.map((card, index) => (
              <CardListItem key={card.id} card={card} index={index} />
            ))}
          </div>
        )}

        {cards.length === 0 && (
          <div className="text-center py-12">
            <Filter className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-400">No cards found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}

function CardGridItem({ card, index }: { card: DigimonCard; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ scale: 1.05, rotateY: 5 }}
      className="digi-card group cursor-pointer"
    >
      <div className="aspect-[3/4] bg-digi-gray rounded-lg mb-3 overflow-hidden">
        <img
          src={card.image || `https://via.placeholder.com/300x400/1a1a2e/ffffff?text=${encodeURIComponent(card.name)}`}
          alt={card.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      
      <h3 className="font-bold text-white mb-1 group-hover:text-digi-blue transition-colors">
        {card.name}
      </h3>
      
      <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
        <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(card.type)}`}>
          {card.type}
        </span>
        <span>{card.rarity}</span>
      </div>
      
      <p className="text-xs text-gray-400 line-clamp-3">
        {card.effects}
      </p>
    </motion.div>
  );
}

function CardListItem({ card, index }: { card: DigimonCard; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.02 }}
      className="digi-card flex gap-4 hover:border-digi-blue/60"
    >
      <div className="w-20 h-28 bg-digi-gray rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={card.image || `https://via.placeholder.com/80x112/1a1a2e/ffffff?text=${encodeURIComponent(card.name.slice(0, 3))}`}
          alt={card.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="flex-1">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-white text-lg">{card.name}</h3>
          <span className="text-sm text-gray-400">{card.cardNumber}</span>
        </div>
        
        <div className="flex items-center gap-2 mb-2">
          <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(card.type)}`}>
            {card.type}
          </span>
          <span className="text-sm text-gray-400">{card.rarity}</span>
          <span className="text-sm text-gray-400">{card.set}</span>
        </div>
        
        <p className="text-sm text-gray-400 line-clamp-2">
          {card.effects}
        </p>
        
        {card.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {card.keywords.map((keyword) => (
              <span
                key={keyword}
                className="px-2 py-1 bg-digi-blue/20 text-digi-blue text-xs rounded"
              >
                {keyword}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function getTypeColor(type: string): string {
  switch (type) {
    case 'Digimon':
      return 'bg-digi-blue/20 text-digi-blue';
    case 'Tamer':
      return 'bg-digi-orange/20 text-digi-orange';
    case 'Option':
      return 'bg-digi-purple/20 text-digi-purple';
    default:
      return 'bg-gray-600/20 text-gray-400';
  }
}