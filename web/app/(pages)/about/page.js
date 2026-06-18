import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const perfectFor = [
  {
    title: 'Portfolio',
    description: 'Personal developer portfolios'
  },
  {
    title: 'Demo',
    description: 'Project demonstrations'
  },
  {
    title: 'Open Source',
    description: 'Open source project sites'
  },
  {
    title: 'Learning',
    description: 'Educational experiments'
  },
  {
    title: 'Startup',
    description: 'Early-stage projects'
  }
];

const features = [
  'Free subdomain allocation',
  'Easy DNS record management',
  'Support for A, AAAA, CNAME, TXT records',
  'Real-time activity tracking'
];

const howItWorks = [
  {
    step: '1',
    title: 'Sign In',
    description: 'Create or sign in to your account'
  },
  {
    step: '2',
    title: 'Choose',
    description: 'Pick your desired subdomain name'
  },
  {
    step: '3',
    title: 'Configure',
    description: 'Set up DNS records for your project'
  },
  {
    step: '4',
    title: 'Deploy',
    description: 'Launch your project to the world'
  }
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen px-4 pt-24 pb-20">
        <div className="max-w-4xl mx-auto space-y-10">
          <section className="glass rounded-3xl p-8 md:p-10 space-y-4">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">About</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white">About is-a.software</h1>
            <p className="text-slate-300 text-lg">
              Empowering developers worldwide with free, reliable subdomain services for showcasing their amazing projects.
            </p>
          </section>

          <section className="glass rounded-3xl p-8 md:p-10 space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Our Mission</h2>
            <p className="text-slate-300 leading-relaxed">
              We believe every developer deserves an easy way to showcase their work online. Whether you&apos;re
              building your first portfolio, launching an innovative project, or contributing to open source,
              having a professional web presence shouldn&apos;t be a barrier.
            </p>
            <p className="text-slate-300 leading-relaxed">
              is-a.software provides free subdomains that you can use to bring your projects to life, making web
              development more accessible and enjoyable for everyone.
            </p>
          </section>

          <section className="glass rounded-3xl p-8 md:p-10 space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Perfect For</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {perfectFor.map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-2">
                  <h3 className="text-white text-lg font-semibold">{item.title}</h3>
                  <p className="text-slate-400 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="glass rounded-3xl p-8 md:p-10 space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Features</h2>
            <ul className="space-y-2 text-slate-300 list-disc list-inside">
              {features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </section>

          <section className="glass rounded-3xl p-8 md:p-10 space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {howItWorks.map((item) => (
                <article key={item.step} className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="h-8 w-8 rounded-full border border-white/20 bg-white/5 text-white text-sm font-semibold inline-flex items-center justify-center">
                      {item.step}
                    </span>
                    <h3 className="text-white text-lg font-semibold">{item.title}</h3>
                  </div>
                  <p className="text-slate-400 text-sm">{item.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="glass rounded-3xl p-8 md:p-10 space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Technical Foundation</h2>
            <p className="text-slate-300 leading-relaxed">
              is-a.software is built with modern web technologies to ensure reliability, security, and performance:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-2">
                <h3 className="text-white text-lg font-semibold">Frontend</h3>
                <ul className="space-y-1 text-slate-400 text-sm list-disc list-inside">
                  <li>Next.js 15</li>
                  <li>Tailwind CSS for styling</li>
                  <li>Responsive design</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-2">
                <h3 className="text-white text-lg font-semibold">Backend</h3>
                <ul className="space-y-1 text-slate-400 text-sm list-disc list-inside">
                  <li>Spring Boot</li>
                  <li>GitHub API integration</li>
                  <li>Cloudflate DNS validation &amp; management</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="glass rounded-3xl p-8 md:p-10 space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Open Source & Community</h2>
            <p className="text-slate-300 leading-relaxed">
              We believe in transparency and community collaboration. is-a.software is completely open source,
              and we welcome contributions from developers around the world.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="https://github.com/is-a-software/is-a-software"
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-2 hover:bg-white/10 transition-colors"
              >
                <h3 className="text-white text-lg font-semibold">View Source Code</h3>
                <p className="text-slate-400 text-sm">Explore the project repository and contribute.</p>
              </a>
              <a
                href="https://github.com/is-a-software/is-a-software/issues"
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-2 hover:bg-white/10 transition-colors"
              >
                <h3 className="text-white text-lg font-semibold">Report Issues</h3>
                <p className="text-slate-400 text-sm">Report bugs and request features on GitHub.</p>
              </a>
            </div>
            <a
              href="https://github.com/is-a-software/is-a-software/discussions"
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-2 hover:bg-white/10 transition-colors block"
            >
              <h3 className="text-white text-lg font-semibold">Join Discussions</h3>
              <p className="text-slate-400 text-sm">Talk with the community and share ideas.</p>
            </a>
          </section>

          <section className="glass rounded-3xl p-8 md:p-10 space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Get in Touch</h2>
            <p className="text-slate-300 leading-relaxed">
              Have questions, suggestions, or need help? We&apos;d love to hear from you!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-2">
                <h3 className="text-white text-lg font-semibold">For Support</h3>
                <ul className="space-y-1 text-slate-400 text-sm list-disc list-inside">
                  <li>Check our documentation</li>
                  <li>Browse GitHub discussions</li>
                  <li>Open an issue on GitHub</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-2">
                <h3 className="text-white text-lg font-semibold">For Collaboration</h3>
                <ul className="space-y-1 text-slate-400 text-sm list-disc list-inside">
                  <li>Submit pull requests</li>
                  <li>Suggest new features</li>
                  <li>Help improve documentation</li>
                  <li>Share your success stories</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
