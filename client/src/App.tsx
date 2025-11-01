/**
 * Kanoodle Fusion - Main App
 * Puzzle logic game on Starknet
 */

import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAccount } from '@starknet-react/core';
import { LoginScreen } from './components/LoginScreen';
import { KanoodleHome } from './components/kanoodle/KanoodleHome';
import { KanoodleGameScreen } from './components/kanoodle/KanoodleGameScreen';
import { TutorialScreen } from './components/kanoodle/TutorialScreen';
import { LanguageProvider } from './lib/LanguageContext';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isConnected, isConnecting } = useAccount();
  const navigate = useNavigate();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    // Give time for autoConnect to work on initial load
    const initialTimer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 2000); // 2 seconds for autoConnect

    return () => clearTimeout(initialTimer);
  }, []);

  useEffect(() => {
    // Only redirect after initial load period and if still not connected
    if (!isInitialLoad && !isConnected && !isConnecting) {
      const redirectTimer = setTimeout(() => {
        navigate('/');
      }, 500);

      return () => clearTimeout(redirectTimer);
    }
  }, [isInitialLoad, isConnected, isConnecting, navigate]);

  // Show loading while connecting or during initial load period
  if (isConnecting || isInitialLoad || (!isConnected && isInitialLoad)) {
    return (
      <div className="min-h-screen bg-[#6C5EB5] c64-screen flex items-center justify-center">
        <div className="text-center text-[#AAFFEE] c64-text-glow">
          <div className="animate-spin text-6xl mb-4">⚙</div>
          <p className="text-xl">LOADING GAME...</p>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return null;
  }

  return <>{children}</>;
}

function AppContent() {
  const { isConnected } = useAccount();

  // Initialize colorblind mode class on mount
  useEffect(() => {
    const colorblindMode = localStorage.getItem('colorblindMode');
    if (colorblindMode && JSON.parse(colorblindMode)) {
      document.body.classList.add('colorblind-mode');
    }
  }, []);

  return (
    <Routes>
      {/* Login Screen - Wallet connection */}
      <Route
        path="/"
        element={
          isConnected ? (
            <Navigate to="/home" replace />
          ) : (
            <LoginScreen onLoginSuccess={() => {}} />
          )
        }
      />

      {/* Home Screen - Main menu */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <KanoodleHome />
          </ProtectedRoute>
        }
      />

      {/* Game Screen - Playing Kanoodle */}
      <Route
        path="/game/:gameId"
        element={
          <ProtectedRoute>
            <KanoodleGameScreen />
          </ProtectedRoute>
        }
      />

      {/* Tutorial Screen - How to play */}
      <Route
        path="/tutorial"
        element={
          <ProtectedRoute>
            <TutorialScreen />
          </ProtectedRoute>
        }
      />

      {/* Catch all - redirect to home or login */}
      <Route path="*" element={<Navigate to={isConnected ? "/home" : "/"} replace />} />
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
