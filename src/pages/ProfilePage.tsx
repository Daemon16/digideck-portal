import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Star, Trophy, Edit3, Save, X } from 'lucide-react';
import DigimonSprite from '../components/DigimonSprite';
import { useProfile } from '../hooks/useProfile';

export default function ProfilePage() {
  const { profile, setNickname, incrementActivity } = useProfile();
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [tempNickname, setTempNickname] = useState(profile.nickname);
  const [currentStage, setCurrentStage] = useState<any>(null);

  const handleSaveNickname = () => {
    if (tempNickname.trim()) {
      setNickname(tempNickname.trim());
      setIsEditingNickname(false);
    }
  };

  const handleCancelEdit = () => {
    setTempNickname(profile.nickname);
    setIsEditingNickname(false);
  };

  const unlockedAchievements = profile.achievements.filter(a => a.unlocked);

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Tamer Profile</h1>
          <p className="text-gray-400">
            Your journey through the Digital World
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="digi-card">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-cyber-cyan to-cyber-orange rounded-full flex items-center justify-center mr-4">
                  <User className="text-white" size={32} />
                </div>
                <div className="flex-1">
                  {isEditingNickname ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={tempNickname}
                        onChange={(e) => setTempNickname(e.target.value)}
                        className="bg-digi-gray border border-cyber-cyan rounded px-3 py-1 text-white text-xl font-bold"
                        placeholder="Enter nickname"
                        maxLength={20}
                      />
                      <button onClick={handleSaveNickname} className="text-cyber-cyan hover:text-white">
                        <Save size={20} />
                      </button>
                      <button onClick={handleCancelEdit} className="text-gray-400 hover:text-white">
                        <X size={20} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <h2 className="text-2xl font-bold text-white">
                        {profile.nickname || 'Anonymous Tamer'}
                      </h2>
                      <button 
                        onClick={() => setIsEditingNickname(true)}
                        className="text-gray-400 hover:text-cyber-cyan"
                      >
                        <Edit3 size={16} />
                      </button>
                    </div>
                  )}
                  <p className="text-gray-400">Digital Tamer</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyber-cyan">{profile.stats.cardsViewed}</div>
                  <div className="text-gray-400 text-sm">Cards Viewed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyber-orange">{profile.stats.decksAnalyzed}</div>
                  <div className="text-gray-400 text-sm">Decks Analyzed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyber-cyan">{profile.totalActivity}</div>
                  <div className="text-gray-400 text-sm">Total Activity</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyber-orange">{profile.stats.pagesVisited}</div>
                  <div className="text-gray-400 text-sm">Pages Visited</div>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="digi-card">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Trophy className="mr-2 text-cyber-orange" size={20} />
                Achievements ({unlockedAchievements.length}/{profile.achievements.length})
              </h3>
              
              <div className="space-y-3">
                {profile.achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`flex items-center p-3 rounded-lg transition-all ${
                      achievement.unlocked
                        ? 'bg-cyber-cyan/10 border border-cyber-cyan/30'
                        : 'bg-digi-gray/30 border border-gray-700/30 opacity-50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                      achievement.unlocked
                        ? 'bg-cyber-cyan text-black'
                        : 'bg-gray-700 text-gray-500'
                    }`}>
                      {achievement.unlocked ? '✓' : '?'}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-medium ${
                        achievement.unlocked ? 'text-white' : 'text-gray-500'
                      }`}>
                        {achievement.name}
                      </h4>
                      <p className={`text-sm ${
                        achievement.unlocked ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {achievement.description}
                      </p>
                    </div>
                    {achievement.unlocked && (
                      <Star size={16} className="text-cyber-orange" fill="currentColor" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Partner Digimon */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="digi-card">
              <h3 className="text-xl font-bold text-white mb-6 text-center">
                Partner Digimon
              </h3>
              
              <div className="flex justify-center mb-6">
                <DigimonSprite 
                  userActivity={profile.totalActivity}
                  onEvolution={(stage) => setCurrentStage(stage)}
                />
              </div>
              
              {currentStage && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center p-4 bg-cyber-cyan/10 rounded-lg border border-cyber-cyan/30"
                >
                  <h4 className="text-cyber-cyan font-bold mb-2">Evolution Complete!</h4>
                  <p className="text-white">Your partner has evolved into {currentStage.name}!</p>
                </motion.div>
              )}
            </div>
          </motion.div>


        </div>


      </div>
    </div>
  );
}