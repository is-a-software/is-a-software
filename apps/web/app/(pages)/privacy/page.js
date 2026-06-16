import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const sections = [
  {
    title: 'Information We Collect',
    description: 'We collect only what is needed to operate the service and secure accounts.',
    points: [
      'Account data such as email, username, and activity timestamps',
      'Domain and DNS configuration data for registered subdomains',
      'Usage data including IP, browser/device info, and feature activity',
      'Support communication and related metadata when you contact us'
    ]
  },
  {
    title: 'How We Use Information',
    description: 'Collected data is used for operations, safety, and service quality.',
    points: [
      'Operate, maintain, and improve the service',
      'Authenticate users and protect account/domain ownership',
      'Process DNS updates and enforce abuse/safety policies',
      'Provide support, service notices, and legal compliance'
    ]
  },
  {
    title: 'Public Data & Transparency',
    description: 'The project uses public infrastructure for transparent domain management.',
    content:
      'Domain records are stored in a public GitHub repository for transparency. This means domain configurations and related ownership metadata may be publicly visible, including historical changes.',
    note: 'If you need private DNS metadata, this service may not fit that use case.'
  },
  {
    title: 'Security & Retention',
    description: 'We apply standard protections and keep data only as needed.',
    points: [
      'We use HTTPS, authentication controls, and secure storage practices',
      'No internet system is 100% secure, so absolute security is not guaranteed',
      'Data is retained for operational and legal needs, then deleted on valid request when possible',
      'Public repository history may retain prior changes after account deletion'
    ]
  },
  {
    title: 'Your Rights',
    description: 'You can request control over your personal data where applicable.',
    points: [
      'Request access, correction, or deletion of your personal data',
      'Request data portability where applicable',
      'Manage communications preferences for non-critical updates',
      'Additional local rights may apply (for example GDPR/CCPA)'
    ]
  },
  {
    title: 'Third Parties, Cookies, and Policy Changes',
    description: 'Integrated services and policy updates are handled with clear disclosure.',
    points: [
      'GitHub and other integrated services have their own privacy policies',
      'We use session mechanisms and local storage for auth and functionality',
      'We may update this policy and will revise the effective date',
      'Continued use after updates constitutes acceptance of changes'
    ]
  }
];

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen px-4 pt-24 pb-20">
        <div className="max-w-4xl mx-auto space-y-10">
          <section className="glass rounded-3xl p-8 md:p-10 space-y-4">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Legal</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white">Privacy Policy</h1>
            <p className="text-slate-300 text-lg">
              Learn how is-a.software collects, uses, and protects your data.
            </p>
            <p className="text-slate-500 text-sm">Last updated: October 20, 2025</p>
          </section>

          <section className="space-y-4">
            {sections.map((section) => (
              <article key={section.title} className="glass rounded-2xl p-6 md:p-7 space-y-4">
                <h2 className="text-xl md:text-2xl font-semibold text-white">{section.title}</h2>
                {section.description && <p className="text-slate-300 leading-relaxed">{section.description}</p>}
                {section.content && <p className="text-slate-300 leading-relaxed">{section.content}</p>}
                {section.points && (
                  <ul className="space-y-2 text-slate-300 list-disc list-inside">
                    {section.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                )}
                {section.note && (
                  <div className="rounded-xl border border-white/15 bg-white/5 p-4">
                    <p className="text-slate-200">{section.note}</p>
                  </div>
                )}
              </article>
            ))}
          </section>

          <section className="glass rounded-3xl p-8 md:p-10 space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Contact Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="https://github.com/is-a-software/is-a-software/discussions"
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-2 hover:bg-white/10 transition-colors"
              >
                <h3 className="text-white text-lg font-semibold">Privacy Questions</h3>
                <p className="text-slate-400 text-sm">Ask policy questions through GitHub Discussions.</p>
              </a>
              <a
                href="https://github.com/is-a-software/is-a-software/issues"
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-2 hover:bg-white/10 transition-colors"
              >
                <h3 className="text-white text-lg font-semibold">Data Requests</h3>
                <p className="text-slate-400 text-sm">Open an issue for access, correction, or deletion requests.</p>
              </a>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
