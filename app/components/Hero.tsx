import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { TypingAnimation } from "./TypingAnimation";
import Link from "next/link";

export function Hero() {
  return (  
    <div className="relative overflow-hidden bg-gradient-to-br from-black via-[#0a0a0a] to-[#1a1a1a]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-4 sm:mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.15)] leading-tight">
            Get Your Free
            <br />
            <span className="bg-gradient-to-r from-gray-400 via-gray-200 to-white bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              .is-a.software
            </span>
            <br />
            Subdomain
          </h1>
          
          <p className="mx-auto mb-6 sm:mb-8 lg:mb-10 max-w-sm sm:max-w-md lg:max-w-xl text-sm sm:text-base lg:text-lg text-gray-400 leading-relaxed px-4 sm:px-0">
            Claim your free subdomain and showcase your projects to the world. Perfect for developers, side projects, and demos.
          </p>
          
          <div className="flex flex-col items-center gap-3 sm:gap-4 sm:flex-row sm:justify-center px-4 sm:px-0">
            <Button asChild size="lg" className="group bg-blue-400 hover:bg-blue-300 text-black border-0 shadow-[0_0_20px_rgba(96,165,250,0.4)] hover:shadow-[0_0_30px_rgba(96,165,250,0.6)] transition-all w-full sm:w-auto text-sm sm:text-base">
              <Link href="/dashboard">
                Get Started
                <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-[#333333] text-gray-300 hover:bg-[#0C0C0C] hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.08)] w-full sm:w-auto text-sm sm:text-base">
              <Link href="/docs">
                View Documentation
              </Link>
            </Button>
          </div>
          
          <div className="mt-6 sm:mt-8 flex items-center justify-center gap-2 px-4 sm:px-0">
            <div className="rounded-md bg-gradient-to-r from-[#0a0a0a] to-[#0C0C0C] border border-[#333333] px-3 py-2 sm:px-4 shadow-[0_0_15px_rgba(255,255,255,0.05)] max-w-full overflow-hidden">
              <code className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] text-xs sm:text-sm md:text-base break-all">
                <TypingAnimation 
                  texts={['myproject', 'something', 'foo', 'yourapp', 'devprofiles', 'redroselinux', 'glasschat', 'unspoken', 'covergenius', 'githubroaster', 'relivemusic']} 
                  className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
                />
                <span className="text-white">.is-a.software</span>
              </code>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <svg className="absolute left-1/2 top-0 -translate-x-1/2 w-full max-w-[1200px]" width="1200" height="675" fill="none" viewBox="0 0 1200 675">
          <defs>
            <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M0 32V.5H32" fill="none" stroke="currentColor" strokeOpacity="0.05" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        
        {/* Subtle glow orbs - responsive sizes */}
        <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 sm:w-60 sm:h-60 lg:w-80 lg:h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/3 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
