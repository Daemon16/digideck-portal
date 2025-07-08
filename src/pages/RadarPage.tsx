import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { MapPin, Filter, TrendingUp } from 'lucide-react';
import { useDecks } from '../hooks/useFirestore';

const regions = ['NA', 'EU', 'JP', 'APAC', 'Global'];

export default function RadarPage() {
  const [selectedRegion, setSelectedRegion] = useState('Global');
  const { data: decks } = useDecks({ 
    region: selectedRegion === 'Global' ? undefined : selectedRegion,
    limit: 200 
  });

  const radarData = getRadarData(decks, selectedRegion);
  const regionalComparison = getRegionalComparison(decks);
  const archetypeDistribution = getArchetypeDistribution(decks);

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Regional Radar</h1>
          <p className="text-gray-400">
            Archetype popularity and performance breakdown by region
          </p>
        </div>

        {/* Region Selector */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedRegion === region
                    ? 'bg-digi-blue text-white'
                    : 'bg-digi-gray text-gray-400 hover:text-white hover:bg-digi-gray/80'
                }`}
              >
                <MapPin className="inline mr-2" size={16} />
                {region === 'Global' ? 'Global' : getRegionName(region)}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="digi-card text-center"
          >
            <div className="text-2xl font-bold text-digi-blue">{decks.length}</div>
            <div className="text-gray-400">Total Decks</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="digi-card text-center"
          >
            <div className="text-2xl font-bold text-digi-orange">
              {getUniqueArchetypes(decks).length}
            </div>
            <div className="text-gray-400">Archetypes</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="digi-card text-center"
          >
            <div className="text-2xl font-bold text-digi-purple">
              {getMostPopularArchetype(decks)}
            </div>
            <div className="text-gray-400">Top Archetype</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="digi-card text-center"
          >
            <div className="text-2xl font-bold text-digi-green">
              {Math.round(getAverageWinRate(decks) * 100)}%
            </div>
            <div className="text-gray-400">Avg Win Rate</div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Radar Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="digi-card"
          >
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <TrendingUp className="mr-2 text-digi-blue" size={20} />
              Archetype Performance Radar
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis dataKey="archetype" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 100]} 
                  tick={{ fill: '#9CA3AF', fontSize: 10 }}
                />
                <Radar
                  name="Win Rate"
                  dataKey="winRate"
                  stroke="#00a8ff"
                  fill="#00a8ff"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Radar
                  name="Popularity"
                  dataKey="popularity"
                  stroke="#ff6b35"
                  fill="#ff6b35"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-6 mt-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-digi-blue rounded-full mr-2"></div>
                <span className="text-gray-400 text-sm">Win Rate</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-digi-orange rounded-full mr-2"></div>
                <span className="text-gray-400 text-sm">Popularity</span>
              </div>
            </div>
          </motion.div>

          {/* Regional Comparison */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="digi-card"
          >
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <MapPin className="mr-2 text-digi-orange" size={20} />
              Regional Comparison
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={regionalComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="region" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1a2e', 
                    border: '1px solid #00a8ff',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="deckCount" fill="#8b5cf6" name="Deck Count" />
                <Bar dataKey="avgWinRate" fill="#00d2d3" name="Avg Win Rate %" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Archetype Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="digi-card"
        >
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <Filter className="mr-2 text-digi-purple" size={20} />
            Archetype Distribution - {selectedRegion === 'Global' ? 'Global' : getRegionName(selectedRegion)}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {archetypeDistribution.map((archetype, index) => (
              <motion.div
                key={archetype.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="bg-digi-gray/50 rounded-lg p-4 hover:bg-digi-gray/70 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-white">{archetype.name}</h3>
                  <span className="text-digi-blue font-bold">{archetype.count}</span>
                </div>
                
                <div className="w-full bg-digi-dark rounded-full h-2 mb-2">
                  <div 
                    className="bg-gradient-to-r from-digi-blue to-digi-purple h-2 rounded-full transition-all duration-500"
                    style={{ width: `${archetype.percentage}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">{archetype.percentage.toFixed(1)}% share</span>
                  <span className="text-digi-green">{Math.round(archetype.winRate * 100)}% WR</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function getRadarData(decks: any[], region: string) {
  const archetypeStats: Record<string, { count: number; totalPlacement: number }> = {};
  
  decks.forEach(deck => {
    if (!archetypeStats[deck.archetype]) {
      archetypeStats[deck.archetype] = { count: 0, totalPlacement: 0 };
    }
    archetypeStats[deck.archetype].count++;
    archetypeStats[deck.archetype].totalPlacement += deck.placement;
  });
  
  const totalDecks = decks.length;
  
  return Object.entries(archetypeStats)
    .map(([archetype, stats]) => ({
      archetype: archetype.length > 10 ? archetype.substring(0, 10) + '...' : archetype,
      winRate: Math.round((1 - (stats.totalPlacement / stats.count / 10)) * 100),
      popularity: Math.round((stats.count / totalDecks) * 100),
    }))
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 8);
}

function getRegionalComparison(decks: any[]) {
  const regionStats: Record<string, { count: number; totalPlacement: number }> = {};
  
  decks.forEach(deck => {
    if (!regionStats[deck.region]) {
      regionStats[deck.region] = { count: 0, totalPlacement: 0 };
    }
    regionStats[deck.region].count++;
    regionStats[deck.region].totalPlacement += deck.placement;
  });
  
  return Object.entries(regionStats).map(([region, stats]) => ({
    region: getRegionName(region),
    deckCount: stats.count,
    avgWinRate: Math.round((1 - (stats.totalPlacement / stats.count / 10)) * 100),
  }));
}

function getArchetypeDistribution(decks: any[]) {
  const archetypeStats: Record<string, { count: number; totalPlacement: number }> = {};
  
  decks.forEach(deck => {
    if (!archetypeStats[deck.archetype]) {
      archetypeStats[deck.archetype] = { count: 0, totalPlacement: 0 };
    }
    archetypeStats[deck.archetype].count++;
    archetypeStats[deck.archetype].totalPlacement += deck.placement;
  });
  
  const totalDecks = decks.length;
  
  return Object.entries(archetypeStats)
    .map(([name, stats]) => ({
      name,
      count: stats.count,
      percentage: (stats.count / totalDecks) * 100,
      winRate: 1 - (stats.totalPlacement / stats.count / 10),
    }))
    .sort((a, b) => b.count - a.count);
}

function getRegionName(region: string): string {
  const regionNames: Record<string, string> = {
    'NA': 'North America',
    'EU': 'Europe',
    'JP': 'Japan',
    'APAC': 'Asia Pacific',
  };
  return regionNames[region] || region;
}

function getUniqueArchetypes(decks: any[]): string[] {
  return [...new Set(decks.map(deck => deck.archetype))];
}

function getMostPopularArchetype(decks: any[]): string {
  const counts: Record<string, number> = {};
  decks.forEach(deck => {
    counts[deck.archetype] = (counts[deck.archetype] || 0) + 1;
  });
  
  const mostPopular = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return mostPopular ? mostPopular[0].split(' ')[0] : 'N/A';
}

function getAverageWinRate(decks: any[]): number {
  if (decks.length === 0) return 0;
  const avgPlacement = decks.reduce((sum, deck) => sum + deck.placement, 0) / decks.length;
  return Math.max(0, 1 - (avgPlacement / 10));
}