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
    <div className="h-screen bg-[#6C5EB5] c64-screen relative overflow-hidden flex flex-col">
      {/* C64 Border */}
      <div className="absolute inset-0 border-[32px] border-[#A4A0E4] pointer-events-none"></div>

      {/* Rainbow stripe - top */}
      <div className="absolute top-8 left-0 right-0 c64-rainbow z-10"></div>

      {/* Top right buttons */}
      <div className="absolute top-12 right-12 z-20 flex gap-3">
        <ConnectWallet />
        <button
          onClick={() => {
            audioManager.playMenuNav();
            setShowSettings(true);
          }}
          className="c64-button py-2 px-3 text-xs"
        >
          SETTINGS
        </button>
      </div>

      {/* Main content - Optimized to fit screen */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 py-8">
        {/* READY prompt */}
        <div className="mb-2">
          <pre className="text-[#AAFFEE] c64-text-glow text-xs">READY.</pre>
        </div>

        {/* Game Title - C64 ASCII art style - Smaller */}
        <div className="text-center mb-4">
          <pre className="text-[#AAFFEE] c64-text-glow text-xl md:text-2xl font-bold leading-tight mb-2">
{`╔═══════════════════╗
║  K A N O O D L E  ║
║   F U S I O N     ║
╚═══════════════════╝`}
          </pre>
          <p className="text-[#EEEE77] text-xs mt-2">
            PUZZLE LOGIC GAME
          </p>
        </div>

        {/* Menu Options - Compact */}
        <div className="w-full max-w-md space-y-3">
          {/* Play button */}
          <div className="c64-border bg-[#6C5EB5]/90 p-3">
            <button
              onClick={handleStartGame}
              disabled={isCreatingGame || !address}
              className="c64-button w-full py-3 px-6 text-base bg-[#00CC55] border-[#00B428] disabled:bg-[#777777] disabled:border-[#333333]"
            >
              {isCreatingGame ? '⏳ CREATING GAME...' : `▶ ${text.playButton}`}
            </button>
          </div>

          {/* Tutorial button */}
          <div className="c64-border bg-[#6C5EB5]/90 p-3">
            <button
              onClick={() => {
                audioManager.playMenuNav();
                navigate('/tutorial');
              }}
              className="c64-button w-full py-3 px-6 text-base bg-[#0088FF] border-[#006CD8]"
            >
              ? {text.tutorialButton}
            </button>
          </div>

          {/* Share button */}
          <div className="c64-border bg-[#6C5EB5]/90 p-3">
            <button
              onClick={() => {
                audioManager.playButtonClick();
                const tweetText = encodeURIComponent('🧩 Playing KANOODLE FUSION on C64! Built on Starknet with Dojo #FOCG #Starknet @ohayo_dojo');
                window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank');
              }}
              className="c64-button w-full py-3 px-6 text-base bg-[#CC44CC] border-[#8C28D8]"
            >
              𝕏 {text.shareButton}
            </button>
          </div>
        </div>

        {/* Credits */}
        <div className="mt-6 text-center text-[#777777] text-[10px]">
          <p>POWERED BY CARTRIDGE</p>
          <p className="mt-1">DOJO ENGINE</p>
        </div>
      </div>

      {/* Rainbow stripe - bottom */}
      <div className="absolute bottom-8 left-0 right-0 c64-rainbow z-10"></div>

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
