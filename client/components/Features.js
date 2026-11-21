export default function Features() {
  const features = [
    {
      title: 'Instant Setup',
      description: 'Sign in with Google, claim a name, and your records go live right away'
    },
    {
      title: 'Free & Open Source',
      description: 'No fees, no plans, no credit card. The code is on GitHub'
    },
    {
      title: 'Developer Friendly',
      description: 'Built for developers, with developers in mind'
    },
    {
      title: 'As Many Subdomains As You Need',
      description: 'Claim as many names as you like from one simple dashboard'
    },
    {
      title: 'Fast DNS',
      description: "Served from Cloudflare's global network"
    },
    {
      title: 'Real DNS Records',
      description: 'A, AAAA, CNAME, TXT, MX and NS: 3 records per account, used however you like'
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-white">Why Choose is-a.software?</h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Simple, free, and designed for developers who want their own space on the web
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div key={i} className="glass rounded-2xl p-6 space-y-3 transition-colors hover:bg-white/8">
              <h3 className="font-semibold text-white text-lg">{feature.title}</h3>
              <p className="text-slate-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
