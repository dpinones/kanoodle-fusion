/**
 * LoginScreen Component - Commodore 64 Style
 * READY.
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
    <div className="min-h-screen bg-[#6C5EB5] c64-screen relative overflow-hidden">
      {/* C64 Border */}
      <div className="absolute inset-0 border-[32px] border-[#A4A0E4] pointer-events-none"></div>

      {/* Rainbow stripe - top */}
      <div className="absolute top-8 left-0 right-0 c64-rainbow z-10"></div>

      {/* Settings button */}
      <button
        onClick={() => setShowSettings(true)}
        className="absolute top-12 right-12 z-20 c64-button py-2 px-3 text-xs"
      >
        SETTINGS
      </button>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-24">
        {/* C64 Boot text style */}
        <div className="mb-12 text-center">
          <pre className="text-[#AAFFEE] c64-text-glow text-sm md:text-base leading-tight">
{`    **** COMMODORE 64 BASIC V2 ****

 64K RAM SYSTEM  38911 BASIC BYTES FREE

READY.`}
          </pre>
        </div>

        {/* Game Title - C64 style */}
        <div className="text-center mb-16">
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-[#AAFFEE] c64-text-glow mb-4 tracking-wider"
            style={{ fontFamily: 'Press Start 2P, monospace' }}
          >
            KANOODLE
          </h1>
          <h2
            className="text-2xl md:text-3xl font-bold text-[#EEEE77] c64-text-glow mb-2"
            style={{ fontFamily: 'Press Start 2P, monospace' }}
          >
            FUSION
          </h2>
          <p className="text-[#BBBBBB] text-xs mt-4">
            (C) 2025 STARKNET
          </p>
        </div>

        {/* Login Box - C64 Window Style */}
        <div className="w-full max-w-md mb-8">
          <div className="c64-border bg-[#6C5EB5]/90 p-6 relative">
            {/* Window title bar */}
            <div className="absolute top-0 left-0 right-0 h-6 bg-[#A4A0E4] flex items-center px-2">
              <div className="text-[10px] text-black font-bold">CONNECT WALLET</div>
            </div>

            <div className="mt-8 text-center">
              {!isConnected ? (
                <>
                  <pre className="text-[#AAFFEE] text-xs mb-6 text-left">
{`LOAD "WALLET",8,1

SEARCHING FOR WALLET...
`}
                  </pre>
                  <button
                    onClick={handleConnect}
                    className="c64-button py-4 px-8 text-sm w-full"
                  >
                    CONNECT
                  </button>
                  <p className="text-[#777777] text-[10px] mt-4">
                    PRESS BUTTON TO CONNECT
                  </p>
                </>
              ) : (
                <>
                  <pre className="text-[#00CC55] text-xs mb-4 text-left">
{`READY.

WALLET FOUND:
${address?.slice(0, 10)}...${address?.slice(-8)}

STATUS: CONNECTED`}
                  </pre>
                  <button
                    onClick={() => disconnect()}
                    className="c64-button bg-[#880000] border-[#664400] py-3 px-6 text-sm w-full"
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

        {/* Footer info */}
        <div className="mt-8 text-center text-[#777777] text-[10px]">
          <p>POWERED BY CARTRIDGE CONTROLLER</p>
          <p className="mt-2">DOJO ENGINE / STARKNET</p>
        </div>
      </div>

      {/* Rainbow stripe - bottom */}
      <div className="absolute bottom-8 left-0 right-0 c64-rainbow z-10"></div>

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
