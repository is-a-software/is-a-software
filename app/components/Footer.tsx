import { Github, Twitter, Mail, Linkedin } from "lucide-react";
import { FaDiscord } from "react-icons/fa";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[#333333] bg-gradient-to-b from-black to-[#0a0a0a]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="mb-3 sm:mb-4 flex items-center gap-2">
              <span className="text-white font-semibold text-lg sm:text-base">is-a.software</span>
            </div>
            <p className="mb-3 sm:mb-4 max-w-sm text-gray-400 text-sm sm:text-base leading-relaxed">
              Free subdomain service for developers. Share your projects with the world using a memorable domain.
            </p>
            <div className="flex gap-3 sm:gap-4 flex-wrap">
              <Link href="https://github.com/is-a-software/is-a-software" target="_blank" rel="noopener noreferrer" className="text-gray-500 transition-all hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
                <Github className="h-5 w-5" />
              </Link>
              <Link href="https://x.com/priyanzsh_" target="_blank" rel="noopener noreferrer" className="text-gray-500 transition-all hover:text-blue-400 hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="https://linkedin.com/in/priyanzsh" target="_blank" rel="noopener noreferrer" className="text-gray-500 transition-all hover:text-blue-500 hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="https://discord.com/invite/AeAjegXn6D" target="_blank" rel="noopener noreferrer" className="text-gray-500 transition-all hover:text-[#5865F2] hover:drop-shadow-[0_0_8px_rgba(88,101,242,0.6)]">
                <FaDiscord className="h-5 w-5" />
              </Link>
              <Link href="mailto:admin@is-a.software" className="text-gray-500 transition-all hover:text-green-400 hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]">
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="mb-3 sm:mb-4 text-white font-semibold text-sm sm:text-base">Product</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                <Link href="#features" className="text-gray-400 transition-colors hover:text-white text-sm sm:text-base">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/docs" className="text-gray-400 transition-colors hover:text-white text-sm sm:text-base">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-3 sm:mb-4 text-white font-semibold text-sm sm:text-base">Company</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 transition-colors hover:text-white text-sm sm:text-base">
                  About
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 transition-colors hover:text-white text-sm sm:text-base">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 transition-colors hover:text-white text-sm sm:text-base">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 sm:mt-12 border-t border-[#333333] pt-6 sm:pt-8">
          <div className="text-center text-gray-400 space-y-1 sm:space-y-2">
            <p className="text-xs sm:text-sm">© {new Date().getFullYear()} is-a.software | All Rights Reserved</p>
            <p className="text-xs sm:text-sm">Built with ❤️  by{" "}
              <Link 
                href="https://priyanzsh.github.io" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 transition-colors"
              >
                Priyansh Prajapat
              </Link>.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
