import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
const steps = [
  {
    title: 'Step 1: Deploy Your Website',
    description:
      'Deploy your website on Vercel, Netlify, Render, or any hosting platform.'
  },
  {
    title: 'Step 2: Add Custom Domain & Get DNS Record',
    description:
      "In your hosting platform settings, add your future custom domain (like myproject.is-a.software). The platform will show you DNS records to copy. Most platforms give you a CNAME record (like 'cname.vercel-dns.com'), but some providers give you A records (IP addresses like '192.168.1.1') instead. Note: Your DNS record will be different depending on your hosting platform.",
  },
  {
    title: 'Step 3: Register Your Subdomain',
    description:
      "Go to is-a.software dashboard, sign in, and choose your subdomain name like 'myproject'. This will create myproject.is-a.software for you."
  },
  {
    title: 'Step 4: Create DNS Record',
    description:
      'In the is-a.software dashboard, choose the correct record type (CNAME if you got a domain name, or A Record if you got an IP address) and paste the value you copied from Step 2. Click submit to create your DNS record.'
  },
  {
    title: 'Step 5: Wait for DNS to Work',
    description:
      'Wait 5-30 minutes for DNS changes to spread worldwide. Then visit your new subdomain - your website should be live!'
  }
];

const recordTypes = [
  {
    type: 'CNAME',
    description: 'Connect your subdomain to another website (best for most websites)',
    value: '71ce80-some-dns-record.com'
  },
  {
    type: 'A Record',
    description: 'Connect your subdomain to a server IP address (IPv4)',
    value: '192.168.1.1'
  },
  {
    type: 'AAAA Record',
    description: 'Connect your subdomain to a server IP address (IPv6)',
    value: '2001:db8::1'
  },
  {
    type: 'TXT Record',
    description: 'Add verification codes or configuration text',
    value: 'some-random-token-like-178297bff11ec47679bc'
  }
];

export default function DocsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen px-4 pt-24 pb-20">
        <div className="max-w-4xl mx-auto space-y-10">
          <section className="glass rounded-3xl p-8 md:p-10 space-y-4">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Documentation</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white">User Guide</h1>
            <p className="text-slate-300 text-lg">
              Easy steps to get your free .is-a.software subdomain working.
            </p>
          </section>

          <section className="space-y-4">
            {steps.map((step, index) => (
              <article key={step.title} className="glass rounded-2xl p-6 md:p-7 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="h-8 w-8 rounded-full border border-white/20 bg-white/5 text-white text-sm font-semibold inline-flex items-center justify-center">
                    {index + 1}
                  </span>
                  <h2 className="text-xl md:text-2xl font-semibold text-white">{step.title}</h2>
                </div>
                <p className="text-slate-300 leading-relaxed">{step.description}</p>
                {step.note && (
                  <div className="rounded-xl border border-white/15 bg-white/5 p-4">
                    <p className="text-slate-200 leading-relaxed">{step.note}</p>
                  </div>
                )}
                {index === 1 && (
                  <div className="rounded-xl border border-dashed border-white/20 bg-white/5 p-4 text-slate-400 text-sm">
                    <Image src={"/dns-create.png"} alt="DNS Create Illustration" width={1200} height={800} />
                  </div>
                )}
              </article>
            ))}
          </section>

          <section className="glass rounded-3xl p-8 md:p-10 space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Types of DNS Records You Can Use
            </h2>
            <p className="text-slate-400">
              (your record value will be different)
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recordTypes.map((record) => (
                <div key={record.type} className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-2">
                  <h3 className="text-white text-lg font-semibold">{record.type}</h3>
                  <p className="text-slate-400 text-sm">{record.description}</p>
                  <p className="text-slate-200 text-sm font-mono break-all">{record.value}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="glass rounded-3xl p-8 md:p-10 space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Community & Support</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="https://discord.com/invite/AeAjegXn6D"
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-2 hover:bg-white/10 transition-colors"
              >
                <h3 className="text-white text-lg font-semibold">Discord Community</h3>
                <p className="text-slate-400 text-sm">
                  Join our Discord server for real-time support and discussions
                </p>
              </a>
              <a
                href="https://github.com/is-a-software/is-a-software/issues"
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-2 hover:bg-white/10 transition-colors"
              >
                <h3 className="text-white text-lg font-semibold">Issue Tracker</h3>
                <p className="text-slate-400 text-sm">
                  Report bugs, request features, or ask questions on GitHub
                </p>
              </a>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
