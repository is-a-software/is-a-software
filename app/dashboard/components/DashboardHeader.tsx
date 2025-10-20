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
    <header className="bg-black/30 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Terminal className="h-8 w-8 text-purple-400" />
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
                  className="rounded-full border border-gray-600"
                />
              )}
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onLogout}
              className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
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