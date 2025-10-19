"use client";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search, CheckCircle, XCircle, User, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

export function CTA() {
  const [stats, setStats] = useState<{ total: number; active: number } | null>(null);
  const [uptime, setUptime] = useState<{ percentage: number } | null>(null);
  const [subdomain, setSubdomain] = useState("");
  const [checking, setChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<{
    available?: boolean;
    reserved?: boolean;
    owner?: { github: string; profileUrl: string };
    message?: string;
    subdomain?: string;
  } | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const [statsRes, uptimeRes] = await Promise.all([
          fetch('/api/stats', { cache: 'no-store' }),
          fetch('/api/uptime', { cache: 'no-store' })
        ]);
        
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }
        
        if (uptimeRes.ok) {
          const uptimeData = await uptimeRes.json();
          setUptime(uptimeData);
        }
      } catch (e) {
        console.error('Failed to load stats:', e);
      }
    }
    loadStats();
  }, []);

  const handleCheck = async () => {
    if (!subdomain.trim()) return;
    
    setChecking(true);
    setCheckResult(null);
    
    try {
      const response = await fetch(`/api/check?subdomain=${encodeURIComponent(subdomain.trim())}`);
      const result = await response.json();
      setCheckResult(result);
    } catch (error) {
      console.error('Failed to check subdomain:', error);
      setCheckResult({
        available: false,
        message: 'Failed to check availability'
      });
    } finally {
      setChecking(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCheck();
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#1c1c1c] to-[#111111] py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-white">Ready to Get Started?</h2>
          <p className="mb-10 text-gray-300">
            Join thousands of developers already using .is-a.software for their projects.
          </p>
          
          <div className="mx-auto max-w-md">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="yourname"
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  onKeyPress={handleKeyPress}
                  className="h-12 pr-40 bg-black/30 border-gray-600 text-white placeholder:text-gray-400"
                />
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  .is-a.software
                </div>
              </div>
              <Button 
                size="lg" 
                onClick={handleCheck}
                disabled={checking || !subdomain.trim()}
                className="h-12 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white border-0 disabled:opacity-50"
              >
                {checking ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Search className="mr-2 h-4 w-4" />
                )}
                {checking ? 'Checking...' : 'Check'}
              </Button>
            </div>
            
            {/* Check Result */}
            {checkResult && (
              <div className="mt-4 p-4 rounded-lg border">
                {checkResult.available ? (
                  <div className="flex items-center gap-3 text-green-400">
                    <CheckCircle className="h-5 w-5" />
                    <div className="text-left">
                      <p className="font-medium">🎉 {subdomain}.is-a.software is available!</p>
                      <p className="text-sm text-gray-300 mt-1">
                        <Link href="/dashboard" className="text-green-400 hover:text-green-300 underline">
                          Claim it now →
                        </Link>
                      </p>
                    </div>
                  </div>
                ) : checkResult.reserved ? (
                  <div className="flex items-center gap-3 text-red-400">
                    <XCircle className="h-5 w-5" />
                    <div className="text-left">
                      <p className="font-medium">❌ {checkResult.message}</p>
                      <p className="text-sm text-gray-300 mt-1">Try a different subdomain name</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-yellow-400">
                    <User className="h-5 w-5" />
                    <div className="text-left flex-1">
                      <p className="font-medium">👤 {subdomain}.is-a.software is taken</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Image
                          src={`https://avatars.githubusercontent.com/${checkResult.owner?.github}?s=20`}
                          alt={checkResult.owner?.github || 'User'}
                          width={20}
                          height={20}
                          className="rounded-full"
                        />
                        <span className="text-sm text-gray-300">Owned by</span>
                        <a 
                          href={checkResult.owner?.profileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-yellow-400 hover:text-yellow-300 underline text-sm flex items-center gap-1"
                        >
                          {checkResult.owner?.github}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <p className="mt-4 text-gray-300">
              Check if your desired subdomain is available
            </p>
          </div>
          
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-gray-300">
            <div className="text-center">
              <div className="mb-1 text-2xl font-bold text-white">
                {stats ? `${stats.total.toLocaleString()}+` : '10,000+'}
              </div>
              <div className="text-gray-400">Active Subdomains</div>
            </div>
            <div className="h-8 w-px bg-gray-600" />
            <div className="text-center">
              <div className="mb-1 text-2xl font-bold text-white">
                {uptime ? `${uptime.percentage.toFixed(1)}%` : '99.9%'}
              </div>
              <div className="text-gray-400">Uptime</div>
            </div>
            <div className="h-8 w-px bg-gray-600" />
            <div className="text-center">
              <div className="mb-1 text-2xl font-bold text-white">24/7</div>
              <div className="text-gray-400">Support</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
