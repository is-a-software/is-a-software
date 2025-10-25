import { Terminal, Github, Twitter, Mail, Linkedin } from "lucide-react";
import { FaDiscord } from "react-icons/fa";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gradient-to-br from-[#1c1c1c] to-[#111111]">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <Terminal className="h-6 w-6 text-purple-400" />
              <span className="text-white font-semibold">is-a.software</span>
            </div>
            <p className="mb-4 max-w-sm text-gray-300">
              Free subdomain service for developers. Share your projects with the world using a memorable domain.
            </p>
            <div className="flex gap-4">
              <Link href="https://github.com/is-a-software/is-a-software" target="_blank" rel="noopener noreferrer" className="text-gray-400 transition-colors hover:text-purple-400">
                <Github className="h-5 w-5" />
              </Link>
              <Link href="https://x.com/oyepriyansh" target="_blank" rel="noopener noreferrer" className="text-gray-400 transition-colors hover:text-purple-400">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="https://linkedin.com/u/priyanshprajapat" target="_blank" rel="noopener noreferrer" className="text-gray-400 transition-colors hover:text-purple-400">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="https://discord.com/invite/AeAjegXn6D" target="_blank" rel="noopener noreferrer" className="text-gray-400 transition-colors hover:text-purple-400">
                <FaDiscord className="h-5 w-5" />
              </Link>
              <Link href="mailto:admin@is-a.software" className="text-gray-400 transition-colors hover:text-purple-400">
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="mb-4 text-white font-semibold">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#features" className="text-gray-300 transition-colors hover:text-purple-400">
                  Features
                </Link>
              </li>
              <li>
                <Link href="https://docs.is-a.software" className="text-gray-300 transition-colors hover:text-purple-400">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 text-white font-semibold">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 transition-colors hover:text-purple-400">
                  About
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 transition-colors hover:text-purple-400">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 transition-colors hover:text-purple-400">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-800 pt-8">
          <p className="text-center text-gray-400">
            © 2025 is-a.software. Built with ❤️ for developers by{" "}
            <Link 
              href="https://oyepriyansh.github.io" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              Priyansh Prajapat
            </Link>.
          </p>
        </div>
      </div>
    </footer>
  );
}
