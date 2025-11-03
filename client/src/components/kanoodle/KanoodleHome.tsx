/**
 * KanoodleHome Component - Commodore 64 Style
 * Main menu screen
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from '@starknet-react/core';
import { SettingsPopup } from '../SettingsPopup';
import { ConnectWallet } from './ConnectWallet';
import { getKanoodleText } from '../../lib/uiText';
import { audioManager, initAudio } from '../../lib/audioManager';
import { useKanoodleGame } from '../../hooks/useKanoodleGame';
import { INITIAL_LEVEL } from '../../lib/kanoodle/config';

export function KanoodleHome() {
  const navigate = useNavigate();
  const { address } = useAccount();
  const [showSettings, setShowSettings] = useState(false);
  const [isCreatingGame, setIsCreatingGame] = useState(false);
  const text = getKanoodleText().home;
  const textLogin = getKanoodleText().login;

  const { startGame, error } = useKanoodleGame();

  // Initialize audio on mount
  useEffect(() => {
    initAudio();
  }, []);

  const handleStartGame = async () => {
    if (!address || isCreatingGame) return;

    setIsCreatingGame(true);
    audioManager.playButtonClick();

    try {
      console.log('Creating new game...');
      const gameId = await startGame(INITIAL_LEVEL);

      if (gameId) {
        console.log('Game created successfully:', gameId);
        // Navigate to game screen with gameId in URL
        navigate(`/game/${gameId}`);
      } else {
        console.error('Failed to create game - no gameId returned');
      }
    } catch (err) {
      console.error('Error creating game:', err);
    } finally {
      setIsCreatingGame(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-[#6C5EB5] c64-screen relative overflow-hidden flex flex-col">
      {/* C64 Border */}
      <div className="absolute inset-0 border-[16px] sm:border-[32px] border-[#A4A0E4] pointer-events-none"></div>

      {/* Rainbow stripe - top */}
      <div className="absolute top-4 sm:top-8 left-0 right-0 c64-rainbow z-10"></div>

      {/* Top right buttons */}
      <div className="absolute top-6 sm:top-12 right-6 sm:right-12 z-20 flex gap-2 sm:gap-3 items-center">
        <ConnectWallet />
        <button
          onClick={() => {
            audioManager.playMenuNav();
            setShowSettings(true);
          }}
          className="c64-button py-2 px-4 text-xs"
          title={textLogin.settingsButton}
        >
          {textLogin.settingsButton}
        </button>
      </div>

      {/* Main content - Optimized to fit screen */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 py-4 sm:py-6">
        {/* READY prompt */}
        <div className="mb-2">
          <pre className="text-[#AAFFEE] c64-text-glow text-xs"></pre>
        </div>

        {/* Game Title - C64 style matching LoginScreen */}
        <div className="text-center mb-3 sm:mb-4">
          <h1
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#AAFFEE] c64-text-glow mb-2 tracking-wider"
            style={{ fontFamily: 'Press Start 2P, monospace' }}
          >
            KANOODLE
          </h1>
          <h2
            className="text-lg sm:text-xl md:text-2xl font-bold text-[#EEEE77] c64-text-glow"
            style={{ fontFamily: 'Press Start 2P, monospace' }}
          >
            FUSION
          </h2>
          {/* <p className="text-[#EEEE77] text-xs mt-2">
            PUZZLE LOGIC GAME
          </p> */}
        </div>

        {/* Menu Options - Compact with decorations */}
        <div className="relative w-[70%] sm:w-[80%] max-w-xs sm:max-w-sm space-y-2">
          {/* Decorative piece - Top left */}
          <div className="absolute left-[-120px] sm:left-[-150px] top-[-30px] hidden lg:block">
            <div className="animate-float">
              <svg width="50" height="50" viewBox="0 0 50 50" className="opacity-60">
                <rect x="0" y="0" width="25" height="25" fill="#FF0000" />
                <rect x="25" y="0" width="25" height="25" fill="#FF0000" className="animate-pulse" />
                <rect x="25" y="25" width="25" height="25" fill="#FF0000" />
              </svg>
            </div>
          </div>

          {/* Decorative piece - Top right */}
          <div className="absolute right-[-130px] sm:right-[-160px] top-[-30px] hidden lg:block">
            <div className="animate-float-delayed">
              <svg width="50" height="50" viewBox="0 0 50 50" className="opacity-60">
                <rect x="0" y="0" width="25" height="25" fill="#00FF00" className="animate-pulse" />
                <rect x="0" y="25" width="25" height="25" fill="#00FF00" />
                <rect x="25" y="25" width="25" height="25" fill="#00FF00" />
              </svg>
            </div>
          </div>

          {/* Decorative piece - Middle left */}
          <div className="absolute left-[-115px] sm:left-[-145px] top-[38%] hidden lg:block">
            <div className="animate-float-delayed">
              <svg width="50" height="50" viewBox="0 0 50 50" className="opacity-60">
                <rect x="0" y="0" width="25" height="25" fill="#0088FF" />
                <rect x="0" y="25" width="25" height="25" fill="#0088FF" className="animate-pulse" />
              </svg>
            </div>
          </div>

          {/* Decorative piece - Middle right */}
          <div className="absolute right-[-125px] sm:right-[-155px] top-[38%] hidden lg:block">
            <div className="animate-float">
              <svg width="50" height="50" viewBox="0 0 50 50" className="opacity-60">
                <rect x="25" y="0" width="25" height="25" fill="#EEEE77" className="animate-pulse" />
                <rect x="25" y="25" width="25" height="25" fill="#EEEE77" />
              </svg>
            </div>
          </div>

          {/* Decorative piece - Bottom left */}
          <div className="absolute left-[-135px] sm:left-[-165px] bottom-[15px] hidden lg:block">
            <div className="animate-float">
              <svg width="50" height="50" viewBox="0 0 50 50" className="opacity-60">
                <rect x="0" y="25" width="25" height="25" fill="#CC44CC" />
                <rect x="25" y="25" width="25" height="25" fill="#CC44CC" className="animate-pulse" />
              </svg>
            </div>
          </div>

          {/* Decorative piece - Bottom right */}
          <div className="absolute right-[-120px] sm:right-[-150px] bottom-[-20px] hidden lg:block">
            <div className="animate-float-delayed">
              <svg width="50" height="50" viewBox="0 0 50 50" className="opacity-60">
                <rect x="0" y="0" width="25" height="25" fill="#FF8800" />
                <rect x="25" y="0" width="25" height="25" fill="#FF8800" />
                <rect x="0" y="25" width="25" height="25" fill="#FF8800" className="animate-pulse" />
              </svg>
            </div>
          </div>

          {/* Play button */}
          <div className="c64-border bg-[#6C5EB5]/90 p-1.5 sm:p-2">
            <button
              onClick={handleStartGame}
              disabled={isCreatingGame || !address}
              className="c64-button w-full py-1.5 sm:py-2 px-3 sm:px-4 text-xs sm:text-sm bg-[#00CC55] border-[#00B428] disabled:bg-[#777777] disabled:border-[#333333]"
            >
              {isCreatingGame ? '⏳ CREATING GAME...' : `▶ ${text.playButton}`}
            </button>
          </div>

          {/* Tutorial button */}
          <div className="c64-border bg-[#6C5EB5]/90 p-1.5 sm:p-2">
            <button
              onClick={() => {
                audioManager.playMenuNav();
                navigate('/tutorial');
              }}
              className="c64-button w-full py-1.5 sm:py-2 px-3 sm:px-4 text-xs sm:text-sm bg-[#0088FF] border-[#006CD8]"
            >
              ? {text.tutorialButton}
            </button>
          </div>

          {/* Share button */}
          <div className="c64-border bg-[#6C5EB5]/90 p-1.5 sm:p-2">
            <button
              onClick={() => {
                audioManager.playButtonClick();
                const tweetText = encodeURIComponent('🧩 Playing KANOODLE FUSION on C64! #PuzzleGame #RetroGaming');
                window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank');
              }}
              className="c64-button w-full py-1.5 sm:py-2 px-3 sm:px-4 text-xs sm:text-sm bg-[#CC44CC] border-[#8C28D8]"
            >
              𝕏 {text.shareButton}
            </button>
          </div>
        </div>
      </div>

      {/* Rainbow stripe - bottom */}
      <div className="absolute bottom-4 sm:bottom-8 left-0 right-0 c64-rainbow z-10"></div>

      {/* Settings Popup */}
      {showSettings && <SettingsPopup onClose={() => setShowSettings(false)} />}

      {/* Error display - C64 Style */}
      {error && (
        <div className="fixed bottom-4 right-4 c64-border bg-[#880000] px-6 py-4 z-50">
          <p className="text-[#AAFFEE] text-[10px] c64-text-glow">{error}</p>
        </div>
      )}

      {/* CRT scanlines */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              rgba(0, 0, 0, 0.15),
              rgba(0, 0, 0, 0.15) 1px,
              transparent 1px,
              transparent 2px
            )`,
          }}
        ></div>
      </div>
    </div>
  );
}
