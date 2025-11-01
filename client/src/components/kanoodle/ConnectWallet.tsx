/**
 * ConnectWallet Component - Commodore 64 Style
 */

import { useState, useEffect, useRef } from 'react';
import { useAccount, useConnect, useDisconnect } from '@starknet-react/core';
import { ControllerConnector } from '@cartridge/connector';

export function ConnectWallet() {
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { address } = useAccount();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const controller = connectors[0] as ControllerConnector;

  // Handle click outside dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdownOpen]);

  const handleConnect = () => {
    connect({ connector: controller });
  };

  const handleDisconnect = () => {
    disconnect();
    setIsDropdownOpen(false);
  };

  const handleOpenProfile = async () => {
    try {
      const ctrl = controller.controller;
      if (ctrl) {
        await ctrl.openProfile();
      }
    } catch (error) {
      console.error('Failed to open profile:', error);
    }
    setIsDropdownOpen(false);
  };

  const handleOpenSettings = async () => {
    try {
      const ctrl = controller.controller;
      if (ctrl) {
        ctrl.openSettings();
      }
    } catch (error) {
      console.error('Failed to open settings:', error);
    }
    setIsDropdownOpen(false);
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // If not connected
  if (!address) {
    return (
      <button
        onClick={handleConnect}
        className="c64-button py-1 px-2 sm:py-2 sm:px-4 text-[10px] sm:text-xs bg-[#00CC55] border-[#00B428]"
      >
        CONNECT
      </button>
    );
  }

  // If connected
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="c64-button py-1 px-2 sm:py-2 sm:px-3 text-[9px] sm:text-xs flex items-center gap-1 sm:gap-2 bg-[#0088FF] border-[#006CD8]"
      >
        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#00CC55] rounded-full animate-pulse" />
        <span className="hidden sm:inline">{formatAddress(address)}</span>
        <span className="sm:hidden">{address.slice(0, 4)}...{address.slice(-2)}</span>
        <span className={`transition-transform text-[8px] sm:text-xs ${isDropdownOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {/* Dropdown Menu - C64 Style */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-56 c64-border bg-[#6C5EB5] z-50">
          {/* Title bar */}
          <div className="bg-[#A4A0E4] px-2 py-1 border-b-2 border-[#000000]">
            <span className="text-[10px] text-black font-bold">WALLET MENU</span>
          </div>

          <div className="p-2 space-y-2">
            {/* Profile Option */}
            <button
              onClick={handleOpenProfile}
              className="w-full text-left px-3 py-2 text-[#AAFFEE] hover:bg-[#A4A0E4] hover:text-black transition-colors text-xs flex items-center gap-2"
            >
              <span>▸</span>
              <span>PROFILE</span>
            </button>

            {/* Settings Option */}
            <button
              onClick={handleOpenSettings}
              className="w-full text-left px-3 py-2 text-[#AAFFEE] hover:bg-[#A4A0E4] hover:text-black transition-colors text-xs flex items-center gap-2"
            >
              <span>▸</span>
              <span>SETTINGS</span>
            </button>

            {/* Divider */}
            <div className="border-t-2 border-[#A4A0E4] my-2"></div>

            {/* Disconnect Option */}
            <button
              onClick={handleDisconnect}
              className="w-full text-left px-3 py-2 text-[#FF7777] hover:bg-[#880000] hover:text-white transition-colors text-xs flex items-center gap-2"
            >
              <span>▸</span>
              <span>DISCONNECT</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
