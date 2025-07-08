import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Shuffle, Search, Zap, Target, Gauge, BookOpen, Dice6 } from 'lucide-react';

export default function ToolsPage() {
  const [memoryGauge, setMemoryGauge] = useState(0);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [randomCard, setRandomCard] = useState<any>(null);

  const keywords = [
    'Blocker', 'Rush', 'Piercing', 'Reboot', 'Security Attack',
    'Jamming', 'De-Digivolve', 'Draw', 'Recovery', 'Suspend',
    'Unsuspend', 'Delete', 'Return', 'Trash', 'Hand', 'Deck'
  ];

  const sampleCards = [
    { name: 'Agumon', cost: 3, type: 'Digimon', color: 'Red' },
    { name: 'Gabumon', cost: 3, type: 'Digimon', color: 'Blue' },
    { name: 'Patamon', cost: 3, type: 'Digimon', color: 'Yellow' },
    { name: 'Palmon', cost: 4, type: 'Digimon', color: 'Green' },
  ];

  const handleMemoryChange = (value: number) => {
    setMemoryGauge(Math.max(-10, Math.min(10, value)));
  };

  const toggleKeyword = (keyword: string) => {
    setSelectedKeywords(prev => 
      prev.includes(keyword) 
        ? prev.filter(k => k !== keyword)
        : [...prev, keyword]
    );
  };

  const generateRandomCard = () => {
    const card = sampleCards[Math.floor(Math.random() * sampleCards.length)];
    setRandomCard(card);
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Deck Tools</h1>
          <p className="text-gray-400">
            Essential utilities for deck building and game analysis
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Memory Gauge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="digi-card"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Gauge className="mr-2 text-cyber-cyan" size={24} />
              Memory Gauge
            </h2>
            
            <div className="space-y-6">
              <div className="relative">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Opponent</span>
                  <span>You</span>
                </div>
                
                <div className="relative h-8 bg-digi-gray rounded-full overflow-hidden">
                  <div 
                    className={`absolute top-0 h-full transition-all duration-300 ${
                      memoryGauge >= 0 
                        ? 'bg-gradient-to-r from-cyber-cyan to-cyber-orange right-1/2' 
                        : 'bg-gradient-to-l from-red-500 to-red-700 left-1/2'
                    }`}
                    style={{ 
                      width: `${Math.abs(memoryGauge) * 5}%`,
                    }}
                  />
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{memoryGauge}</span>
                  </div>
                </div>
                
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>-10</span>
                  <span>0</span>
                  <span>+10</span>
                </div>
              </div>
              
              <div className="grid grid-cols-5 gap-2">
                {[-2, -1, 0, 1, 2].map(value => (
                  <button
                    key={value}
                    onClick={() => handleMemoryChange(memoryGauge + value)}
                    className="digi-button py-2 text-sm"
                  >
                    {value > 0 ? '+' : ''}{value}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setMemoryGauge(0)}
                className="w-full bg-gray-600 hover:bg-gray-500 text-white py-2 rounded-lg transition-colors"
              >
                Reset
              </button>
            </div>
          </motion.div>

          {/* Keyword Explorer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="digi-card"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <BookOpen className="mr-2 text-cyber-orange" size={24} />
              Keyword Explorer
            </h2>
            
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {keywords.map(keyword => (
                  <button
                    key={keyword}
                    onClick={() => toggleKeyword(keyword)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                      selectedKeywords.includes(keyword)
                        ? 'bg-cyber-cyan text-black'
                        : 'bg-digi-gray text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {keyword}
                  </button>
                ))}
              </div>
              
              {selectedKeywords.length > 0 && (
                <div className="mt-4 p-4 bg-cyber-cyan/10 rounded-lg border border-cyber-cyan/30">
                  <h3 className="text-cyber-cyan font-bold mb-2">Selected Keywords:</h3>
                  <div className="space-y-2">
                    {selectedKeywords.map(keyword => (
                      <div key={keyword} className="text-white">
                        <span className="font-medium">{keyword}</span>
                        <p className="text-gray-400 text-sm">
                          {getKeywordDescription(keyword)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Card Randomizer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="digi-card"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Dice6 className="mr-2 text-cyber-cyan" size={24} />
              Card Randomizer
            </h2>
            
            <div className="space-y-4">
              <button
                onClick={generateRandomCard}
                className="w-full digi-button py-3 flex items-center justify-center"
              >
                <Shuffle className="mr-2" size={20} />
                Generate Random Card
              </button>
              
              {randomCard && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-cyber-orange/10 rounded-lg border border-cyber-orange/30"
                >
                  <h3 className="text-cyber-orange font-bold text-lg mb-2">{randomCard.name}</h3>
                  <div className="space-y-1 text-white">
                    <p><span className="text-gray-400">Type:</span> {randomCard.type}</p>
                    <p><span className="text-gray-400">Color:</span> {randomCard.color}</p>
                    <p><span className="text-gray-400">Cost:</span> {randomCard.cost}</p>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Deck Calculator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="digi-card"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Calculator className="mr-2 text-cyber-orange" size={24} />
              Deck Calculator
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyber-cyan">50</div>
                  <div className="text-gray-400 text-sm">Main Deck</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyber-orange">5</div>
                  <div className="text-gray-400 text-sm">Digi-Eggs</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Average Cost:</span>
                  <span className="text-white">4.2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Color Distribution:</span>
                  <span className="text-white">Balanced</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Keyword Count:</span>
                  <span className="text-white">12</span>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                <div className="flex items-center">
                  <Target className="text-green-400 mr-2" size={16} />
                  <span className="text-green-400 font-medium">Deck is tournament legal</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <div className="digi-card">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Zap className="mr-2 text-cyber-cyan" size={24} />
              Quick Actions
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="digi-button py-4 flex flex-col items-center">
                <Search className="mb-2" size={24} />
                <span>Card Search</span>
              </button>
              
              <button className="digi-button py-4 flex flex-col items-center">
                <Calculator className="mb-2" size={24} />
                <span>Cost Calculator</span>
              </button>
              
              <button className="digi-button py-4 flex flex-col items-center">
                <Target className="mb-2" size={24} />
                <span>Combo Finder</span>
              </button>
              
              <button className="digi-button py-4 flex flex-col items-center">
                <Shuffle className="mb-2" size={24} />
                <span>Deck Tester</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function getKeywordDescription(keyword: string): string {
  const descriptions: Record<string, string> = {
    'Blocker': 'Can redirect attacks to itself',
    'Rush': 'Can attack the turn it\'s played',
    'Piercing': 'Excess damage carries over to security',
    'Reboot': 'Unsuspends during opponent\'s unsuspend step',
    'Security Attack': 'Checks additional security cards',
    'Jamming': 'Cannot be blocked',
    'De-Digivolve': 'Returns Digimon to previous evolution',
    'Draw': 'Draw cards from deck',
    'Recovery': 'Add cards to security stack',
    'Suspend': 'Turn card sideways',
    'Unsuspend': 'Return card to upright position',
    'Delete': 'Send Digimon to trash',
    'Return': 'Return card to hand or deck',
    'Trash': 'Send card to trash pile',
    'Hand': 'Cards in your hand',
    'Deck': 'Your deck of cards'
  };
  
  return descriptions[keyword] || 'No description available';
}