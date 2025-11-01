/**
 * SettingsPopup Component - Commodore 64 Style
 */

import { useState, useEffect } from 'react';
import { getKanoodleText } from '../lib/uiText';
import { audioManager } from '../lib/audioManager';
import { useLanguage } from '../lib/LanguageContext';

interface SettingsPopupProps {
  onClose: () => void;
}

type Language = 'en' | 'es' | 'ja';

export function SettingsPopup({ onClose }: SettingsPopupProps) {
  const [musicEnabled, setMusicEnabled] = useState(() => {
    const saved = localStorage.getItem('musicEnabled');
    return saved ? JSON.parse(saved) : false;
  });

  const [soundEffectsEnabled, setSoundEffectsEnabled] = useState(() => {
    const saved = localStorage.getItem('soundEffectsEnabled');
    return saved ? JSON.parse(saved) : true;
  });

  const [colorblindMode, setColorblindMode] = useState(() => {
    const saved = localStorage.getItem('colorblindMode');
    return saved ? JSON.parse(saved) : false;
  });

  // Use language context instead of local state
  const { language, setLanguage } = useLanguage();

  // Get text in current language (will update when language changes)
  const text = getKanoodleText().settings;

  useEffect(() => {
    localStorage.setItem('musicEnabled', JSON.stringify(musicEnabled));
    audioManager.setMusicEnabled(musicEnabled);
    console.log(musicEnabled ? '🎵 Music enabled' : '🔇 Music disabled');
  }, [musicEnabled]);

  useEffect(() => {
    localStorage.setItem('soundEffectsEnabled', JSON.stringify(soundEffectsEnabled));
    audioManager.setSoundEffectsEnabled(soundEffectsEnabled);
    console.log(soundEffectsEnabled ? '🔔 Sound effects enabled' : '🔕 Sound effects disabled');
  }, [soundEffectsEnabled]);

  useEffect(() => {
    localStorage.setItem('colorblindMode', JSON.stringify(colorblindMode));
    console.log(colorblindMode ? '👁️ Colorblind mode enabled' : '🎨 Normal color mode');

    // Add/remove class to body for CSS styling (affects rainbow stripes, etc.)
    if (colorblindMode) {
      document.body.classList.add('colorblind-mode');
    } else {
      document.body.classList.remove('colorblind-mode');
    }

    // Trigger a re-render of components using colors
    window.dispatchEvent(new CustomEvent('colorblindModeChanged', { detail: colorblindMode }));
  }, [colorblindMode]);

  // Initialize body class on mount based on saved preference
  useEffect(() => {
    if (colorblindMode) {
      document.body.classList.add('colorblind-mode');
    }
  }, []);

  // Disable scrolling when popup is open
  useEffect(() => {
    // Save current overflow style
    const originalOverflow = document.body.style.overflow;

    // Disable scrolling
    document.body.style.overflow = 'hidden';

    // Re-enable scrolling on unmount
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="relative c64-border bg-[#6C5EB5] p-6 max-w-md w-full mx-4 shadow-2xl">
        {/* Window title bar */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-[#A4A0E4] flex items-center justify-between px-3">
          <span className="text-sm text-black font-bold">{text.title}</span>
          <button
            onClick={onClose}
            className="text-black font-bold hover:text-[#880000] text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="mt-10 space-y-6">
          {/* Music Toggle */}
          <div>
            <label className="block text-[#AAFFEE] text-xs mb-2 c64-text-glow">
              ♫ {text.music}
            </label>
            <button
              onClick={() => {
                audioManager.playButtonClick();
                setMusicEnabled(!musicEnabled);
              }}
              className={`w-full py-3 px-4 text-sm c64-button ${
                musicEnabled
                  ? 'bg-[#00CC55] border-[#00B428] opacity-60'
                  : 'bg-[#777777] border-[#333333]'
              }`}
            >
              {musicEnabled ? text.on : text.off}
            </button>
          </div>

          {/* Sound Effects Toggle */}
          <div>
            <label className="block text-[#AAFFEE] text-xs mb-2 c64-text-glow">
              ♪ {text.soundEffects}
            </label>
            <button
              onClick={() => {
                // Play sound before toggling (so it plays when turning off too)
                if (soundEffectsEnabled) audioManager.playButtonClick();
                setSoundEffectsEnabled(!soundEffectsEnabled);
              }}
              className={`w-full py-3 px-4 text-sm c64-button ${
                soundEffectsEnabled
                  ? 'bg-[#00CC55] border-[#00B428] opacity-60'
                  : 'bg-[#777777] border-[#333333]'
              }`}
            >
              {soundEffectsEnabled ? text.on : text.off}
            </button>
          </div>

          {/* Colorblind Mode Toggle */}
          <div>
            <label className="block text-[#AAFFEE] text-xs mb-2 c64-text-glow">
              ◉ {text.colorblind}
            </label>
            <button
              onClick={() => {
                audioManager.playButtonClick();
                setColorblindMode(!colorblindMode);
              }}
              className={`w-full py-3 px-4 text-sm c64-button ${
                colorblindMode
                  ? 'bg-[#00CC55] border-[#00B428] opacity-60'
                  : 'bg-[#777777] border-[#333333]'
              }`}
            >
              {colorblindMode ? text.on : text.off}
            </button>
          </div>

          {/* Language Selector */}
          <div>
            <label className="block text-[#AAFFEE] text-xs mb-2 c64-text-glow">
              ⚑ {text.language}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['en', 'es', 'ja'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    audioManager.playMenuNav();
                    setLanguage(lang);
                  }}
                  className={`py-3 px-2 text-xs c64-button ${
                    language === lang
                      ? 'bg-[#EEEE77] border-[#FFD800] opacity-60'
                      : 'bg-[#A4A0E4] border-[#6C5EB5]'
                  }`}
                >
                  {lang === 'en' && 'EN'}
                  {lang === 'es' && 'ES'}
                  {lang === 'ja' && 'JA'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Rainbow stripe */}
        <div className="absolute bottom-0 left-0 right-0 c64-rainbow"></div>
      </div>

      {/* CRT effect */}
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
