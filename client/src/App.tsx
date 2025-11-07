/**
 * Kanoodle Fusion - Main App
 * Puzzle logic game on Starknet
 */

import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { KanoodleGameScreen } from './components/kanoodle/KanoodleGameScreen';
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
      {/* Direct to game 191 - bypass all other screens */}
      <Route
        path="/"
        element={<Navigate to="/game/191" replace />}
      />

      {/* Game Screen - Playing Kanoodle (no protection, direct access) */}
      <Route
        path="/game/:gameId"
        element={<KanoodleGameScreen />}
      />

      {/* Keep other routes for reference but redirect to game */}
      <Route path="/home" element={<Navigate to="/game/191" replace />} />
      <Route path="/levels" element={<Navigate to="/game/191" replace />} />
      <Route path="/tutorial" element={<Navigate to="/game/191" replace />} />
      <Route path="/victory" element={<Navigate to="/game/191" replace />} />

      {/* Catch all - redirect to game 191 */}
      <Route path="*" element={<Navigate to="/game/191" replace />} />
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
