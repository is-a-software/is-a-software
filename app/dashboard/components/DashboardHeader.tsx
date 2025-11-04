"use client";

import { Button } from '@/app/components/ui/button';
import { Terminal, LogOut } from 'lucide-react';
import Image from 'next/image';

export interface DashboardHeaderProps {
  user: {
    photoURL?: string | null;
    displayName?: string | null;
  };
  onLogout: () => void;
}

export function DashboardHeader({ user, onLogout }: DashboardHeaderProps) {
  return (
    <header className="bg-gradient-to-r from-[#0a0a0a] via-[#0C0C0C] to-[#0a0a0a] backdrop-blur-md border-b border-[#333333] sticky top-0 z-50 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Terminal className="h-8 w-8 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
            <span className="text-xl font-bold text-white">is-a.software</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {user.photoURL && (
                <Image
                  src={user.photoURL}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="rounded-full border border-[#333333]"
                />
              )}
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onLogout}
              className="border-[#333333] text-gray-300 hover:bg-[#0C0C0C] hover:text-white"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}