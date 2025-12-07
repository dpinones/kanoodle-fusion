/**
 * Kanoodle Fusion - Main App
 * Puzzle logic game (Frontend only version)
 */

import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { KanoodleHome } from './components/kanoodle/KanoodleHome';
import { KanoodleGameScreen } from './components/kanoodle/KanoodleGameScreen';
import { LevelSelect } from './components/kanoodle/LevelSelect';
import { TutorialScreen } from './components/kanoodle/TutorialScreen';
import { VictoryScreen } from './components/kanoodle/VictoryScreen';
import { LanguageProvider } from './lib/LanguageContext';

function AppContent() {
  // Initialize colorblind mode class on mount
  useEffect(() => {
    const colorblindMode = localStorage.getItem('colorblindMode');
    if (colorblindMode && JSON.parse(colorblindMode)) {
      document.body.classList.add('colorblind-mode');
    }
  }, []);

  return (
    <Routes>
      {/* Home Screen - Main menu (default route) */}
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<KanoodleHome />} />

      {/* Level Select Screen - Choose level */}
      <Route path="/levels" element={<LevelSelect />} />

      {/* Game Screen - Playing Kanoodle */}
      <Route path="/level/:levelId" element={<KanoodleGameScreen />} />

      {/* Tutorial Screen - How to play */}
      <Route path="/tutorial" element={<TutorialScreen />} />

      {/* Victory Screen - Completed all levels */}
      <Route path="/victory" element={<VictoryScreen />} />

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
