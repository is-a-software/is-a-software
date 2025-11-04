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
    <div className="bg-gradient-to-b from-[#1a1a1a] via-black to-black py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-white">Ready to Get Started?</h2>
          <p className="mb-10 text-gray-400">
            Join thousands of developers already using .is-a.software for their projects.
          </p>
          
          <div className="mx-auto max-w-md">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="yourname"
                  value={subdomain}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  className="h-12 pr-40 bg-gradient-to-r from-[#0a0a0a] to-[#0C0C0C] border-[#333333] text-white placeholder:text-gray-500 focus:border-white focus:ring-white"
                  maxLength={63}
                  minLength={3}
                />
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                  .is-a.software
                </div>
              </div>
              <Button 
                size="lg" 
                onClick={handleCheck}
                disabled={checking || !subdomain.trim()}
                className="h-12 bg-gradient-to-r from-black to-[#1a1a1a] hover:from-[#0a0a0a] hover:to-[#2a2a2a] text-white border border-[#333333] disabled:opacity-50 shadow-[0_0_15px_rgba(255,255,255,0.08)] hover:shadow-[0_0_25px_rgba(255,255,255,0.12)] transition-all"
              >
                {checking ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Search className="mr-2 h-4 w-4" />
                )}
                {checking ? 'Checking...' : 'Check'}
              </Button>
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 rounded-lg border border-[#333333] bg-gradient-to-br from-[#0C0C0C] to-[#050505]">
                <div className="flex items-center gap-3 text-red-400">
                  <XCircle className="h-5 w-5 flex-shrink-0" />
                  <div className="text-left">
                    <p className="font-medium">{error}</p>
                    <p className="text-sm text-gray-400 mt-1">Please check your connection and try again</p>
                  </div>
                </div>
              </div>
            )}

            {/* Check Result */}
            {checkResult && (
              <div className={`mt-4 p-4 rounded-lg border transition-all duration-200 ${
                checkResult.available 
                  ? 'border-[#333333] bg-gradient-to-br from-[#0C0C0C] to-[#050505]' 
                  : checkResult.reserved 
                  ? 'border-[#333333] bg-gradient-to-br from-[#0C0C0C] to-[#050505]'
                  : 'border-[#333333] bg-gradient-to-br from-[#0C0C0C] to-[#050505]'
              }`}>
                {checkResult.available ? (
                  <div className="flex items-center gap-3 text-white">
                    <CheckCircle className="h-5 w-5 flex-shrink-0" />
                    <div className="text-left">
                      <p className="font-medium">🎉 {subdomain}.is-a.software is available!</p>
                      <p className="text-sm text-gray-400 mt-1">
                        <Link href="/login" className="text-white hover:text-gray-300 underline inline-flex items-center gap-1">
                          Sign in to claim it now →
                        </Link>
                      </p>
                    </div>
                  </div>
                ) : checkResult.reserved ? (
                  <div className="flex items-center gap-3 text-red-400">
                    <XCircle className="h-5 w-5 flex-shrink-0" />
                    <div className="text-left">
                      <p className="font-medium">❌ {checkResult.message}</p>
                      <p className="text-sm text-gray-400 mt-1">Reserved keywords cannot be used. Try a different name.</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-white">
                    <div className="text-left flex-1">
                      <p className="font-medium">👤 {subdomain}.is-a.software is taken</p>
                      {checkResult.owner?.github && (
                        <div className="flex items-center gap-2 mt-1">
                          <Image
                            src={`https://avatars.githubusercontent.com/${checkResult.owner.github}?s=20`}
                            alt={checkResult.owner.github}
                            width={20}
                            height={20}
                            className="rounded-full"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/fallback-avatar.png';
                            }}
                          />
                          <span className="text-sm text-gray-400">Owned by</span>
                          <a 
                            href={checkResult.owner.profileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white hover:text-gray-300 underline text-sm flex items-center gap-1"
                          >
                            {checkResult.owner.github}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      )}
                      <p className="text-sm text-gray-400 mt-1">Try a different subdomain name.</p>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {!checkResult && !error && (
              <p className="mt-4 text-gray-400 text-sm">
                Check if your desired subdomain is available • 3-63 characters • Letters, numbers, and hyphens only
              </p>
            )}
          </div>
          
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-gray-400">
            
            
          </div>
        </div>
      </div>
    </div>
  );
}
