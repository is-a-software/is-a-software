import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const termsSections = [
  {
    title: 'Service Description',
    content:
      'is-a.software provides free subdomain allocation under the is-a.software domain for developers and creators to register subdomains, configure DNS records, and manage web presence.',
    points: [
      'Free subdomain registration (for example: yourproject.is-a.software)',
      'DNS record management (A, AAAA, CNAME, TXT)',
      'GitHub-based authentication and ownership verification',
      'Web dashboard for domain management'
    ]
  },
  {
    title: 'Acceptable Use Policy',
    content: 'Use of the service must follow legal and community-safe standards.',
    columns: [
      {
        heading: 'Allowed Uses',
        points: [
          'Personal portfolios and open-source projects',
          'Educational, demo, and MVP projects',
          'Blogs, docs sites, APIs, and community projects'
        ]
      },
      {
        heading: 'Prohibited Uses',
        points: [
          'Illegal activity, malware, phishing, or spam',
          'Harassment, hate speech, explicit content, or impersonation',
          'Resource abuse, proxy/VPN misuse, or cryptomining'
        ]
      }
    ]
  },
  {
    title: 'Subdomain Naming Rules',
    points: [
      '3 to 63 characters, lowercase, alphanumeric and hyphen only',
      'Cannot start or end with a hyphen',
      'No trademark infringement, impersonation, or offensive language',
      'Reserved words may be blocked (admin, api, www, mail, etc.)'
    ]
  },
  {
    title: 'User Responsibilities',
    points: [
      'Secure your account and avoid credential sharing',
      'Maintain valid DNS configurations and remove inactive domains',
      'Respond to abuse reports promptly',
      'You may only manage domains owned by your own account'
    ]
  },
  {
    title: 'Availability, Limits, and Liability',
    points: [
      'Service is provided on a best-effort basis without uptime guarantees',
      'DNS propagation can take up to 48 hours globally',
      'Rate limits may apply to registration, DNS edits, and deletion',
      'Service is provided as-is; liability is limited'
    ]
  },
  {
    title: 'Changes, Law, and Termination',
    points: [
      'We may update terms; significant changes are announced ahead of time',
      'Continued use after updates means acceptance',
      'Accounts may be suspended for abuse or policy violations',
      'We aim for fair process except in clear abuse/illegal cases'
    ]
  }
];

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen px-4 pt-24 pb-20">
        <div className="max-w-4xl mx-auto space-y-10">
          <section className="glass rounded-3xl p-8 md:p-10 space-y-4">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Legal</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white">Terms of Service</h1>
            <p className="text-slate-300 text-lg">
              Please read these terms carefully before using is-a.software.
            </p>
            <p className="text-slate-500 text-sm">Last updated: October 20, 2025</p>
            <div className="rounded-xl border border-white/15 bg-white/5 p-4">
              <p className="text-slate-200">
                By using is-a.software, you agree to these terms. If you disagree with any part,
                please do not use the service.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            {termsSections.map((section) => (
              <article key={section.title} className="glass rounded-2xl p-6 md:p-7 space-y-4">
                <h2 className="text-2xl font-semibold text-white">{section.title}</h2>
                {section.content && <p className="text-slate-300 leading-relaxed">{section.content}</p>}

                {section.columns ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {section.columns.map((column) => (
                      <div key={column.heading} className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-2">
                        <h3 className="text-white text-lg font-semibold">{column.heading}</h3>
                        <ul className="space-y-1 text-slate-300 text-sm list-disc list-inside">
                          {column.points.map((point) => (
                            <li key={point}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  section.points && (
                    <ul className="space-y-2 text-slate-300 list-disc list-inside">
                      {section.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  )
                )}
              </article>
            ))}
          </section>

          <section className="glass rounded-3xl p-8 md:p-10 space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="https://github.com/is-a-software/is-a-software/discussions"
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-2 hover:bg-white/10 transition-colors"
              >
                <h3 className="text-white text-lg font-semibold">General Questions</h3>
                <p className="text-slate-400 text-sm">Use GitHub Discussions for policy and terms questions.</p>
              </a>
              <a
                href="https://github.com/is-a-software/is-a-software/issues"
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-2 hover:bg-white/10 transition-colors"
              >
                <h3 className="text-white text-lg font-semibold">Abuse Reports</h3>
                <p className="text-slate-400 text-sm">Open an issue with details and add an abuse label.</p>
              </a>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
