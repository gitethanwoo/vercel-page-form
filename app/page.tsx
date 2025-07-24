import { Header } from "@/components/header"
import { SalesForm } from "@/components/sales-form"
import { EbayLogo } from "@/components/ebay-logo"
import { TripadvisorLogo } from "@/components/tripadvisor-logo"
import { SonosLogo } from "@/components/sonos-logo"
import { Phone, Clock } from "lucide-react"
import { Separator } from "@/components/ui/separator"


export default function SalesPage() {
  return (
    <div className="w-full px-4 min-h-screen bg-gray-50 text-black">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#9ca3af_1px,transparent_1px),linear-gradient(to_bottom,#9ca3af_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>
      <Header />
      
      <main className="container mx-auto px-1 py-16 lg:py-24 max-w-[1080px]">
          {/* 12 Grid Squares to show the grid system */}
          <div className="grid-cols-12 gap-0 border border-gray-200 relative hidden sm:grid">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="aspect-square border-r border-gray-200 last:border-r-0 flex items-center justify-center text-xs text-gray-400">
              </div>
            ))}
            
            {/* Decorative cross/plus in bottom-left of first grid square */}
            <div className="absolute bottom-[-12px] left-[-12px] w-6 h-6 pointer-events-none">
              <div className="absolute top-1/2 left-0 w-full h-px bg-gray-400 transform -translate-y-1/2"></div>
              <div className="absolute left-1/2 top-0 w-px h-full bg-gray-400 transform -translate-x-1/2"></div>
            </div>
          </div>
        
        {/* 12-Column CSS Grid with visible borders */}
        <div className="grid grid-cols-12 gap-0 border border-y-transparent border-gray-200">
          {/* Content spans 6 columns */}
          <div className="col-span-12 lg:col-span-6 border-r border-gray-200">
            <div className="flex flex-col">
              {/* Header section - always shows first */}
              <div className="p-12 border-b border-gray-200 order-1">
                <h1 className="text-3xl mb-6 md:text-3xl font-semibold tracking-tight">Talk to our Sales team.</h1>
                <div className="flex flex-col gap-6 text-lg text-gray-700">
                  <div className="flex items-start gap-4 text-base">
                    <Phone className="w-6 h-6 mt-1 text-gray-600 shrink-0" />
                    <p className="text-gray-500">
                      <span className="font-medium text-black">Get a custom demo.</span> Discover the value of Vercel for your
                      enterprise and explore our custom plans and pricing.
                    </p>
                  </div>
                  <div className="flex items-start gap-4 text-base">
                    <Clock className="w-6 h-6 mt-1 text-gray-600 shrink-0" />
                    <p className="text-gray-500">
                      <span className="font-medium text-black">Set up your Enterprise trial.</span> See for yourself how
                      Vercel Enterprise speeds up your workflow & impact.
                    </p>
                  </div>
                </div>
              </div>

              {/* Mobile only: Form goes here */}
              <div className="lg:hidden order-2 p-12 bg-white border-b border-gray-200">
                <SalesForm />
              </div>

              {/* Stats and testimonials - shows after form on mobile, stays in left column on desktop */}
              <div className="order-3">
                <div className="flex flex-row border-b border-gray-200">
                  <div className="flex flex-col w-full p-12 border-r border-gray-200">
                    <p className="text-xl font-semibold mb-4">
                      6x faster <span className="font-normal text-gray-700">to build and deploy.</span>
                    </p>
                    <EbayLogo className="h-4 w-auto text-gray-500" />
                  </div>
                  <div className="flex flex-col w-full p-12">
                    <p className="text-xl font-semibold mb-4">
                      98% faster <span className="font-normal text-gray-700">time to market.</span>
                    </p>
                    <TripadvisorLogo className="h-4 w-auto text-gray-500" />
                  </div>
                </div>
                <div className="p-12">
                  <blockquote className="text-xl italic text-gray-700">
                    &quot;Vercel makes <span className="font-bold text-black">our developers happier</span> and lets us{" "}
                    <span className="font-bold text-black">go to market quicker</span>.&quot;
                  </blockquote>
                  <SonosLogo className="mt-4 h-4 w-auto text-gray-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Desktop only: Form in right column */}
          <div className="hidden lg:block col-span-12 bg-white lg:col-span-6 p-12">
            <SalesForm />
          </div>
        </div>
        <div className="grid grid-cols-12 gap-0 border border-gray-200 relative">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="aspect-square border-r border-gray-200 last:border-r-0 flex items-center justify-center text-xs text-gray-400">
              </div>
            ))}
            
            {/* Decorative cross/plus in bottom-left of first grid square */}
            <div className="absolute top-[-12px] right-[-12px] w-6 h-6 pointer-events-none">
              <div className="absolute top-1/2 left-0 w-full h-px bg-gray-400 transform -translate-y-1/2"></div>
              <div className="absolute left-1/2 top-0 w-px h-full bg-gray-400 transform -translate-x-1/2"></div>
            </div>
          </div>
      </main>
    </div>
  )
}
