import Link from "next/link"
import { VercelLogo } from "@/components/vercel-logo"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

export function Header() {
  return (
    <header className="container mx-auto px-6 h-16 flex items-center justify-between max-w-[1400px]">
      <div className="flex items-center gap-8">
        <Link href="/" aria-label="Vercel Homepage">
          <VercelLogo className="h-4" />
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="#" className="flex items-center gap-1 text-sm hover:text-gray-800">
            Products <ChevronDown className="w-4 h-4" />
          </Link>
          <Link href="#" className="flex items-center gap-1 text-sm hover:text-gray-800">
            Solutions <ChevronDown className="w-4 h-4" />
          </Link>
          <Link href="#" className="flex items-center gap-1 text-sm hover:text-gray-800">
            Resources <ChevronDown className="w-4 h-4" />
          </Link>
          <Link href="#" className="text-sm hover:text-gray-800">
            Enterprise
          </Link>
          <Link href="#" className="text-sm hover:text-gray-800">
            Docs
          </Link>
          <Link href="#" className="text-sm hover:text-gray-800">
            Pricing
          </Link>
        </nav>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" className="hidden sm:inline-flex">
          Contact
        </Button>
        <Button variant="outline" className="hidden sm:inline-flex bg-transparent">
          Dashboard
        </Button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500" />
      </div>
    </header>
  )
}
