import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import Link from "next/link";

export function CTA() {
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
                  className="h-12 pr-40 bg-black/30 border-gray-600 text-white placeholder:text-gray-400"
                />
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  .is-a.software
                </div>
              </div>
              <Button asChild size="lg" className="h-12 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white border-0">
                <Link href="/check">
                  <Search className="mr-2 h-4 w-4" />
                  Check
                </Link>
              </Button>
            </div>
            <p className="mt-4 text-gray-300">
              Check if your desired subdomain is available
            </p>
          </div>
          
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-gray-300">
            <div className="text-center">
              <div className="mb-1 text-2xl font-bold text-white">10,000+</div>
              <div className="text-gray-400">Active Subdomains</div>
            </div>
            <div className="h-8 w-px bg-gray-600" />
            <div className="text-center">
              <div className="mb-1 text-2xl font-bold text-white">99.9%</div>
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
