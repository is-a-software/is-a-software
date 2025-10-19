import { UserPlus, Settings, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Sign Up",
    description: "Create your free account and choose your desired subdomain name.",
    step: "01",
  },
  {
    icon: Settings,
    title: "Configure DNS",
    description: "Add your DNS records through our simple dashboard or API.",
    step: "02",
  },
  {
    icon: CheckCircle,
    title: "Go Live",
    description: "Your subdomain is ready! Point it to your project and share it with the world.",
    step: "03",
  },
];

export function HowItWorks() {
  return (
    <div className="bg-gradient-to-br from-[#1c1c1c] to-[#111111] py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-white">How It Works</h2>
          <p className="text-gray-300">
            Get started in three simple steps. No credit card required.
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-5xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="relative">
                {index < steps.length - 1 && (
                  <div className="absolute left-1/2 top-16 hidden h-1 w-full bg-gradient-to-r from-purple-600 to-cyan-600 md:block" />
                )}
                
                <div className="relative flex flex-col items-center text-center">
                  <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-cyan-600 text-white shadow-lg">
                    <step.icon className="h-10 w-10" />
                  </div>
                  
                  <div className="mb-2 inline-block rounded-full bg-purple-900/30 backdrop-blur-sm border border-purple-500/20 px-3 py-1">
                    <span className="text-purple-400">Step {step.step}</span>
                  </div>
                  
                  <h3 className="mb-2 text-white">{step.title}</h3>
                  <p className="text-gray-300">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
