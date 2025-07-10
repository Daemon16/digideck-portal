import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Search, 
  TrendingUp, 
  BarChart3, 
  Radar, 
  Zap, 
  Settings, 
  User, 
  Shuffle,
  Menu,
  X
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Home', icon: null },
  { path: '/cards', label: 'Cards', icon: Search },
  { path: '/meta', label: 'Meta', icon: TrendingUp },
  { path: '/intel', label: 'Intel', icon: BarChart3 },
  { path: '/radar', label: 'Radar', icon: Radar },
  { path: '/synergy', label: 'Synergy', icon: Zap },
  { path: '/tools', label: 'Tools', icon: Settings },
  { path: '/profile', label: 'Profile', icon: User },
  { path: '/my-decks', label: 'My Decks', icon: Shuffle },
];

export default function Navigation() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-digi-dark/90 backdrop-blur-md border-b border-digi-blue/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyber-cyan to-cyber-orange rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">DD</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyber-cyan to-cyber-orange bg-clip-text text-transparent">
              DigiDeck Portal
            </span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-digi-blue/20 text-digi-blue border border-digi-blue/30'
                      : 'text-gray-300 hover:text-white hover:bg-digi-gray/50'
                  }`}
                >
                  {Icon && <Icon size={16} />}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white p-2 transition-colors"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-digi-gray/95 backdrop-blur-md border-t border-digi-blue/30">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-digi-blue/20 text-digi-blue border border-digi-blue/30'
                      : 'text-gray-300 hover:text-white hover:bg-digi-gray/50'
                  }`}
                >
                  {Icon && <Icon size={16} />}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}