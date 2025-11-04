import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { TypingAnimation } from "./TypingAnimation";
import Link from "next/link";

export function Hero() {
  return (  
    <div className="relative overflow-hidden bg-gradient-to-br from-black via-[#0a0a0a] to-[#1a1a1a]">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="mb-6 text-5xl sm:text-6xl font-bold text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.15)]">
            Get Your Free
            <br />
            <span className="bg-gradient-to-r from-gray-400 via-gray-200 to-white bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              .is-a.software
            </span>
            <br />
            Subdomain
          </h1>
          
          <p className="mx-auto mb-10 max-w-xl text-gray-400">
            Claim your free subdomain and showcase your projects to the world. Perfect for developers, side projects, and demos.
          </p>
          
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="group bg-blue-400 hover:bg-blue-300 text-black border-0 shadow-[0_0_20px_rgba(96,165,250,0.4)] hover:shadow-[0_0_30px_rgba(96,165,250,0.6)] transition-all">
              <Link href="/dashboard">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-[#333333] text-gray-300 hover:bg-[#0C0C0C] hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.08)]">
              <Link href="/docs">
                View Documentation
              </Link>
            </Button>
          </div>
          
          <div className="mt-8 flex items-center justify-center gap-2">
            <div className="rounded-md bg-gradient-to-r from-[#0a0a0a] to-[#0C0C0C] border border-[#333333] px-4 py-2 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
              <code className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
                <TypingAnimation 
                  texts={['example', 'yourproject', 'foo', 'yourapp']} 
                  className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
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
              <path d="M0 32V.5H32" fill="none" stroke="currentColor" strokeOpacity="0.05" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        
        {/* Subtle glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/[0.08] rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/[0.06] rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-cyan-500/[0.05] rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
