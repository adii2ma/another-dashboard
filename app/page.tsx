"use client"

import { type ReactNode, useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { BoxReveal as RawBoxReveal } from "./components/ui/box-reveal"
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card"
import Link from "next/link"

// Cast BoxReveal so it accepts a className prop
const BoxReveal = RawBoxReveal as React.ComponentType<{ className?: string; children: ReactNode }>

const ScrollProgress = dynamic(
  () => import("./components/ui/scroll-progress").then((mod) => ({ default: mod.ScrollProgress })),
  { ssr: false, loading: () => null },
)

const Globe = dynamic(() => import("./components/ui/globe").then((mod) => ({ default: mod.Globe })), {
  ssr: false,
  loading: () => null,
})

const Meteors = dynamic(() => import("./components/ui/meteors").then((mod) => ({ default: mod.Meteors })), {
  ssr: false,
  loading: () => null,
})

// Adjusted IconCloud dynamic import casting to accept a className prop
const IconCloud = dynamic(
  () => import("./components/ui/icon-cloud").then((mod) => ({ default: mod.IconCloud })),
  { ssr: false, loading: () => null }
) as unknown as React.ComponentType<{ className?: string }>

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
  <Card className="bg-[#0D1B2A] border border-[#415A77]">
    <CardHeader>
      <CardTitle className="text-xl font-bold text-white underline">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm leading-relaxed text-gray-300">{children}</p>
    </CardContent>
  </Card>
)

interface StepCardProps {
  title: string
  children: ReactNode
}

const StepCard = ({ title, children }: StepCardProps) => (
  <div className="relative">
    <BorderBeam />
    <Card className="bg-[#0D1B2A] border border-[#415A77]">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-white underline">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed text-gray-300">{children}</p>
      </CardContent>
    </Card>
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
        <div className="relative w-full max-w-2xl aspect-square">
          <h1 className="text-8xl md:text-9xl font-jakarta font-bold mb-8 text-center absolute top-0 left-1/2 transform -translate-x-1/2 z-10">
            <span className="text-white">M</span>
            <span className="text-black">ARIN</span>
            <span className="text-white">E</span>
          </h1>
          <Globe />
        </div>
      </section>

      {/* Section 2: Protection Features */}
      <section className="py-16 px-4 md:px-16">
        <div className="flex flex-col md:flex-row w-full gap-8">
          <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
            <h2 className="text-4xl md:text-6xl font-jakarta font-bold leading-tight mb-8">
              Protect your content
              <br />
              from Pirates
            </h2>
          </div>

          <div className="md:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeatureCard title="Find Stolen Videos Anywhere">
              Even if they're edited, cropped, or re-uploaded. We detect 85%+ matches.
            </FeatureCard>

            <FeatureCard title="Instant Alerts">
              Get notified immediately with links to pirated content.
            </FeatureCard>

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
      <section className="py-16 px-4 md:px-16">
        <div className="flex flex-col md:flex-row w-full gap-8 items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <IconCloud className="w-full h-full" />
          </div>

          <div className="md:w-1/2">
            <BoxReveal className="bg-[#0D1B2A] border border-[#415A77] rounded-xl p-6">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold">Why You'll Love This</h3>
                  <p className="text-sm text-gray-300">
                    Pirates cost creators billions yearly. Instead of wasting hours searching, let us do the dirty work.
                    Focus on creating—we'll handle the policing.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl font-bold">Who Needs This?</h3>
                  <p className="text-sm text-gray-300">
                    Perfect for creators (YouTubers, filmmakers, educators), businesses protecting training
                    videos/demos, and teams fighting piracy legally.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl font-bold">Your Time & Money, Protected</h3>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-300">
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
      <section className="py-16 px-4 md:px-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-jakarta font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <StepCard title="1. Upload Your Video">
              Securely share your original content (like your private Netflix, but better!).
            </StepCard>

            <StepCard title="2. We Play Detective">
              We scan YouTube, social media, torrents, and shady corners of the web.
            </StepCard>

            <StepCard title="3. AI Does the Work">
              Our AI compares every frame, audio clip, and watermark.
            </StepCard>

            <StepCard title="4. You Take Action">
              Get proof to shut down pirates—fast.
            </StepCard>
          </div>
        </div>
      </section>

      {/* Section 5: CTA */}
      <section className="min-h-screen flex items-center justify-center relative py-16">
        <Meteors number={20} />
        <div className="text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-jakarta font-bold mb-8">Try it out</h2>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300">
            <Link href="/auth/signin">Get Started</Link>
          </button>
        </div>
      </section>
    </main>
  )
}
