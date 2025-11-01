/**
 * LoginScreen Component - Commodore 64 Style
 */

import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from '@starknet-react/core';
import { ControllerConnector } from '@cartridge/connector';
import { SettingsPopup } from './SettingsPopup';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [showSettings, setShowSettings] = useState(false);
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const controller = connectors[0] as ControllerConnector;

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
        className="absolute top-6 sm:top-12 right-6 sm:right-12 z-20 c64-button py-1 px-2 sm:py-2 sm:px-3 text-[10px] sm:text-xs"
      >
        SETTINGS
      </button>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 py-8">

        {/* Game Title - C64 style */}
        <div className="text-center mb-8 sm:mb-12">
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

        {/* Login Box - C64 Window Style */}
        <div className="w-[85%] sm:w-full max-w-sm sm:max-w-md mb-4 sm:mb-8">
          <div className="c64-border bg-[#6C5EB5]/90 p-3 sm:p-6 relative">
            {/* Window title bar */}
            <div className="absolute top-0 left-0 right-0 h-5 sm:h-6 bg-[#A4A0E4] flex items-center px-2">
              <div className="text-[9px] sm:text-[10px] text-black font-bold">CONNECT WALLET</div>
            </div>

            <div className="mt-5 sm:mt-8 text-center">
              {!isConnected ? (
                <>
                  <button
                    onClick={handleConnect}
                    className="c64-button py-3 sm:py-4 px-6 sm:px-8 text-xs sm:text-sm w-full"
                  >
                    LOGIN
                  </button>
                </>
              ) : (
                <>
                  <pre className="text-[#00CC55] text-[10px] sm:text-xs mb-3 sm:mb-4 text-left">
{`READY.

WALLET FOUND:
${address?.slice(0, 8)}...${address?.slice(-6)}

STATUS: CONNECTED`}
                  </pre>
                  <button
                    onClick={() => disconnect()}
                    className="c64-button bg-[#880000] border-[#664400] py-2 sm:py-3 px-4 sm:px-6 text-xs sm:text-sm w-full"
                  >
                    DISCONNECT
                  </button>
                </>
              )}
            </div>
          </div>
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
