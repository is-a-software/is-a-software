import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import { Alert, AlertDescription } from '@/app/components/ui/alert'
import { Footer } from '@/app/components/Footer'
import { Navbar } from '@/app/components/Navbar'
import { FileText, Shield, AlertTriangle, Users, Globe, Gavel } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service - is-a.software',
  description: 'Terms of Service for is-a.software subdomain service. Understand your rights and responsibilities.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Navbar currentPage="terms" />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Please read these terms carefully before using is-a.software subdomain service.
          </p>
          <Badge variant="outline" className="mt-4">
            Last updated: October 20, 2025
          </Badge>
        </div>

        {/* Important Notice */}
        <Alert className="mb-8 border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-950/50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800 dark:text-orange-200">
            <strong>Important:</strong> By using is-a.software, you agree to these terms. 
            If you disagree with any part of these terms, please do not use our service.
          </AlertDescription>
        </Alert>

        {/* Service Description */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-600" />
              Service Description
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-700 dark:text-slate-300">
              is-a.software provides free subdomain allocation services under the &quot;is-a.software&quot; domain. 
              Our service allows developers and creators to register subdomains for their projects, 
              configure DNS records, and manage their web presence.
            </p>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
              <h4 className="font-semibold mb-2">What We Provide</h4>
              <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                <li>• Free subdomain registration (e.g., yourproject.is-a.software)</li>
                <li>• DNS record management (A, AAAA, CNAME, TXT records)</li>
                <li>• GitHub-based authentication and ownership verification</li>
                <li>• Web-based dashboard for managing your domains</li>
                <li>• Activity tracking and domain management tools</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Acceptable Use */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              Acceptable Use Policy
            </CardTitle>
            <CardDescription>
              Guidelines for appropriate use of our subdomain service
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-3 text-green-700 dark:text-green-300">✅ Allowed Uses</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li>• Personal developer portfolios</li>
                  <li>• Open source project websites</li>
                  <li>• Educational and learning projects</li>
                  <li>• Technical demonstrations and prototypes</li>
                  <li>• Non-commercial personal projects</li>
                </ul>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li>• Blog and documentation sites</li>
                  <li>• API endpoints and web services</li>
                  <li>• Static websites and applications</li>
                  <li>• Community and nonprofit projects</li>
                  <li>• Startup MVP and proof-of-concepts</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3 text-red-700 dark:text-red-300">❌ Prohibited Uses</h3>
              <div className="bg-red-50 dark:bg-red-950/30 rounded-lg p-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <ul className="space-y-2 text-sm text-red-700 dark:text-red-300">
                    <li>• Illegal content or activities</li>
                    <li>• Malware, phishing, or spam</li>
                    <li>• Harassment or hate speech</li>
                    <li>• Copyright infringement</li>
                    <li>• Adult or explicit content</li>
                  </ul>
                  <ul className="space-y-2 text-sm text-red-700 dark:text-red-300">
                    <li>• Commercial spam or advertising</li>
                    <li>• Resource abuse or excessive usage</li>
                    <li>• Impersonation of others</li>
                    <li>• Cryptocurrency mining</li>
                    <li>• Proxy or VPN services</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Subdomain Naming Rules</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium mb-2">Format Requirements</h4>
                  <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>• 3-63 characters in length</li>
                    <li>• Alphanumeric characters and hyphens only</li>
                    <li>• Cannot start or end with a hyphen</li>
                    <li>• Case insensitive (converted to lowercase)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Content Restrictions</h4>
                  <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>• No trademark infringement</li>
                    <li>• No impersonation of brands or individuals</li>
                    <li>• No reserved words (admin, api, www, mail, etc.)</li>
                    <li>• No offensive or inappropriate language</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Responsibilities */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              User Responsibilities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Account Security</h3>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li>• Secure your GitHub account with 2FA</li>
                  <li>• Do not share your authentication credentials</li>
                  <li>• Report suspicious activity immediately</li>
                  <li>• Keep your contact information updated</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Content Management</h3>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li>• Ensure your content complies with these terms</li>
                  <li>• Maintain accurate DNS configurations</li>
                  <li>• Remove unused or inactive subdomains</li>
                  <li>• Respond to abuse reports promptly</li>
                </ul>
              </div>
            </div>

            <Alert className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/50">
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                <strong>Ownership Verification:</strong> You can only register and manage subdomains under your own GitHub account. 
                Attempting to manage domains belonging to other users is prohibited.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Service Availability */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Service Availability & Limitations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Service Level</h3>
              <p className="text-slate-700 dark:text-slate-300 mb-3">
                is-a.software is provided as a free service on a &quot;best effort&quot; basis. While we strive for high availability:
              </p>
              <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                <li>• We do not guarantee 100% uptime or availability</li>
                <li>• Maintenance windows may cause temporary service interruptions</li>
                <li>• DNS propagation may take up to 48 hours globally</li>
                <li>• We reserve the right to implement usage limits to prevent abuse</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Current Limits</h3>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Rate Limits:</strong>
                    <ul className="mt-1 space-y-1 text-slate-600 dark:text-slate-400">
                      <li>• Domain registration: 2 per minute</li>
                      <li>• DNS edits: 5 per minute</li>
                      <li>• Domain deletion: 3 per minute</li>
                    </ul>
                  </div>
                  <div>
                    <strong>Usage Limits:</strong>
                    <ul className="mt-1 space-y-1 text-slate-600 dark:text-slate-400">
                      <li>• No hard limit on subdomains per user</li>
                      <li>• Fair use policy applies</li>
                      <li>• Bulk registrations may be restricted</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Intellectual Property */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-600" />
              Intellectual Property
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Your Content</h3>
              <p className="text-slate-700 dark:text-slate-300 mb-3">
                You retain all rights to the content you host using our subdomains. However:
              </p>
              <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                <li>• You grant us the right to store and serve your DNS configurations</li>
                <li>• Domain records are stored in our public GitHub repository</li>
                <li>• You are responsible for ensuring you have rights to use your content</li>
                <li>• You must respect the intellectual property rights of others</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Our Service</h3>
              <p className="text-slate-700 dark:text-slate-300 mb-3">
                The is-a.software platform, including its code, design, and documentation:
              </p>
              <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                <li>• Is open source and available under MIT license</li>
                <li>• Can be viewed and contributed to on GitHub</li>
                <li>• The &quot;is-a.software&quot; domain and branding remain our property</li>
                <li>• You may not create competing services using our branding</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Privacy and Data */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Privacy & Data Handling</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              Your privacy is important to us. Please review our{' '}
              <Link href="/privacy" className="text-blue-600 hover:underline font-medium">
                Privacy Policy
              </Link>{' '}
              for detailed information about how we collect, use, and protect your data.
            </p>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Key Points:</h4>
              <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                <li>• We collect minimal personal information</li>
                <li>• Domain configurations are stored publicly for transparency</li>
                <li>• We never sell or share your personal data</li>
                <li>• You can request data deletion by contacting us</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Termination */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gavel className="h-5 w-5 text-red-600" />
              Account Termination
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Voluntary Termination</h3>
              <p className="text-slate-700 dark:text-slate-300 mb-2">
                You may terminate your use of our service at any time by:
              </p>
              <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                <li>• Deleting all your subdomains through the dashboard</li>
                <li>• Contacting us to delete your account data</li>
                <li>• Simply stopping use of the service</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Service Termination</h3>
              <p className="text-slate-700 dark:text-slate-300 mb-2">
                We may suspend or terminate your access if you:
              </p>
              <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                <li>• Violate these terms of service</li>
                <li>• Use the service for prohibited activities</li>
                <li>• Abuse the service or cause harm to other users</li>
                <li>• Fail to respond to abuse reports</li>
              </ul>
            </div>

            <Alert className="border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-950/50">
              <AlertDescription className="text-orange-800 dark:text-orange-200">
                <strong>Fair Process:</strong> Before terminating accounts, we will typically attempt to contact users 
                and provide an opportunity to resolve issues, except in cases of clear abuse or illegal activity.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Limitation of Liability */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-700 dark:text-slate-300">
              is-a.software is provided free of charge, and our liability is limited accordingly:
            </p>
            
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 space-y-3">
              <div>
                <strong>No Warranties:</strong>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  The service is provided &quot;as is&quot; without warranties of any kind, express or implied.
                </p>
              </div>
              
              <div>
                <strong>Limited Liability:</strong>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  We are not liable for any damages arising from your use of the service, including but not limited to 
                  data loss, service interruptions, or business losses.
                </p>
              </div>
              
              <div>
                <strong>User Responsibility:</strong>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  You are responsible for maintaining backups of your configurations and ensuring your content 
                  complies with applicable laws.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Changes to Terms */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Changes to These Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              We may update these terms from time to time to reflect changes in our service or legal requirements:
            </p>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li>• <strong>Notification:</strong> Significant changes will be announced via email or dashboard notification</li>
              <li>• <strong>Effective Date:</strong> Changes become effective 30 days after notification</li>
              <li>• <strong>Continued Use:</strong> Using the service after changes constitutes acceptance</li>
              <li>• <strong>Disagreement:</strong> If you disagree with changes, please discontinue using the service</li>
            </ul>
          </CardContent>
        </Card>

        {/* Governing Law */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Governing Law & Dispute Resolution</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              These terms are governed by the laws of the jurisdiction where the service is operated. 
              For dispute resolution:
            </p>
            <div className="space-y-3">
              <div>
                <strong>Informal Resolution:</strong>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  We encourage users to contact us directly to resolve any issues before pursuing legal action.
                </p>
              </div>
              <div>
                <strong>Open Source Approach:</strong>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  As an open source project, we believe in transparent communication and community-driven solutions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              If you have questions about these terms or need to report violations:
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
                <h4 className="font-semibold mb-2">Abuse Reports</h4>
                <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>• Open an issue with &quot;abuse&quot; label</li>
                  <li>• Include relevant details and evidence</li>
                  <li>• We&apos;ll respond within 24-48 hours</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-slate-500 dark:text-slate-400 space-y-2">
          <p>
            By using is-a.software, you acknowledge that you have read, understood, and agree to be bound by these terms.
          </p>
          <p>
            These terms are open source and available on{' '}
            <Link href="https://github.com/is-a-software/is-a-software" className="text-blue-600 hover:underline">
              GitHub
            </Link>
            . Community feedback and improvements are welcome.
          </p>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}