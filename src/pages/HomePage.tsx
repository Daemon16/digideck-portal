import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  TrendingUp, 
  BarChart3, 
  Radar, 
  Zap, 
  Settings,
  ArrowRight 
} from 'lucide-react';

const features = [
  {
    icon: Search,
    title: 'Card Database',
    description: 'Search through live Digimon TCG card data with advanced filters',
    path: '/cards',
    color: 'from-digi-blue to-digi-green'
  },
  {
    icon: TrendingUp,
    title: 'Meta Analysis',
    description: 'Real tournament decks and results from competitive play',
    path: '/meta',
    color: 'from-digi-orange to-digi-blue'
  },
  {
    icon: BarChart3,
    title: 'Intel Dashboard',
    description: 'Data-driven insights on archetype performance and trends',
    path: '/intel',
    color: 'from-digi-purple to-digi-orange'
  },
  {
    icon: Radar,
    title: 'Regional Radar',
    description: 'Archetype popularity and win rates by region',
    path: '/radar',
    color: 'from-digi-green to-digi-purple'
  },
  {
    icon: Zap,
    title: 'Card Synergy',
    description: 'Discover powerful card combinations from real decks',
    path: '/synergy',
    color: 'from-digi-blue to-digi-purple'
  },
  {
    icon: Settings,
    title: 'Deck Tools',
    description: 'Memory gauge, keyword explorer, and deck utilities',
    path: '/tools',
    color: 'from-digi-orange to-digi-green'
  }
];

export default function HomePage() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-digi-blue via-digi-purple to-digi-orange bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            DigiDeck Portal
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            The ultimate Digimon TCG companion with live tournament data, 
            meta analysis, and immersive digital world experience
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link to="/cards" className="digi-button">
              Explore Cards
              <ArrowRight className="ml-2" size={20} />
            </Link>
            <Link to="/meta" className="digi-button bg-gradient-to-r from-digi-purple to-digi-orange">
              View Meta
              <TrendingUp className="ml-2" size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center mb-12 text-white"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Explore the Digital World
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.path}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <Link to={feature.path} className="block">
                  <div className="digi-card h-full p-6 group-hover:border-digi-blue/80 transition-all duration-300">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="text-white" size={24} />
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-digi-blue transition-colors duration-300">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                      {feature.description}
                    </p>
                    
                    <div className="mt-4 flex items-center text-digi-blue group-hover:text-digi-orange transition-colors duration-300">
                      <span className="text-sm font-medium">Explore</span>
                      <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-digi-gray/30">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-3xl md:text-4xl font-bold text-digi-blue mb-2">1000+</div>
              <div className="text-gray-400">Cards Tracked</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="text-3xl md:text-4xl font-bold text-digi-orange mb-2">500+</div>
              <div className="text-gray-400">Tournament Decks</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="text-3xl md:text-4xl font-bold text-digi-purple mb-2">50+</div>
              <div className="text-gray-400">Archetypes</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="text-3xl md:text-4xl font-bold text-digi-green mb-2">Live</div>
              <div className="text-gray-400">Data Sync</div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}