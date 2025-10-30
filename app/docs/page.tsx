import { Metadata } from 'next'
import { Footer } from '@/app/components/Footer';
import { Navbar } from '@/app/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import Link from 'next/link';
import Image from 'next/image';
import { FileText, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Documentation - is-a.software',
  description: 'Step-by-step guide to get your free .is-a.software subdomain up and running.',
}

interface Step {
  number: number;
  title: string;
  description: string;
  image?: string;
  link?: string;
  note?: string;
}

export default function DocsPage() {
  const steps: Step[] = [
    {
      number: 1,
      title: "Deploy Your Website",
      description: "Deploy your website on Vercel, Netlify, Render, or any hosting platform."
    },
    {
      number: 2,
      title: "Add Custom Domain & Get DNS Record",
      description: "In your hosting platform settings, add your future custom domain (like myproject.is-a.software). The platform will show you DNS records to copy. Most platforms give you a CNAME record (like 'cname.vercel-dns.com'), but some providers give you A records (IP addresses like '192.168.1.1') instead. Note: Your DNS record will be different depending on your hosting platform.",
      image: "/dns-create.png",
      note: "⚠️ Special Note for Vercel Users: If Vercel asks you to create a TXT record for '_vercel', you should instead create '_vercel.myproject' (replace 'myproject' with your actual subdomain name). This ensures proper domain verification."
    },
    {
      number: 3,
      title: "Register Your Subdomain",
      description: "Go to is-a.software dashboard, sign in with GitHub, and choose your subdomain name like 'myproject'. This will create myproject.is-a.software for you.",
      link: "/dashboard"
    },
    {
      number: 4,
      title: "Create DNS Record",
      description: "In the is-a.software dashboard, choose the correct record type (CNAME if you got a domain name, or A Record if you got an IP address) and paste the value you copied from Step 2. Click submit to create your DNS record."
    },
    {
      number: 5,
      title: "Wait for DNS to Work",
      description: "Wait 5-30 minutes for DNS changes to spread worldwide. Then visit your new subdomain - your website should be live!"
    }
  ];

  const recordTypes = [
    {
      type: "CNAME",
      description: "Connect your subdomain to another website (best for most websites)",
      example: "your-project.vercel.app"
    },
    {
      type: "A Record",
      description: "Connect your subdomain to a server IP address (IPv4)",
      example: "192.168.1.1"
    },
    {
      type: "AAAA Record", 
      description: "Connect your subdomain to a server IP address (IPv6)",
      example: "2001:db8::1"
    },
    {
      type: "TXT Record",
      description: "Add verification codes or configuration text",
      example: "verification-token-here"
    }
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Navbar currentPage="docs" />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Documentation
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Easy steps to get your free .is-a.software subdomain working.
          </p>
          <Badge variant="outline" className="mt-4">
            <FileText className="w-4 h-4 mr-2" />
            User Guide
          </Badge>
        </div>
          
        {/* Step-by-Step Guide */}
        <Card className="mb-12">
          <CardContent className='mt-8'>
            <div className="space-y-6">
              {steps.map((step, index) => (
                <div key={index} className="flex gap-4 p-6 border rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                      {step.number}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Step {step.number}: {step.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      {step.link ? (
                        <>
                          Go to{' '}
                          <Link href={step.link} className="text-purple-400 hover:text-purple-300 underline">
                            is-a.software dashboard
                          </Link>
                          , sign in with GitHub, and choose your subdomain name like &apos;myproject&apos;. This will create myproject.is-a.software for you.
                        </>
                      ) : (
                        step.description
                      )}
                    </p>
                    {step.image && (
                      <div className="mt-4">
                        <Image
                          src={step.image}
                          alt={`Step ${step.number} illustration`}
                          width={800}
                          height={400}
                          className="rounded-lg border border-gray-600"
                        />
                      </div>
                    )}
                    {step.note && (
                      <div className="mt-4 p-4 bg-yellow-600/20 border border-yellow-500/30 rounded-lg">
                        <p className="text-yellow-200 text-sm leading-relaxed">
                          {step.note}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* DNS Record Types */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              Types of DNS Records You Can Use
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {recordTypes.map((record, index) => (
                <div key={index} className="border rounded-lg p-4 bg-slate-50 dark:bg-slate-800/50">
                  <h3 className="text-lg font-semibold mb-2">{record.type}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{record.description}</p>
                  <div className="bg-muted p-2 rounded">
                    <code className="text-green-600 dark:text-green-400 text-xs">{record.example}</code>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Community & Support */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Community & Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <a 
                href="https://discord.com/invite/AeAjegXn6D" 
                target="_blank" 
                rel="noopener noreferrer"
                className="border border-indigo-200 dark:border-indigo-500/30 rounded-lg p-4 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors group"
              >
                <h3 className="font-semibold mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Discord Community</h3>
                <p className="text-muted-foreground text-sm">Join our Discord server for real-time support and discussions</p>
              </a>
              <a 
                href="https://github.com/is-a-software/is-a-software/issues" 
                target="_blank" 
                rel="noopener noreferrer"
                className="border rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
              >
                <h3 className="font-semibold mb-2 group-hover:text-slate-600 dark:group-hover:text-slate-300">Issue Tracker</h3>
                <p className="text-muted-foreground text-sm">Report bugs, request features, or ask questions on GitHub</p>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
}