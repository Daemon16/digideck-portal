import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import DigitalPortal from './components/DigitalPortal';
import CyberBackground from './components/CyberBackground';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import CardsPage from './pages/CardsPage';
import MetaPage from './pages/MetaPage';
import DeckDetailsPage from './pages/DeckDetailsPage';
import IntelPage from './pages/IntelPage';
import RadarPage from './pages/RadarPage';
import ProfilePage from './pages/ProfilePage';
import ToolsPage from './pages/ToolsPage';
import MyDecksPage from './pages/MyDecksPage';

function App() {
  const [loading, setLoading] = useState(true);

  const handleLoadingComplete = () => {
    setLoading(false);
  };

  return (
    <MantineProvider
      theme={{
        colors: {
          dark: [
            '#C1C2C5',
            '#A6A7AB', 
            '#909296',
            '#5c5f66',
            '#373A40',
            '#2C2E33',
            '#25262b',
            '#1A1B1E',
            '#141517',
            '#101113'
          ]
        },
        primaryColor: 'blue',
        defaultRadius: 'md'
      }}
    >
      <Notifications />
      <Router>
        <div className="App">
        {loading ? (
          <DigitalPortal onComplete={handleLoadingComplete} />
        ) : (
          <>
            <CyberBackground intensity="medium" />
            <Navigation />
            <main className="relative z-10">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/cards" element={<CardsPage />} />
                <Route path="/meta" element={<MetaPage />} />
                <Route path="/deck/:deckId" element={<DeckDetailsPage />} />
                <Route path="/intel" element={<IntelPage />} />
                <Route path="/radar" element={<RadarPage />} />
                <Route path="/synergy" element={<div className="min-h-screen pt-16 flex items-center justify-center"><div className="text-white text-2xl">Card Synergy - Coming Soon</div></div>} />
                <Route path="/tools" element={<ToolsPage />} />
            <Route path="/my-decks" element={<MyDecksPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/chaos" element={<div className="min-h-screen pt-16 flex items-center justify-center"><div className="text-white text-2xl">Chaos Mode - Coming Soon</div></div>} />
              </Routes>
            </main>
          </>
        )}
        </div>
      </Router>
    </MantineProvider>
  );
}

export default App;