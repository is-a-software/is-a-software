import { Button } from "./ui/button";
import { Terminal, ArrowRight } from "lucide-react";
import { TypingAnimation } from "./TypingAnimation";
import Link from "next/link";

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-[#000000]">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-[#0C0C0C] border border-[#333333] px-4 py-2">
            <Terminal className="h-4 w-4 text-white" />
            <span className="text-gray-300">Free subdomain service for developers</span>
          </div>
          
          <h1 className="mb-6 text-5xl sm:text-6xl font-bold text-white">
            Get Your Free
            <br />
            <span className="text-white">
              .is-a.software
            </span>
            <br />
            Subdomain
          </h1>
          
          <p className="mx-auto mb-10 max-w-xl text-gray-400">
            Claim your free subdomain and showcase your projects to the world. Perfect for developers, side projects, and demos.
          </p>
          
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="group bg-[#000000] hover:bg-[#0C0C0C] text-white border border-[#333333]">
              <Link href="/dashboard">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-[#333333] text-gray-300 hover:bg-[#0C0C0C] hover:text-white">
              <Link href="/docs">
                View Documentation
              </Link>
            </Button>
          </div>
          
          <div className="mt-8 flex items-center justify-center gap-2">
            <div className="rounded-md bg-[#0C0C0C] border border-[#333333] px-4 py-2">
              <code className="text-white">
                <TypingAnimation 
                  texts={['example', 'yourproject', 'foo', 'yourapp']} 
                  className="text-white"
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
      </div>
    </div>
  );
}
