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
    <div className="bg-gradient-to-b from-black via-[#0a0a0a] to-[#1a1a1a] py-12 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl lg:text-4xl font-bold text-white">How It Works</h2>
          <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
            Get started in three simple steps. No credit card required.
          </p>
        </div>
        
        <div className="mx-auto mt-8 sm:mt-12 lg:mt-16 max-w-5xl">
          <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="relative">
                {index < steps.length - 1 && (
                  <div className="absolute left-1/2 top-12 sm:top-14 lg:top-16 hidden h-1 w-full bg-[#333333] md:block" />
                )}
                
                <div className="relative flex flex-col items-center text-center px-4">
                  <div className="mb-3 sm:mb-4 flex h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-2 border-[#333333] text-white shadow-lg shadow-white/[0.05]">
                    <step.icon className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" />
                  </div>
                  
                  <div className="mb-2 inline-block rounded-full bg-gradient-to-r from-[#0C0C0C] to-[#1a1a1a] border border-[#333333] px-2.5 py-1 sm:px-3 shadow-[0_0_10px_rgba(255,255,255,0.03)]">
                    <span className="text-xs sm:text-sm text-gray-400">Step {step.step}</span>
                  </div>
                  
                  <h3 className="mb-2 text-lg sm:text-xl font-semibold text-white">{step.title}</h3>
                  <p className="text-sm sm:text-base text-gray-400 leading-relaxed max-w-xs">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
