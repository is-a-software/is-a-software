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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Navbar currentPage="privacy" />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
          <Badge variant="outline" className="mt-4">
            Last updated: October 20, 2025
          </Badge>
        </div>

        {/* Quick Summary */}
        <Card className="mb-8 border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <Eye className="h-5 w-5" />
              Quick Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <Shield className="h-4 w-4 mt-0.5 text-green-600" />
                <div>
                  <strong>Minimal Collection</strong>
                  <p className="text-slate-600 dark:text-slate-400">Only GitHub username, email, and domain preferences</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Database className="h-4 w-4 mt-0.5 text-blue-600" />
                <div>
                  <strong>Transparent Storage</strong>
                  <p className="text-slate-600 dark:text-slate-400">Domain records stored in public GitHub repository</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Users className="h-4 w-4 mt-0.5 text-purple-600" />
                <div>
                  <strong>No Sharing</strong>
                  <p className="text-slate-600 dark:text-slate-400">We never sell or share your personal data</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Information We Collect */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-600" />
              Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">Account Information</h3>
              <p className="text-slate-700 dark:text-slate-300 mb-3">
                When you sign in with GitHub, we collect:
              </p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li>• <strong>GitHub username:</strong> Used for authentication and domain ownership verification</li>
                <li>• <strong>Email address:</strong> For account communication and security notifications</li>
                <li>• <strong>GitHub profile information:</strong> Public profile data as provided by GitHub OAuth</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Domain Configuration</h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li>• <strong>Subdomain names:</strong> The subdomains you register (e.g., &quot;myproject.is-a.software&quot;)</li>
                <li>• <strong>DNS records:</strong> IP addresses, CNAME targets, and TXT records you configure</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Usage Information</h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li>• <strong>Activity logs:</strong> Domain creation, modification, and deletion activities</li>
                <li>• <strong>API usage:</strong> Rate limiting and abuse prevention data</li>
                <li>• <strong>Authentication tokens:</strong> Temporarily cached for performance (expires within 1 hour)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Your Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600" />
              How We Use Your Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Service Provision</h3>
                <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>• Authenticate your account</li>
                  <li>• Manage subdomain allocations</li>
                  <li>• Configure DNS records</li>
                  <li>• Track domain ownership</li>
                  <li>• Provide activity history</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Platform Security</h3>
                <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
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
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-600" />
              Data Storage & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Where Your Data Lives</h3>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <Badge variant="secondary">GitHub</Badge>
                  <div>
                    <p className="font-medium">Domain Configuration</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Domain records are stored as JSON files in our public GitHub repository. 
                      This ensures transparency and allows community verification.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="secondary">Firebase</Badge>
                  <div>
                    <p className="font-medium">Authentication</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Authentication tokens are managed by Firebase Auth with industry-standard security measures.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="secondary">Memory Cache</Badge>
                  <div>
                    <p className="font-medium">Temporary Data</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Performance caches are stored temporarily in memory and automatically expire.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Security Measures</h3>
              <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                <li>• <strong>Encryption:</strong> All data transmitted over HTTPS</li>
                <li>• <strong>Authentication:</strong> GitHub OAuth with token validation</li>
                <li>• <strong>Authorization:</strong> Users can only access their own domains</li>
                <li>• <strong>Rate Limiting:</strong> Protection against abuse and spam</li>
                <li>• <strong>Input Validation:</strong> All DNS records validated before storage</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Third-Party Services */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-orange-600" />
              Third-Party Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-slate-700 dark:text-slate-300">
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
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{item.service}</h4>
                    <Link 
                      href={item.privacy} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Privacy Policy →
                    </Link>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                    <strong>Purpose:</strong> {item.purpose}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    <strong>Data Shared:</strong> {item.data}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-indigo-600" />
              Your Privacy Rights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Access & Control</h3>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li>• <strong>View your data:</strong> Access all your domain configurations in the dashboard</li>
                  <li>• <strong>Export data:</strong> Download your domain records as JSON</li>
                  <li>• <strong>Update information:</strong> Modify DNS records anytime</li>
                  <li>• <strong>Delete domains:</strong> Remove domains you no longer need</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Data Deletion</h3>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li>• <strong>Account deletion:</strong> Contact us to delete your account</li>
                  <li>• <strong>Data removal:</strong> We&apos;ll remove all personal data within 30 days</li>
                  <li>• <strong>Domain records:</strong> Publicly visible records remain for service integrity</li>
                  <li>• <strong>Cache expiration:</strong> Cached data expires automatically</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cookies and Tracking */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Cookies & Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              We use minimal tracking to provide and improve our service:
            </p>
            <div className="space-y-3">
              <div>
                <Badge variant="outline" className="mr-2">Essential</Badge>
                <strong>Authentication Cookies:</strong> Required for login and session management
              </div>
              <div>
                <Badge variant="outline" className="mr-2">Performance</Badge>
                <strong>Caching:</strong> Temporary data storage to improve response times
              </div>
              <div>
                <Badge variant="outline" className="mr-2">Security</Badge>
                <strong>Rate Limiting:</strong> Protection against abuse and spam attempts
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-4">
              We do not use advertising cookies, third-party trackers, or analytics that identify individual users.
            </p>
          </CardContent>
        </Card>

        {/* Changes to Privacy Policy */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Policy Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              We may update this privacy policy from time to time. When we do:
            </p>
            <ul className="space-y-1 text-slate-600 dark:text-slate-400">
              <li>• We&apos;ll update the &quot;Last updated&quot; date at the top of this page</li>
              <li>• For significant changes, we&apos;ll notify users via email or dashboard announcement</li>
              <li>• The updated policy will be effective immediately upon posting</li>
              <li>• Previous versions will be available in our GitHub repository</li>
            </ul>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-600" />
              Contact Us
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              Have questions about this privacy policy or how we handle your data? We&apos;re here to help:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">General Questions</h4>
                <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>• <Link href="https://github.com/is-a-software/is-a-software/discussions" className="text-blue-600 hover:underline">GitHub Discussions</Link></li>
                  <li>• <Link href="https://github.com/is-a-software/is-a-software/issues" className="text-blue-600 hover:underline">GitHub Issues</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Privacy Concerns</h4>
                <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>• Open a privacy-related issue on GitHub</li>
                  <li>• Tag your issue with &quot;privacy&quot; label</li>
                  <li>• We&apos;ll respond within 48 hours</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-slate-500 dark:text-slate-400">
          <p>
            This privacy policy is part of our commitment to transparency. 
            View the source of this page on{' '}
            <Link href="https://github.com/is-a-software/is-a-software" className="text-blue-600 hover:underline">
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