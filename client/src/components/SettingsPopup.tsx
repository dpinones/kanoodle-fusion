/**
 * SettingsPopup Component - Commodore 64 Style
 */

import { useState, useEffect, useRef } from 'react';
import { getKanoodleText } from '../lib/uiText';
import { audioManager } from '../lib/audioManager';
import { useLanguage } from '../lib/LanguageContext';

interface SettingsPopupProps {
  onClose: () => void;
}

type Language = 'en' | 'es' | 'ja';

export function SettingsPopup({ onClose }: SettingsPopupProps) {
  const [musicVolume, setMusicVolume] = useState(() => {
    const saved = localStorage.getItem('musicVolume');
    return saved ? parseFloat(saved) : 1.0;
  });

  const [soundVolume, setSoundVolume] = useState(() => {
    const saved = localStorage.getItem('soundVolume');
    return saved ? parseFloat(saved) : 1.0;
  });

  // Refs to track previous values
  const prevMusicVolumeRef = useRef(musicVolume);
  const prevSoundVolumeRef = useRef(soundVolume);

  const [colorblindMode, setColorblindMode] = useState(() => {
    const saved = localStorage.getItem('colorblindMode');
    return saved ? JSON.parse(saved) : false;
  });

  // Use language context instead of local state
  const { language, setLanguage } = useLanguage();

  // Get text in current language (will update when language changes)
  const text = getKanoodleText().settings;

  useEffect(() => {
    const prevValue = prevMusicVolumeRef.current;

    localStorage.setItem('musicVolume', musicVolume.toString());
    audioManager.setMusicVolume(musicVolume);

    // Only start/stop music when crossing the 0 threshold
    if (prevValue === 0 && musicVolume > 0) {
      audioManager.setMusicEnabled(true);
    } else if (musicVolume === 0 && prevValue > 0) {
      audioManager.setMusicEnabled(false);
    }

    // Update ref for next time
    prevMusicVolumeRef.current = musicVolume;

    console.log(`🎵 Music volume: ${Math.round(musicVolume * 100)}%`);
  }, [musicVolume]);

  useEffect(() => {
    localStorage.setItem('soundVolume', soundVolume.toString());
    audioManager.setSoundVolume(soundVolume);
    console.log(`🔔 Sound volume: ${Math.round(soundVolume * 100)}%`);
  }, [soundVolume]);

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
      <div className="relative c64-border bg-[#6C5EB5] p-4 w-80 mx-4 shadow-2xl">
        {/* Window title bar */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-[#A4A0E4] flex items-center justify-between px-3 border-b-2 border-[#000000]">
          <span className="text-[10px] text-black font-bold">{text.title}</span>
          <button
            onClick={onClose}
            className="text-black font-bold hover:text-[#880000] text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="mt-10 space-y-4">
          {/* Music Volume */}
          <div>
            <label className="block text-[#AAFFEE] text-xs mb-2 c64-text-glow flex justify-between">
              <span>♫ {text.music}</span>
              <span>{Math.round(musicVolume * 100)}%</span>
            </label>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={musicVolume}
                onChange={(e) => {
                  const newVolume = parseFloat(e.target.value);
                  setMusicVolume(newVolume);
                }}
                className="w-full h-8 appearance-none bg-[#000000] border-2 border-[#A4A0E4] cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #00CC55 0%, #00CC55 ${musicVolume * 100}%, #000000 ${musicVolume * 100}%, #000000 100%)`
                }}
              />
            </div>
          </div>

          {/* Sound Effects Volume */}
          <div>
            <label className="block text-[#AAFFEE] text-xs mb-2 c64-text-glow flex justify-between">
              <span>♪ {text.soundEffects}</span>
              <span>{Math.round(soundVolume * 100)}%</span>
            </label>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={soundVolume}
                onChange={(e) => {
                  const newVolume = parseFloat(e.target.value);
                  setSoundVolume(newVolume);
                }}
                className="w-full h-8 appearance-none bg-[#000000] border-2 border-[#A4A0E4] cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #00CC55 0%, #00CC55 ${soundVolume * 100}%, #000000 ${soundVolume * 100}%, #000000 100%)`
                }}
              />
            </div>
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
                  ? 'bg-[#00CC55] border-[#00B428]'
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
                      ? 'bg-[#EEEE77] border-[#FFD800]'
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

        {/* Footer */}
        <div className="mt-6 text-center">
          <pre className="text-[#777777] text-[10px]">
{`SETTINGS SAVED
PRESS ANY KEY TO CONTINUE`}
          </pre>
          <div className="text-[#AAFFEE] text-sm c64-blink mt-2">█</div>
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
