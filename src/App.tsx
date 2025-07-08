import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EggLoader from './components/EggLoader';
import DigitalWorldBackground from './scenes/DigitalWorldBackground';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import CardsPage from './pages/CardsPage';
import MetaPage from './pages/MetaPage';
import IntelPage from './pages/IntelPage';
import RadarPage from './pages/RadarPage';
import ProfilePage from './pages/ProfilePage';
import ToolsPage from './pages/ToolsPage';

function App() {
  const [loading, setLoading] = useState(true);

  const handleLoadingComplete = () => {
    setLoading(false);
  };

  return (
    <Router>
      <div className="App">
        {loading ? (
          <EggLoader onComplete={handleLoadingComplete} />
        ) : (
          <>
            <DigitalWorldBackground />
            <Navigation />
            <main className="relative z-10">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/cards" element={<CardsPage />} />
                <Route path="/meta" element={<MetaPage />} />
                <Route path="/intel" element={<IntelPage />} />
                <Route path="/radar" element={<RadarPage />} />
                <Route path="/synergy" element={<div className="min-h-screen pt-16 flex items-center justify-center"><div className="text-white text-2xl">Card Synergy - Coming Soon</div></div>} />
                <Route path="/tools" element={<ToolsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/chaos" element={<div className="min-h-screen pt-16 flex items-center justify-center"><div className="text-white text-2xl">Chaos Mode - Coming Soon</div></div>} />
              </Routes>
            </main>
          </>
        )}
      </div>
    </Router>
  );
}

export default App;