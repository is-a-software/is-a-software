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
      example: "71ce80-some-dns-record.com"
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
      example: "some-random-token-like-178297bff11ec47679bc"
    }
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0a0a] to-[#1a1a1a]">
      <Navbar currentPage="docs" />
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.15)] mb-3 sm:mb-4">
            Documentation
          </h1>
          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto px-4 sm:px-0 leading-relaxed">
            Easy steps to get your free .is-a.software subdomain working.
          </p>
          <Badge variant="outline" className="mt-3 sm:mt-4 bg-[#1a1a1a] border-blue-500/30 text-blue-400 text-xs sm:text-sm">
            <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-2 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
            User Guide
          </Badge>
        </div>
          
        {/* Step-by-Step Guide */}
        <Card className="mb-8 sm:mb-12 bg-gradient-to-br from-[#0C0C0C] to-[#050505] border-[#333333] shadow-[0_0_20px_rgba(255,255,255,0.03)]">
          <CardContent className='mt-6 sm:mt-8'>
            <div className="space-y-4 sm:space-y-6">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-4 sm:p-6 border border-[#333333] rounded-lg bg-gradient-to-br from-[#0C0C0C] to-[#050505] hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-shadow">
                  <div className="flex-shrink-0 self-start">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-400/30 text-purple-400 rounded-full flex items-center justify-center font-bold text-sm sm:text-lg shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                      {step.number}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                      Step {step.number}: {step.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-400 leading-relaxed mb-3 sm:mb-4">
                      {step.link ? (
                        <>
                          Go to{' '}
                          <Link href={step.link} className="text-gray-200 hover:text-white underline">
                            is-a.software dashboard
                          </Link>
                          , sign in with GitHub, and choose your subdomain name like &apos;myproject&apos;. This will create myproject.is-a.software for you.
                        </>
                      ) : (
                        step.description
                      )}
                    </p>
                    {step.image && (
                      <div className="mt-3 sm:mt-4">
                        <Image
                          src={step.image}
                          alt={`Step ${step.number} illustration`}
                          width={800}
                          height={400}
                          className="rounded-lg border border-[#333333] w-full h-auto"
                        />
                      </div>
                    )}
                    {step.note && (
                      <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gradient-to-r from-[#1a1a1a] to-[#0C0C0C] border border-yellow-500/30 rounded-lg">
                        <p className="text-yellow-200 text-xs sm:text-sm leading-relaxed">
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
        <Card className="mb-8 sm:mb-12 bg-gradient-to-br from-[#0C0C0C] to-[#050505] border-[#333333] shadow-[0_0_20px_rgba(255,255,255,0.03)]">
          <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6">
            <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2 text-white text-base sm:text-lg">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] shrink-0" />
              <span className="leading-tight">Types of DNS Records You Can Use (your record value will be different)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {recordTypes.map((record, index) => (
                <div key={index} className="border border-[#333333] rounded-lg p-3 sm:p-4 bg-gradient-to-br from-[#1a1a1a] to-[#0C0C0C] hover:shadow-[0_0_10px_rgba(255,255,255,0.05)] transition-shadow">
                  <h3 className="text-base sm:text-lg font-semibold mb-2 text-white">{record.type}</h3>
                  <p className="text-gray-400 text-xs sm:text-sm mb-2 sm:mb-3 leading-relaxed">{record.description}</p>
                  <div className="bg-[#0C0C0C] p-2 rounded border border-[#333333] overflow-x-auto">
                    <code className="text-green-400 text-xs sm:text-sm break-all">{record.example}</code>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Community & Support */}
        <Card className="bg-gradient-to-br from-[#0C0C0C] to-[#050505] border-[#333333] shadow-[0_0_20px_rgba(255,255,255,0.03)]">
          <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6">
            <CardTitle className="flex items-center gap-2 text-white text-base sm:text-lg">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
              Community & Support
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <a 
                href="https://discord.com/invite/AeAjegXn6D" 
                target="_blank" 
                rel="noopener noreferrer"
                className="border border-[#333333] rounded-lg p-3 sm:p-4 bg-gradient-to-br from-[#1a1a1a] to-[#0C0C0C] hover:shadow-[0_0_15px_rgba(255,255,255,0.08)] transition-all group"
              >
                <h3 className="font-semibold mb-2 text-white group-hover:text-gray-200 text-sm sm:text-base">Discord Community</h3>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">Join our Discord server for real-time support and discussions</p>
              </a>
              <a 
                href="https://github.com/is-a-software/is-a-software/issues" 
                target="_blank" 
                rel="noopener noreferrer"
                className="border border-[#333333] rounded-lg p-3 sm:p-4 bg-gradient-to-br from-[#1a1a1a] to-[#0C0C0C] hover:shadow-[0_0_15px_rgba(255,255,255,0.08)] transition-all group"
              >
                <h3 className="font-semibold mb-2 text-white group-hover:text-gray-200 text-sm sm:text-base">Issue Tracker</h3>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">Report bugs, request features, or ask questions on GitHub</p>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
}