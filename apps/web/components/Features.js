export default function Features() {
  const features = [
    {
      title: 'Instant Setup',
      description: 'Get your subdomain activated in seconds, not days'
    },
    {
      title: 'Free & Open',
      description: 'No hidden fees, no complicated pricing tiers'
    },
    {
      title: 'Developer Friendly',
      description: 'Built for developers, with developers in mind'
    },
    {
      title: 'Easy Management',
      description: 'Simple dashboard to manage all your subdomains'
    },
    {
      title: 'Fast & Reliable',
      description: 'Global DNS infrastructure ensures 99.9% uptime'
    },
    {
      title: 'Custom Records',
      description: 'Full control over DNS records when you need it'
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
