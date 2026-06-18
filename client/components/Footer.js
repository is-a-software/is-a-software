import Link from 'next/link';

export default function Footer() {
  const cyear = new Date().getFullYear();
  return (
    <footer className="border-t divider mt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <h3 className="text-white font-semibold">is-a.software</h3>
            <p className="text-slate-400 text-sm">Your personal domain service for developers</p>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-semibold text-sm">Product</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><Link href="/signup" className="hover:text-white transition-colors">Get Started</Link></li>
              <li><Link href="/signin" className="hover:text-white transition-colors">Sign In</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-semibold text-sm">Resources</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-semibold text-sm">Community</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><a href="https://github.com/is-a-software/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub</a></li>
              <li><a href="https://x.com/priyazsh" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Twitter</a></li>
              <li><a href="https://discord.com/invite/AeAjegXn6D" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Discord</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t divider pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-400 text-sm">
          <p>&copy; {cyear} is-a.software. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <a href="mailto:admin@is-a.software" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
