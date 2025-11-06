import { Zap, Shield, Globe, Code, Rocket, HeartHandshake } from "lucide-react";
import { Card, CardContent } from "./ui/card";

const features = [
  {
    icon: Zap,
    title: "Instant Setup",
    description: "Get your subdomain configured in minutes. No complex setup or waiting periods required.",
    color: "from-yellow-400 to-orange-500",
    glow: "rgba(251,191,36,0.4)",
  },
  {
    icon: Shield,
    title: "Free Forever",
    description: "Completely free with no hidden costs. We believe in supporting the developer community.",
    color: "from-green-400 to-emerald-500",
    glow: "rgba(34,197,94,0.4)",
  },
  {
    icon: Globe,
    title: "Custom DNS",
    description: "Point your subdomain to any IP address or CNAME. Full control over your DNS configuration.",
    color: "from-blue-400 to-cyan-500",
    glow: "rgba(59,130,246,0.4)",
  },
  {
    icon: Code,
    title: "Developer Friendly",
    description: "Built by developers, for developers. Simple API and documentation to get you started.",
    color: "from-purple-400 to-pink-500",
    glow: "rgba(168,85,247,0.4)",
  },
  {
    icon: Rocket,
    title: "Fast & Reliable",
    description: "Lightning-fast DNS propagation with 99.9% uptime. Your projects deserve the best.",
    color: "from-red-400 to-rose-500",
    glow: "rgba(239,68,68,0.4)",
  },
  {
    icon: HeartHandshake,
    title: "Community Driven",
    description: "Join a growing community of developers using .is-a.software for their projects.",
    color: "from-pink-400 to-fuchsia-500",
    glow: "rgba(236,72,153,0.4)",
  },
];

export function Features() {
  return (
    <div id="features" className="bg-gradient-to-b from-[#1a1a1a] via-black to-black py-12 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Why Choose is-a.software?</h2>
          <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
            Everything you need to share your projects with the world, all in one place.
          </p>
        </div>
        
        <div className="mx-auto mt-8 sm:mt-12 lg:mt-16 grid max-w-5xl grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="bg-gradient-to-br from-[#0C0C0C] to-[#050505] border-[#333333] transition-all hover:shadow-lg hover:shadow-white/[0.05] hover:bg-gradient-to-br hover:from-[#1a1a1a] hover:to-[#0a0a0a] hover:border-[#555555]">
              <CardContent className="p-4 sm:p-6">
                <div className={`mb-3 sm:mb-4 inline-flex rounded-lg bg-gradient-to-br ${feature.color} p-2.5 sm:p-3 shadow-[0_0_20px_${feature.glow}]`}>
                  <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h3 className="mb-2 text-base sm:text-lg font-semibold text-white">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
