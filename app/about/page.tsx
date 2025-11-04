import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import { Footer } from '@/app/components/Footer'
import { Navbar } from '@/app/components/Navbar'
import { Github, Globe, Heart, Users, Zap, Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About - is-a.software',
  description: 'Learn about is-a.software - free subdomain service for developers, creators, and open source projects.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0a0a] to-[#1a1a1a]">
      <Navbar currentPage="about" />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.15)] mb-6">
            About is-a.software
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Empowering developers worldwide with free, reliable subdomain services for showcasing their amazing projects.
          </p>
        </div>

        {/* Mission Section */}
        <Card className="mb-12 bg-gradient-to-br from-[#0C0C0C] to-[#050505] border-red-500/30 shadow-[0_0_25px_rgba(239,68,68,0.15)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl text-white">
              <Heart className="h-6 w-6 text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.6)]" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg text-gray-400 leading-relaxed">
              We believe every developer deserves an easy way to showcase their work online. Whether you&apos;re building your first portfolio, 
              launching an innovative project, or contributing to open source, having a professional web presence shouldn&apos;t be a barrier.
            </p>
            <p className="text-lg text-gray-400 leading-relaxed">
              is-a.software provides free subdomains that you can use to bring your projects to life, making web development more 
              accessible and enjoyable for everyone.
            </p>
          </CardContent>
        </Card>

        {/* What We Offer */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="bg-gradient-to-br from-[#0C0C0C] to-[#050505] border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Globe className="h-5 w-5 text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                Perfect For
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-[#1a1a1a] border-[#333333] text-gray-300">Portfolio</Badge>
                  <span className="text-gray-400">Personal developer portfolios</span>
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-[#1a1a1a] border-[#333333] text-gray-300">Demo</Badge>
                  <span className="text-gray-400">Project demonstrations</span>
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-[#1a1a1a] border-[#333333] text-gray-300">Open Source</Badge>
                  <span className="text-gray-400">Open source project sites</span>
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-[#1a1a1a] border-[#333333] text-gray-300">Learning</Badge>
                  <span className="text-gray-400">Educational experiments</span>
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-[#1a1a1a] border-[#333333] text-gray-300">Startup</Badge>
                  <span className="text-gray-400">Early-stage projects</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#0C0C0C] to-[#050505] border-yellow-500/30 shadow-[0_0_20px_rgba(234,179,8,0.15)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Zap className="h-5 w-5 text-yellow-400 drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]" />
                Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_6px_rgba(34,197,94,0.6)]"></div>
                  <span className="text-gray-400">Free subdomain allocation</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_6px_rgba(34,197,94,0.6)]"></div>
                  <span className="text-gray-400">GitHub OAuth authentication</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_6px_rgba(34,197,94,0.6)]"></div>
                  <span className="text-gray-400">Easy DNS record management</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_6px_rgba(34,197,94,0.6)]"></div>
                  <span className="text-gray-400">Support for A, AAAA, CNAME, TXT records</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_6px_rgba(34,197,94,0.6)]"></div>
                  <span className="text-gray-400">Real-time activity tracking</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <Card className="mb-12 bg-gradient-to-br from-[#0C0C0C] to-[#050505] border-[#333333] shadow-[0_0_20px_rgba(255,255,255,0.03)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl text-white">
              <Users className="h-6 w-6 text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
              How It Works
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: '1', title: 'Sign In', desc: 'Authenticate with your GitHub account' },
                { step: '2', title: 'Choose', desc: 'Pick your desired subdomain name' },
                { step: '3', title: 'Configure', desc: 'Set up DNS records for your project' },
                { step: '4', title: 'Deploy', desc: 'Launch your project to the world' }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-2 border-[#333333] text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-white">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Technical Details */}
        <Card className="mb-12 bg-gradient-to-br from-[#0C0C0C] to-[#050505] border-[#333333] shadow-[0_0_20px_rgba(255,255,255,0.03)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl text-white">
              <Shield className="h-6 w-6 text-purple-500 drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]" />
              Technical Foundation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-400">
              is-a.software is built with modern web technologies to ensure reliability, security, and performance:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2 text-white">Frontend</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Next.js 15 with TypeScript</li>
                  <li>• Tailwind CSS for styling</li>
                  <li>• Shadcn/ui components</li>
                  <li>• Responsive design</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-white">Backend</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Edge Runtime for performance</li>
                  <li>• Firebase Authentication</li>
                  <li>• GitHub API integration</li>
                  <li>• DNS validation & management</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Community & Open Source */}
        <Card className="mb-12 bg-gradient-to-br from-[#0C0C0C] to-[#050505] border-[#333333] shadow-[0_0_20px_rgba(255,255,255,0.03)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl text-white">
              <Github className="h-6 w-6 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
              Open Source & Community
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-400">
              We believe in transparency and community collaboration. is-a.software is completely open source, 
              and we welcome contributions from developers around the world.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild variant="outline" className="border-[#333333] text-gray-300 hover:bg-[#0C0C0C] hover:text-white shadow-[0_0_10px_rgba(255,255,255,0.05)]">
                <Link href="https://github.com/is-a-software/is-a-software" target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4 mr-2" />
                  View Source Code
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="https://github.com/is-a-software/is-a-software/issues" target="_blank" rel="noopener noreferrer">
                  Report Issues
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="https://github.com/is-a-software/is-a-software/discussions" target="_blank" rel="noopener noreferrer">
                  Join Discussions
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Contact & Support */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Get in Touch</CardTitle>
            <CardDescription>
              Have questions, suggestions, or need help? We&apos;d love to hear from you!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">For Support</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Check our <Link href="/docs" className="text-blue-600 hover:underline">documentation</Link></li>
                  <li>• Browse <Link href="https://github.com/is-a-software/is-a-software/discussions" className="text-blue-600 hover:underline">GitHub discussions</Link></li>
                  <li>• Open an <Link href="https://github.com/is-a-software/is-a-software/issues" className="text-blue-600 hover:underline">issue on GitHub</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">For Collaboration</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Submit pull requests</li>
                  <li>• Suggest new features</li>
                  <li>• Help improve documentation</li>
                  <li>• Share your success stories</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-2xl mx-auto">
            Join thousands of developers who have already made is-a.software their home for project hosting.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/dashboard">
                Get Your Subdomain
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/login">
                Sign In with GitHub
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}