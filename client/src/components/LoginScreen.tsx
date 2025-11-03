/**
 * LoginScreen Component - Commodore 64 Style
 */

import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from '@starknet-react/core';
import { ControllerConnector } from '@cartridge/connector';
import { SettingsPopup } from './SettingsPopup';
import { getKanoodleText } from '../lib/uiText';
import { useLanguage } from '../lib/LanguageContext';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [showSettings, setShowSettings] = useState(false);
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { language } = useLanguage();

  const controller = connectors[0] as ControllerConnector;
  const text = getKanoodleText().login;

  // Auto-navigate when wallet is connected
  useEffect(() => {
    if (isConnected && address) {
      onLoginSuccess();
    }
  }, [isConnected, address, onLoginSuccess]);

  const handleConnect = () => {
    if (controller) {
      connect({ connector: controller });
    }
  };

  return (
    <div className="h-screen w-screen bg-[#6C5EB5] c64-screen relative overflow-hidden flex flex-col">
      {/* C64 Border */}
      <div className="absolute inset-0 border-[16px] sm:border-[32px] border-[#A4A0E4] pointer-events-none"></div>

      {/* Rainbow stripe - top */}
      <div className="absolute top-4 sm:top-8 left-0 right-0 c64-rainbow z-10"></div>

      {/* Settings button */}
      <button
        onClick={() => setShowSettings(true)}
        className="absolute top-6 sm:top-12 right-6 sm:right-12 z-20 c64-button py-2 px-4 text-xs"
        title={text.settingsButton}
      >
        {text.settingsButton}
      </button>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 py-8">

        {/* Game Title - C64 style */}
        <div className="relative text-center mb-8 sm:mb-12">
          {/* Decorative pieces - Left side */}
          <div className="absolute left-[-100px] sm:left-[-140px] top-1/2 transform -translate-y-1/2 hidden md:block">
            <div className="animate-float">
              <svg width="90" height="90" viewBox="0 0 90 90" className="opacity-70">
                <rect x="0" y="0" width="30" height="30" fill="#FF0000" className="animate-pulse" />
                <rect x="30" y="0" width="30" height="30" fill="#FF0000" />
                <rect x="0" y="30" width="30" height="30" fill="#FF0000" />
              </svg>
            </div>
          </div>

          {/* Decorative pieces - Right side */}
          <div className="absolute right-[-100px] sm:right-[-140px] top-1/2 transform -translate-y-1/2 hidden md:block">
            <div className="animate-float-delayed">
              <svg width="90" height="90" viewBox="0 0 90 90" className="opacity-70">
                <rect x="30" y="0" width="30" height="30" fill="#00FF00" />
                <rect x="60" y="0" width="30" height="30" fill="#00FF00" className="animate-pulse" />
                <rect x="60" y="30" width="30" height="30" fill="#00FF00" />
              </svg>
            </div>
          </div>

          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#AAFFEE] c64-text-glow mb-3 tracking-wider"
            style={{ fontFamily: 'Press Start 2P, monospace' }}
          >
            KANOODLE
          </h1>
          <h2
            className="text-xl sm:text-2xl md:text-3xl font-bold text-[#EEEE77] c64-text-glow"
            style={{ fontFamily: 'Press Start 2P, monospace' }}
          >
            FUSION
          </h2>
        </div>

        {/* Login Button with decorative pieces */}
        <div className="relative mb-4 sm:mb-8">
          {/* Decorative piece - Bottom left */}
          <div className="absolute left-[-80px] bottom-[-30px] hidden sm:block">
            <div className="animate-float-delayed">
              <svg width="60" height="60" viewBox="0 0 60 60" className="opacity-60">
                <rect x="0" y="0" width="30" height="30" fill="#0088FF" />
                <rect x="0" y="30" width="30" height="30" fill="#0088FF" className="animate-pulse" />
              </svg>
            </div>
          </div>

          {/* Decorative piece - Bottom right */}
          <div className="absolute right-[-80px] bottom-[-30px] hidden sm:block">
            <div className="animate-float">
              <svg width="60" height="60" viewBox="0 0 60 60" className="opacity-60">
                <rect x="30" y="0" width="30" height="30" fill="#EEEE77" className="animate-pulse" />
                <rect x="30" y="30" width="30" height="30" fill="#EEEE77" />
              </svg>
            </div>
          </div>

          {!isConnected ? (
            <button
              onClick={handleConnect}
              className="c64-button py-3 sm:py-4 px-8 sm:px-12 text-xs sm:text-sm"
            >
              {text.loginButton}
            </button>
          ) : (
            <button
              onClick={() => disconnect()}
              className="c64-button bg-[#880000] border-[#664400] py-3 sm:py-4 px-8 sm:px-12 text-xs sm:text-sm"
            >
              {text.disconnectButton}
            </button>
          )}
        </div>

        {/* Blinking cursor */}
        <div className="text-[#AAFFEE] text-xl c64-blink">█</div>
      </div>

      {/* Rainbow stripe - bottom */}
      <div className="absolute bottom-4 sm:bottom-8 left-0 right-0 c64-rainbow z-10"></div>

      {/* Settings Popup */}
      {showSettings && <SettingsPopup onClose={() => setShowSettings(false)} />}

      {/* CRT scanlines effect */}
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
