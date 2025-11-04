import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import { Footer } from '@/app/components/Footer'
import { Navbar } from '@/app/components/Navbar'
import { Shield, Database, Users, Eye, Mail, FileText } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy - is-a.software',
  description: 'Privacy Policy for is-a.software subdomain service. Learn how we protect and handle your data.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0a0a] to-[#1a1a1a]">
      <Navbar currentPage="privacy" />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.15)] mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
          <Badge variant="outline" className="mt-4 bg-[#1a1a1a] border-[#333333] text-gray-300">
            Last updated: October 20, 2025
          </Badge>
        </div>

        {/* Quick Summary */}
        <Card className="mb-8 border-[#333333] bg-gradient-to-br from-[#0C0C0C] to-[#050505] shadow-[0_0_20px_rgba(255,255,255,0.03)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Eye className="h-5 w-5 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
              Quick Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <Shield className="h-4 w-4 mt-0.5 text-green-500 drop-shadow-[0_0_6px_rgba(34,197,94,0.4)]" />
                <div>
                  <strong className="text-white">Minimal Collection</strong>
                  <p className="text-gray-400">Only GitHub username, email, and domain preferences</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Database className="h-4 w-4 mt-0.5 drop-shadow-[0_0_6px_rgba(255,255,255,0.3)]" />
                <div>
                  <strong className="text-white">Transparent Storage</strong>
                  <p className="text-gray-400">Domain records stored in public GitHub repository</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Users className="h-4 w-4 mt-0.5 drop-shadow-[0_0_6px_rgba(255,255,255,0.3)]" />
                <div>
                  <strong className="text-white">No Sharing</strong>
                  <p className="text-gray-400">We never sell or share your personal data</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Information We Collect */}
        <Card className="mb-8 bg-gradient-to-br from-[#0C0C0C] to-[#050505] border-[#333333] shadow-[0_0_20px_rgba(255,255,255,0.03)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Database className="h-5 w-5 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
              Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-3 text-white">Account Information</h3>
              <p className="text-gray-400 mb-3">
                When you sign in with GitHub, we collect:
              </p>
              <ul className="space-y-2 text-gray-400">
                <li>• <strong className="text-white">GitHub username:</strong> Used for authentication and domain ownership verification</li>
                <li>• <strong className="text-white">Email address:</strong> For account communication and security notifications</li>
                <li>• <strong className="text-white">GitHub profile information:</strong> Public profile data as provided by GitHub OAuth</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3 text-white">Domain Configuration</h3>
              <ul className="space-y-2 text-gray-400">
                <li>• <strong className="text-white">Subdomain names:</strong> The subdomains you register (e.g., &quot;myproject.is-a.software&quot;)</li>
                <li>• <strong className="text-white">DNS records:</strong> IP addresses, CNAME targets, and TXT records you configure</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3 text-white">Usage Information</h3>
              <ul className="space-y-2 text-gray-400">
                <li>• <strong className="text-white">Activity logs:</strong> Domain creation, modification, and deletion activities</li>
                <li>• <strong className="text-white">API usage:</strong> Rate limiting and abuse prevention data</li>
                <li>• <strong>Authentication tokens:</strong> Temporarily cached for performance (expires within 1 hour)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Your Information */}
        <Card className="mb-8 bg-gradient-to-br from-[#0C0C0C] to-[#050505] border-[#333333] shadow-[0_0_20px_rgba(255,255,255,0.03)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <FileText className="h-5 w-5 text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
              How We Use Your Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3 text-white">Service Provision</h3>
                <ul className="space-y-1 text-sm text-gray-400">
                  <li>• Authenticate your account</li>
                  <li>• Manage subdomain allocations</li>
                  <li>• Configure DNS records</li>
                  <li>• Track domain ownership</li>
                  <li>• Provide activity history</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3 text-white">Platform Security</h3>
                <ul className="space-y-1 text-sm text-gray-400">
                  <li>• Prevent abuse and spam</li>
                  <li>• Enforce rate limits</li>
                  <li>• Verify domain ownership</li>
                  <li>• Detect unauthorized access</li>
                  <li>• Maintain service integrity</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Storage and Security */}
        <Card className="mb-8 bg-gradient-to-br from-[#0C0C0C] to-[#050505] border-[#333333] shadow-[0_0_20px_rgba(255,255,255,0.03)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Shield className="h-5 w-5 drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]" />
              Data Storage & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2 text-white">Where Your Data Lives</h3>
              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0C0C0C] rounded-lg p-4 space-y-3 border border-[#333333]">
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="bg-[#0C0C0C] border-[#333333] text-gray-300">GitHub</Badge>
                  <div>
                    <p className="font-medium text-white">Domain Configuration</p>
                    <p className="text-sm text-gray-400">
                      Domain records are stored as JSON files in our public GitHub repository. 
                      This ensures transparency and allows community verification.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="bg-[#0C0C0C] border-[#333333] text-gray-300">Firebase</Badge>
                  <div>
                    <p className="font-medium text-white">Authentication</p>
                    <p className="text-sm text-gray-400">
                      Authentication tokens are managed by Firebase Auth with industry-standard security measures.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="bg-[#0C0C0C] border-[#333333] text-gray-300">Memory Cache</Badge>
                  <div>
                    <p className="font-medium text-white">Temporary Data</p>
                    <p className="text-sm text-gray-400">
                      Performance caches are stored temporarily in memory and automatically expire.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-white">Security Measures</h3>
              <ul className="space-y-1 text-gray-400">
                <li>• <strong className="text-white">Encryption:</strong> All data transmitted over HTTPS</li>
                <li>• <strong className="text-white">Authentication:</strong> GitHub OAuth with token validation</li>
                <li>• <strong className="text-white">Authorization:</strong> Users can only access their own domains</li>
                <li>• <strong className="text-white">Rate Limiting:</strong> Protection against abuse and spam</li>
                <li>• <strong className="text-white">Input Validation:</strong> All DNS records validated before storage</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Third-Party Services */}
        <Card className="mb-8 bg-gradient-to-br from-[#0C0C0C] to-[#050505] border-[#333333] shadow-[0_0_20px_rgba(255,255,255,0.03)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Users className="h-5 w-5 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
              Third-Party Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-400">
              We integrate with the following trusted services to provide our platform:
            </p>
            <div className="space-y-4">
              {[
                {
                  service: 'GitHub',
                  purpose: 'Authentication and domain record storage',
                  data: 'Username, email, profile information',
                  privacy: 'https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement'
                },
                {
                  service: 'Firebase (Google)',
                  purpose: 'Authentication token management',
                  data: 'Authentication tokens and session data',
                  privacy: 'https://firebase.google.com/support/privacy'
                },
                {
                  service: 'Vercel',
                  purpose: 'Application hosting and deployment',
                  data: 'Request logs and performance metrics',
                  privacy: 'https://vercel.com/legal/privacy-policy'
                }
              ].map((item, index) => (
                <div key={index} className="border border-[#333333] rounded-lg p-4 bg-gradient-to-br from-[#1a1a1a] to-[#0C0C0C] hover:shadow-[0_0_10px_rgba(255,255,255,0.05)] transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-white">{item.service}</h4>
                    <Link 
                      href={item.privacy} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-white hover:underline text-sm"
                    >
                      Privacy Policy →
                    </Link>
                  </div>
                  <p className="text-sm text-gray-400 mb-1">
                    <strong className="text-white">Purpose:</strong> {item.purpose}
                  </p>
                  <p className="text-sm text-gray-400">
                    <strong className="text-white">Data Shared:</strong> {item.data}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card className="mb-8 bg-gradient-to-br from-[#0C0C0C] to-[#050505] border-[#333333] shadow-[0_0_20px_rgba(255,255,255,0.03)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Eye className="h-5 w-5 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
              Your Privacy Rights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3 text-white">Access & Control</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• <strong className="text-white">View your data:</strong> Access all your domain configurations in the dashboard</li>
                  <li>• <strong className="text-white">Export data:</strong> Download your domain records as JSON</li>
                  <li>• <strong className="text-white">Update information:</strong> Modify DNS records anytime</li>
                  <li>• <strong className="text-white">Delete domains:</strong> Remove domains you no longer need</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3 text-white">Data Deletion</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• <strong className="text-white">Account deletion:</strong> Contact us to delete your account</li>
                  <li>• <strong className="text-white">Data removal:</strong> We&apos;ll remove all personal data within 30 days</li>
                  <li>• <strong className="text-white">Domain records:</strong> Publicly visible records remain for service integrity</li>
                  <li>• <strong className="text-white">Cache expiration:</strong> Cached data expires automatically</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cookies and Tracking */}
        <Card className="mb-8 bg-gradient-to-br from-[#0C0C0C] to-[#050505] border-[#333333] shadow-[0_0_20px_rgba(255,255,255,0.03)]">
          <CardHeader>
            <CardTitle className="text-white">Cookies & Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 mb-4">
              We use minimal tracking to provide and improve our service:
            </p>
            <div className="space-y-3">
              <div>
                <Badge variant="outline" className="mr-2 bg-[#1a1a1a] border-[#333333] text-gray-300">Essential</Badge>
                <strong className="text-white">Authentication Cookies:</strong>
                <span className="text-gray-400"> Required for login and session management</span>
              </div>
              <div>
                <Badge variant="outline" className="mr-2 bg-[#1a1a1a] border-[#333333] text-gray-300">Performance</Badge>
                <strong className="text-white">Caching:</strong>
                <span className="text-gray-400"> Temporary data storage to improve response times</span>
              </div>
              <div>
                <Badge variant="outline" className="mr-2 bg-[#1a1a1a] border-[#333333] text-gray-300">Security</Badge>
                <strong className="text-white">Rate Limiting:</strong>
                <span className="text-gray-400"> Protection against abuse and spam attempts</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 mt-4">
              We do not use advertising cookies, third-party trackers, or analytics that identify individual users.
            </p>
          </CardContent>
        </Card>

        {/* Changes to Privacy Policy */}
        <Card className="mb-8 bg-gradient-to-br from-[#0C0C0C] to-[#050505] border-[#333333] shadow-[0_0_20px_rgba(255,255,255,0.03)]">
          <CardHeader>
            <CardTitle className="text-white">Policy Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 mb-4">
              We may update this privacy policy from time to time. When we do:
            </p>
            <ul className="space-y-1 text-gray-400">
              <li>• We&apos;ll update the &quot;Last updated&quot; date at the top of this page</li>
              <li>• For significant changes, we&apos;ll notify users via email or dashboard announcement</li>
              <li>• The updated policy will be effective immediately upon posting</li>
              <li>• Previous versions will be available in our GitHub repository</li>
            </ul>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mb-8 bg-gradient-to-br from-[#0C0C0C] to-[#050505] border-[#333333] shadow-[0_0_20px_rgba(255,255,255,0.03)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Mail className="h-5 w-5 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
              Contact Us
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 mb-4">
              Have questions about this privacy policy or how we handle your data? We&apos;re here to help:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2 text-white">General Questions</h4>
                <ul className="space-y-1 text-sm text-gray-400">
                  <li>• <Link href="https://github.com/is-a-software/is-a-software/discussions" className="text-gray-300 hover:text-white hover:underline">GitHub Discussions</Link></li>
                  <li>• <Link href="https://github.com/is-a-software/is-a-software/issues" className="text-gray-300 hover:text-white hover:underline">GitHub Issues</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-white">Privacy Concerns</h4>
                <ul className="space-y-1 text-sm text-gray-400">
                  <li>• Open a privacy-related issue on GitHub</li>
                  <li>• Tag your issue with &quot;privacy&quot; label</li>
                  <li>• We&apos;ll respond within 48 hours</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-400">
          <p>
            This privacy policy is part of our commitment to transparency. 
            View the source of this page on{' '}
            <Link href="https://github.com/is-a-software/is-a-software" className="text-gray-300 hover:text-white hover:underline">
              GitHub
            </Link>
            .
          </p>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}