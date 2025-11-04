import { Zap, Shield, Globe, Code, Rocket, HeartHandshake } from "lucide-react";
import { Card, CardContent } from "./ui/card";

const features = [
  {
    icon: Zap,
    title: "Instant Setup",
    description: "Get your subdomain configured in minutes. No complex setup or waiting periods required.",
  },
  {
    icon: Shield,
    title: "Free Forever",
    description: "Completely free with no hidden costs. We believe in supporting the developer community.",
  },
  {
    icon: Globe,
    title: "Custom DNS",
    description: "Point your subdomain to any IP address or CNAME. Full control over your DNS configuration.",
  },
  {
    icon: Code,
    title: "Developer Friendly",
    description: "Built by developers, for developers. Simple API and documentation to get you started.",
  },
  {
    icon: Rocket,
    title: "Fast & Reliable",
    description: "Lightning-fast DNS propagation with 99.9% uptime. Your projects deserve the best.",
  },
  {
    icon: HeartHandshake,
    title: "Community Driven",
    description: "Join a growing community of developers using .is-a.software for their projects.",
  },
];

export function Features() {
  return (
    <div id="features" className="bg-gradient-to-b from-[#1a1a1a] via-black to-black py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-white">Why Choose is-a.software?</h2>
          <p className="text-gray-400">
            Everything you need to share your projects with the world, all in one place.
          </p>
        </div>
        
        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="bg-gradient-to-br from-[#0C0C0C] to-[#050505] border-[#333333] transition-all hover:shadow-lg hover:shadow-white/[0.05] hover:bg-gradient-to-br hover:from-[#1a1a1a] hover:to-[#0a0a0a] hover:border-[#555555]">
              <CardContent className="p-6">
                <div className="mb-4 inline-flex rounded-lg bg-gradient-to-br from-[#1A1A1A] to-[#0a0a0a] border border-[#333333] p-3 shadow-[0_0_15px_rgba(255,255,255,0.03)]">
                  <feature.icon className="h-6 w-6 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" />
                </div>
                <h3 className="mb-2 text-white">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
