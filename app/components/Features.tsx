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
    <div id="features" className="bg-gradient-to-br from-[#1c1c1c] to-[#111111] py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-white">Why Choose is-a.software?</h2>
          <p className="text-gray-300">
            Everything you need to share your projects with the world, all in one place.
          </p>
        </div>
        
        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="bg-black/30 backdrop-blur-sm border-gray-700 transition-all hover:shadow-lg hover:bg-black/50 hover:border-purple-500/30">
              <CardContent className="p-6">
                <div className="mb-4 inline-flex rounded-lg bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-purple-500/20 p-3">
                  <feature.icon className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="mb-2 text-white">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
