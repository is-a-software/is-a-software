"use client";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search, CheckCircle, XCircle, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

export function CTA() {
  const [subdomain, setSubdomain] = useState("");
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkResult, setCheckResult] = useState<{
    available?: boolean;
    reserved?: boolean;
    owner?: { github: string; profileUrl: string };
    message?: string;
    subdomain?: string;
  } | null>(null);

  const handleCheck = async () => {
    if (!subdomain.trim()) return;
    
    setChecking(true);
    setCheckResult(null);
    setError(null);
    
    try {
      const response = await fetch(`/api/check?subdomain=${encodeURIComponent(subdomain.trim())}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      setCheckResult(result);
    } catch (error) {
      console.error('Failed to check subdomain:', error);
      setError('Failed to check availability. Please try again.');
      setCheckResult(null);
    } finally {
      setChecking(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setSubdomain(value);
    setCheckResult(null);
    setError(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCheck();
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#1a1a1a] via-black to-black py-12 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Ready to Get Started?</h2>
          <p className="mb-6 sm:mb-8 lg:mb-10 text-sm sm:text-base text-gray-400 leading-relaxed">
            Join many developers already using .is-a.software for their projects.
          </p>
          
          <div className="mx-auto max-w-sm sm:max-w-md">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="yourname"
                  value={subdomain}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  className="h-10 sm:h-12 pr-24 sm:pr-40 bg-gradient-to-r from-[#0a0a0a] to-[#0C0C0C] border-purple-500/30 text-white placeholder:text-gray-500 focus:border-purple-400 focus:ring-purple-400 focus:shadow-[0_0_20px_rgba(168,85,247,0.3)] text-sm sm:text-base"
                  maxLength={63}
                  minLength={3}
                />
                <div className="pointer-events-none absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs sm:text-sm">
                  .is-a.software
                </div>
              </div>
              <Button 
                size="lg" 
                onClick={handleCheck}
                disabled={checking || !subdomain.trim()}
                className="h-10 sm:h-12 bg-blue-400 hover:bg-blue-300 text-black border-0 disabled:opacity-50 shadow-[0_0_15px_rgba(96,165,250,0.3)] hover:shadow-[0_0_25px_rgba(96,165,250,0.5)] transition-all text-sm sm:text-base px-4 sm:px-6"
              >
                {checking ? (
                  <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-black mr-1 sm:mr-2"></div>
                ) : (
                  <Search className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                )}
                {checking ? 'Checking...' : 'Check'}
              </Button>
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="mt-3 sm:mt-4 p-3 sm:p-4 rounded-lg border border-[#333333] bg-gradient-to-br from-[#0C0C0C] to-[#050505]">
                <div className="flex items-start sm:items-center gap-2 sm:gap-3 text-red-400">
                  <XCircle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 mt-0.5 sm:mt-0" />
                  <div className="text-left">
                    <p className="font-medium text-sm sm:text-base">{error}</p>
                    <p className="text-xs sm:text-sm text-gray-400 mt-1">Please check your connection and try again</p>
                  </div>
                </div>
              </div>
            )}

            {/* Check Result */}
            {checkResult && (
              <div className={`mt-3 sm:mt-4 p-3 sm:p-4 rounded-lg border transition-all duration-200 ${
                checkResult.available 
                  ? 'border-green-500/30 bg-gradient-to-br from-green-950/30 to-[#050505] shadow-[0_0_20px_rgba(34,197,94,0.2)]' 
                  : checkResult.reserved 
                  ? 'border-red-500/30 bg-gradient-to-br from-red-950/30 to-[#050505] shadow-[0_0_20px_rgba(239,68,68,0.2)]'
                  : 'border-yellow-500/30 bg-gradient-to-br from-yellow-950/30 to-[#050505] shadow-[0_0_20px_rgba(234,179,8,0.2)]'
              }`}>
                {checkResult.available ? (
                  <div className="flex items-start sm:items-center gap-2 sm:gap-3 text-green-400">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 mt-0.5 sm:mt-0 drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                    <div className="text-left">
                      <p className="font-medium text-sm sm:text-base">🎉 {subdomain}.is-a.software is available!</p>
                      <p className="text-xs sm:text-sm text-gray-400 mt-1">
                        <Link href="/login" className="text-green-400 hover:text-green-300 underline inline-flex items-center gap-1">
                          Sign in to claim it now →
                        </Link>
                      </p>
                    </div>
                  </div>
                ) : checkResult.reserved ? (
                  <div className="flex items-start sm:items-center gap-2 sm:gap-3 text-red-400">
                    <XCircle className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 mt-0.5 sm:mt-0 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                    <div className="text-left">
                      <p className="font-medium text-sm sm:text-base">❌ {checkResult.message}</p>
                      <p className="text-xs sm:text-sm text-gray-400 mt-1">Reserved keywords cannot be used. Try a different name.</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 sm:gap-3 text-yellow-400">
                    <div className="text-left flex-1">
                      <p className="font-medium text-sm sm:text-base">👤 {subdomain}.is-a.software is taken</p>
                      {checkResult.owner?.github && (
                        <div className="flex items-center gap-1.5 sm:gap-2 mt-1 flex-wrap">
                          <Image
                            src={`https://avatars.githubusercontent.com/${checkResult.owner.github}?s=20`}
                            alt={checkResult.owner.github}
                            width={16}
                            height={16}
                            className="rounded-full sm:w-5 sm:h-5"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/fallback-avatar.png';
                            }}
                          />
                          <span className="text-xs sm:text-sm text-gray-400">Owned by</span>
                          <a 
                            href={checkResult.owner.profileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white hover:text-gray-300 underline text-xs sm:text-sm flex items-center gap-1"
                          >
                            {checkResult.owner.github}
                            <ExternalLink className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                          </a>
                        </div>
                      )}
                      <p className="text-xs sm:text-sm text-gray-400 mt-1">Try a different subdomain name.</p>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {!checkResult && !error && (
              <p className="mt-3 sm:mt-4 text-gray-400 text-xs sm:text-sm leading-relaxed px-2 sm:px-0">
                Check if your desired subdomain is available • 3-63 characters • Letters, numbers, and hyphens only
              </p>
            )}
          </div>
          
          <div className="mt-8 sm:mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-gray-400">
            
            
          </div>
        </div>
      </div>
    </div>
  );
}
