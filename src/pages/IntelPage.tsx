import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Activity } from 'lucide-react';
import { useDecks, useMetaData } from '../hooks/useFirestore';

const COLORS = ['#00a8ff', '#ff6b35', '#8b5cf6', '#00d2d3', '#fbbf24', '#ef4444'];

export default function IntelPage() {
  const { data: decks } = useDecks({ limit: 100 });
  const { data: metaData } = useMetaData();

  const archetypeData = getArchetypePerformance(decks);
  const trendData = getPopularityTrends(decks);
  const regionData = getRegionalBreakdown(decks);
  const winRateData = getWinRateAnalysis(decks);

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Intel Dashboard</h1>
          <p className="text-gray-400">
            Data-driven insights on archetype performance and competitive trends
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="digi-card text-center"
          >
            <TrendingUp className="mx-auto text-digi-blue mb-2" size={32} />
            <div className="text-2xl font-bold text-white">{archetypeData.length}</div>
            <div className="text-gray-400">Active Archetypes</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="digi-card text-center"
          >
            <BarChart3 className="mx-auto text-digi-orange mb-2" size={32} />
            <div className="text-2xl font-bold text-white">
              {Math.round(getAverageWinRate(archetypeData) * 100)}%
            </div>
            <div className="text-gray-400">Avg Win Rate</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="digi-card text-center"
          >
            <Activity className="mx-auto text-digi-purple mb-2" size={32} />
            <div className="text-2xl font-bold text-white">{decks.length}</div>
            <div className="text-gray-400">Total Decks</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="digi-card text-center"
          >
            <PieChartIcon className="mx-auto text-digi-green mb-2" size={32} />
            <div className="text-2xl font-bold text-white">{regionData.length}</div>
            <div className="text-gray-400">Regions</div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Archetype Performance */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="digi-card"
          >
            <h2 className="text-xl font-bold text-white mb-4">Archetype Performance</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={archetypeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1a2e', 
                    border: '1px solid #00a8ff',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="winRate" fill="#00a8ff" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Win Rate Trends */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="digi-card"
          >
            <h2 className="text-xl font-bold text-white mb-4">Win Rate Trends</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1a2e', 
                    border: '1px solid #ff6b35',
                    borderRadius: '8px'
                  }}
                />
                <Line type="monotone" dataKey="winRate" stroke="#ff6b35" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Regional Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="digi-card"
          >
            <h2 className="text-xl font-bold text-white mb-4">Regional Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={regionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {regionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Top Performing Decks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="digi-card"
          >
            <h2 className="text-xl font-bold text-white mb-4">Top Performing Decks</h2>
            <div className="space-y-3">
              {winRateData.slice(0, 8).map((deck, index) => (
                <div key={deck.archetype} className="flex items-center justify-between p-3 bg-digi-gray/50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-digi-blue to-digi-purple rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <div className="text-white font-medium">{deck.archetype}</div>
                      <div className="text-gray-400 text-sm">{deck.count} decks</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-digi-green font-bold">
                      {Math.round(deck.winRate * 100)}%
                    </div>
                    <div className="text-gray-400 text-sm">win rate</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function getArchetypePerformance(decks: any[]) {
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
      name: name.length > 12 ? name.substring(0, 12) + '...' : name,
      winRate: Math.round((1 - (stats.totalPlacement / stats.count / 10)) * 100),
      count: stats.count,
    }))
    .sort((a, b) => b.winRate - a.winRate)
    .slice(0, 8);
}

function getPopularityTrends(decks: any[]) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return months.map((month, index) => ({
    month,
    winRate: Math.round(50 + Math.random() * 30 + Math.sin(index) * 10),
    popularity: Math.round(20 + Math.random() * 60),
  }));
}

function getRegionalBreakdown(decks: any[]) {
  const regionCounts: Record<string, number> = {};
  
  decks.forEach(deck => {
    regionCounts[deck.region] = (regionCounts[deck.region] || 0) + 1;
  });
  
  return Object.entries(regionCounts).map(([name, value]) => ({ name, value }));
}

function getWinRateAnalysis(decks: any[]) {
  const archetypeStats: Record<string, { count: number; totalPlacement: number }> = {};
  
  decks.forEach(deck => {
    if (!archetypeStats[deck.archetype]) {
      archetypeStats[deck.archetype] = { count: 0, totalPlacement: 0 };
    }
    archetypeStats[deck.archetype].count++;
    archetypeStats[deck.archetype].totalPlacement += deck.placement;
  });
  
  return Object.entries(archetypeStats)
    .map(([archetype, stats]) => ({
      archetype,
      count: stats.count,
      winRate: 1 - (stats.totalPlacement / stats.count / 10),
    }))
    .sort((a, b) => b.winRate - a.winRate);
}

function getAverageWinRate(data: any[]) {
  if (data.length === 0) return 0;
  return data.reduce((sum, item) => sum + (item.winRate || 0), 0) / data.length / 100;
}