import { Button } from "./ui/button";
import { Terminal, ArrowRight } from "lucide-react";
import { TypingAnimation } from "./TypingAnimation";
import Link from "next/link";

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#1c1c1c] to-[#111111]">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-purple-900/30 backdrop-blur-sm border border-purple-500/20 px-4 py-2">
            <Terminal className="h-4 w-4 text-purple-400" />
            <span className="text-purple-300">Free subdomain service for developers</span>
          </div>
          
          <h1 className="mb-6 text-5xl sm:text-6xl font-bold text-white">
            Get Your Free
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              .is-a.software
            </span>
            <br />
            Subdomain
          </h1>
          
          <p className="mx-auto mb-10 max-w-xl text-gray-300">
            Claim your free subdomain and showcase your projects to the world. Perfect for developers, side projects, and demos.
          </p>
          
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0">
              <Link href="/dashboard">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white">
              <Link href="/docs">
                View Documentation
              </Link>
            </Button>
          </div>
          
          <div className="mt-8 flex items-center justify-center gap-2">
            <div className="rounded-md bg-black/40 backdrop-blur-sm border border-gray-700 px-4 py-2">
              <code className="text-cyan-400">
                <TypingAnimation 
                  texts={['example', 'yourproject', 'foo', 'yourapp']} 
                  className="text-cyan-400"
                />
                .is-a.software
              </code>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <svg className="absolute left-1/2 top-0 -translate-x-1/2" width="1200" height="675" fill="none">
          <defs>
            <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M0 32V.5H32" fill="none" stroke="currentColor" strokeOpacity="0.1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        
        {/* Gradient orbs for depth */}
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-600/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
