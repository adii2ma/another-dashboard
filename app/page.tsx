"use client"

import { type ReactNode, useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { MagicCard } from "./components/ui/magic-card"
import { BoxReveal } from "./components/ui/box-reveal"

const ScrollProgress = dynamic(
  () => import("./components/ui/scroll-progress").then((mod) => ({ default: mod.ScrollProgress })),
  { ssr: false, loading: () => null },
)

const Globe = dynamic(() => import("./components/ui/globe").then((mod) => ({ default: mod.Globe })), {
  ssr: false,
  loading: () => null,
})

const IconCloud = dynamic(() => import("./components/ui/icon-cloud").then((mod) => ({ default: mod.IconCloud })), {
  ssr: false,
  loading: () => null,
})

const BorderBeam = dynamic(() => import("./components/ui/border-beam").then((mod) => ({ default: mod.BorderBeam })), {
  ssr: false,
  loading: () => null,
})

const Ripple = dynamic(() => import("./components/ui/ripple").then((mod) => ({ default: mod.Ripple })), {
  ssr: false,
  loading: () => null,
})

interface FeatureCardProps {
  title: string
  children: ReactNode
}

const FeatureCard = ({ title, children }: FeatureCardProps) => (
  <MagicCard className="bg-[#0D1B2A] border border-[#415A77] p-6 rounded-xl h-full">
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-sm leading-relaxed">{children}</p>
  </MagicCard>
)

interface StepCardProps {
  title: string
  children: ReactNode
}

const StepCard = ({ title, children }: StepCardProps) => (
  <div className="relative">
    <BorderBeam />
    <div className="p-6 rounded-xl h-full bg-[#0D1B2A] border border-[#415A77]">
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm leading-relaxed">{children}</p>
    </div>
  </div>
)

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <main className="relative bg-[#0D1B2A] text-white overflow-x-hidden">
      <ScrollProgress />

      {/* Section 1: Hero with Globe */}
      <section className="min-h-screen flex flex-col items-center justify-center relative py-16">
        <h1 className="text-7xl md:text-8xl font-jakarta font-bold mb-16 text-center">MARINES</h1>
        <div className="w-full max-w-2xl aspect-square">
          <Globe />
        </div>
      </section>

      {/* Section 2: Protection Features */}
      <section className="min-h-screen flex items-center px-4 md:px-16 py-16">
        <div className="flex flex-col md:flex-row w-full gap-8">
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-4xl md:text-6xl font-jakarta font-bold leading-tight mb-8">
              Protect your content
              <br />
              from thieves
            </h2>
          </div>

          <div className="md:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeatureCard title="Find Stolen Videos Anywhere">
              Even if they're edited, cropped, or re-uploaded. We detect 85%+ matches.
            </FeatureCard>

            <FeatureCard title="Instant Alerts">Get notified immediately with links to pirated content.</FeatureCard>

            <FeatureCard title="Take Back Control">
              Download ready-to-use reports for takedowns or legal action.
            </FeatureCard>

            <FeatureCard title="24/7 Protection">
              Our AI never sleeps, constantly scanning for your content.
            </FeatureCard>
          </div>
        </div>
      </section>

      {/* Section 3: Benefits */}
      <section className="min-h-screen flex items-center px-4 md:px-16 py-16">
        <div className="flex flex-col md:flex-row w-full gap-8">
          <div className="md:w-1/2 flex items-center justify-center mb-8 md:mb-0">
            <IconCloud className="w-full h-full" />
          </div>

          <div className="md:w-1/2 p-4 md:p-8">
            <BoxReveal className="bg-[#0D1B2A] border border-[#415A77] rounded-xl p-6">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold">Why You'll Love This</h3>
                  <p className="text-sm">
                    Pirates cost creators billions yearly. Instead of wasting hours searching, let us do the dirty work.
                    Focus on creating—we'll handle the policing.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl font-bold">Who Needs This?</h3>
                  <p className="text-sm">
                    Perfect for creators (YouTubers, filmmakers, educators), businesses protecting training
                    videos/demos, and teams fighting piracy legally.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl font-bold">Your Time & Money, Protected</h3>
                  <ul className="list-disc pl-5 space-y-2 text-sm">
                    <li>No more manual searches—automate the hunt</li>
                    <li>Stop losing revenue to copycats</li>
                    <li>Protect your brand's reputation</li>
                    <li>24/7 monitoring, zero effort</li>
                  </ul>
                </div>
              </div>
            </BoxReveal>
          </div>
        </div>
      </section>

      {/* Section 4: Process Steps */}
      <section className="min-h-screen flex items-center justify-center px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl w-full p-4 md:p-16">
          <StepCard title="1. Upload Your Video">
            Securely share your original content (like your private Netflix, but better!).
          </StepCard>

          <StepCard title="2. We Play Detective">
            We scan YouTube, social media, torrents, and shady corners of the web.
          </StepCard>

          <StepCard title="AI Does the Work">Our AI compares every frame, audio clip, and watermark.</StepCard>

          <StepCard title="You Take Action">Get proof to shut down pirates—fast.</StepCard>
        </div>
      </section>

      {/* Section 5: CTA */}
      <section className="min-h-screen flex items-center justify-center relative py-16">
        <Ripple className="absolute inset-0" />
        <h2 className="text-5xl md:text-7xl font-jakarta font-bold relative z-10">Try it out</h2>
      </section>
    </main>
  )
}

