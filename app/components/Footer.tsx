import { Github, Twitter, Mail, Linkedin } from "lucide-react";
import { FaDiscord } from "react-icons/fa";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[#333333] bg-gradient-to-b from-black to-[#0a0a0a]">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <span className="text-white font-semibold">is-a.software</span>
            </div>
            <p className="mb-4 max-w-sm text-gray-400">
              Free subdomain service for developers. Share your projects with the world using a memorable domain.
            </p>
            <div className="flex gap-4">
              <Link href="https://github.com/is-a-software/is-a-software" target="_blank" rel="noopener noreferrer" className="text-gray-500 transition-colors hover:text-white">
                <Github className="h-5 w-5" />
              </Link>
              <Link href="https://x.com/oyepriyansh" target="_blank" rel="noopener noreferrer" className="text-gray-500 transition-colors hover:text-white">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="https://linkedin.com/u/priyanshprajapat" target="_blank" rel="noopener noreferrer" className="text-gray-500 transition-colors hover:text-white">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="https://discord.com/invite/AeAjegXn6D" target="_blank" rel="noopener noreferrer" className="text-gray-500 transition-colors hover:text-white">
                <FaDiscord className="h-5 w-5" />
              </Link>
              <Link href="mailto:admin@is-a.software" className="text-gray-500 transition-colors hover:text-white">
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="mb-4 text-white font-semibold">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#features" className="text-gray-400 transition-colors hover:text-white">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/docs" className="text-gray-400 transition-colors hover:text-white">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 text-white font-semibold">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 transition-colors hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 transition-colors hover:text-white">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 transition-colors hover:text-white">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-[#333333] pt-8">
          <p className="text-center text-gray-400">
            © 2025 is-a.software. Built with ❤️ for developers by{" "}
            <Link 
              href="https://oyepriyansh.github.io" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300 transition-colors"
            >
              Priyansh Prajapat
            </Link>.
          </p>
        </div>
      </div>
    </footer>
  );
}
