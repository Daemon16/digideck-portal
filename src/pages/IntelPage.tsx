import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Activity } from 'lucide-react';
import { useMetaSets, useSetDecks } from '../hooks/useFirestore';
import { MetaSet } from '../utils/types';
import { Container, Title, Text, Select, Group, Loader, Center, Stack } from '@mantine/core';

const COLORS = ['#00a8ff', '#ff6b35', '#8b5cf6', '#00d2d3', '#fbbf24', '#ef4444'];

export default function IntelPage() {
  const [selectedSet, setSelectedSet] = useState<MetaSet | null>(null);
  const { data: metaSets, loading: setsLoading } = useMetaSets();
  const { data: decks, loading: decksLoading } = useSetDecks(selectedSet, { limit: 1000 });
  
  useEffect(() => {
    if (!selectedSet && metaSets.length > 0) {
      setSelectedSet(metaSets[0]);
    }
  }, [metaSets, selectedSet]);

  const archetypeData = getArchetypeUsage(decks);
  const regionData = getRegionalBreakdown(decks);
  const placementData = getPlacementAnalysis(decks);
  
  if (setsLoading) {
    return (
      <Container size="xl" pt={80}>
        <Center h={400}>
          <Stack align="center">
            <Loader size="lg" color="blue" />
            <Text c="dimmed" size="lg">Loading tournament sets...</Text>
          </Stack>
        </Center>
      </Container>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Intel Dashboard</h1>
          <p className="text-gray-400">
            Data-driven insights on archetype performance and competitive trends
          </p>
          
          {/* Set Selection */}
          <Group mt="lg">
            <Select
              value={selectedSet?.id || ''}
              onChange={(value) => {
                const set = metaSets.find(s => s.id === value);
                setSelectedSet(set || null);
              }}
              data={metaSets.map(set => ({ value: set.id, label: set.name }))}
              placeholder="Select tournament set"
              w={400}
              styles={{
                dropdown: {
                  backgroundColor: 'var(--mantine-color-dark-7)',
                  border: '1px solid var(--mantine-color-dark-4)'
                },
                option: {
                  color: 'var(--mantine-color-gray-1)',
                  '&[data-selected]': {
                    backgroundColor: 'var(--mantine-color-blue-6)',
                    color: 'white'
                  },
                  '&[data-hovered]': {
                    backgroundColor: 'var(--mantine-color-dark-5)',
                    color: 'white'
                  }
                }
              }}
            />
          </Group>
        </div>
        
        {decksLoading ? (
          <Center h={300}>
            <Stack align="center">
              <Loader size="lg" color="orange" />
              <Text c="dimmed">Loading tournament data...</Text>
            </Stack>
          </Center>
        ) : !selectedSet ? (
          <Center h={300}>
            <Text c="dimmed" size="lg">Select a tournament set to view analytics</Text>
          </Center>
        ) : (
        <>
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
              {getTopArchetypeCount(archetypeData)}
            </div>
            <div className="text-gray-400">Top Archetype Usage</div>
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
          {/* Archetype Usage */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="digi-card"
          >
            <h2 className="text-xl font-bold text-white mb-4">Archetype Usage</h2>
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
                <Bar dataKey="count" fill="#00a8ff" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Placement Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="digi-card"
          >
            <h2 className="text-xl font-bold text-white mb-4">Placement Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={placementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="placement" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1a2e', 
                    border: '1px solid #ff6b35',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="count" fill="#ff6b35" />
              </BarChart>
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
            <div className="space-y-3">
              {regionData.slice(0, 10).map((region, index) => {
                const percentage = ((region.value / decks.length) * 100).toFixed(1);
                return (
                  <div key={region.name} className="flex items-center justify-between p-3 bg-digi-gray/30 rounded-lg">
                    <div className="flex items-center flex-1">
                      <div 
                        className="w-4 h-4 rounded-full mr-3" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <div className="flex-1">
                        <div className="text-white font-medium">{region.name}</div>
                        <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                          <div 
                            className="h-2 rounded-full transition-all duration-500" 
                            style={{ 
                              width: `${percentage}%`, 
                              backgroundColor: COLORS[index % COLORS.length] 
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-white font-bold">{region.value}</div>
                      <div className="text-gray-400 text-sm">{percentage}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Most Used Archetypes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="digi-card"
          >
            <h2 className="text-xl font-bold text-white mb-4">Top 10 Archetypes</h2>
            <div className="space-y-3">
              {archetypeData.slice(0, 10).map((archetype, index) => (
                <div key={archetype.name} className="flex items-center justify-between p-3 bg-digi-gray/50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-digi-blue to-digi-purple rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <div className="text-white font-medium">{archetype.fullName}</div>
                      <div className="text-gray-400 text-sm">{((archetype.count / decks.length) * 100).toFixed(1)}% of meta</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-digi-blue font-bold">
                      {archetype.count}
                    </div>
                    <div className="text-gray-400 text-sm">decks</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        </>
        )}
      </div>
    </div>
  );
}

function getArchetypeUsage(decks: any[]) {
  const archetypeStats: Record<string, { count: number }> = {};
  
  decks.forEach(deck => {
    if (!archetypeStats[deck.archetype]) {
      archetypeStats[deck.archetype] = { count: 0 };
    }
    archetypeStats[deck.archetype].count++;
  });
  
  return Object.entries(archetypeStats)
    .map(([name, stats]) => ({
      name: name.length > 12 ? name.substring(0, 12) + '...' : name,
      fullName: name,
      count: stats.count,
    }))
    .sort((a, b) => b.count - a.count);
}

function getRegionalBreakdown(decks: any[]) {
  const regionCounts: Record<string, number> = {};
  
  decks.forEach(deck => {
    regionCounts[deck.region] = (regionCounts[deck.region] || 0) + 1;
  });
  
  return Object.entries(regionCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

function getPlacementAnalysis(decks: any[]) {
  const placementCounts: Record<string, number> = {};
  
  decks.forEach(deck => {
    const placement = deck.placement <= 4 ? `Top ${deck.placement}` : 
                    deck.placement <= 8 ? 'Top 8' : 
                    deck.placement <= 16 ? 'Top 16' : 'Other';
    placementCounts[placement] = (placementCounts[placement] || 0) + 1;
  });
  
  return Object.entries(placementCounts)
    .map(([placement, count]) => ({ placement, count }))
    .sort((a, b) => {
      const order = ['Top 1', 'Top 2', 'Top 3', 'Top 4', 'Top 8', 'Top 16', 'Other'];
      return order.indexOf(a.placement) - order.indexOf(b.placement);
    });
}

function getTopArchetypeCount(data: any[]) {
  if (data.length === 0) return 0;
  return data[0].count;
}