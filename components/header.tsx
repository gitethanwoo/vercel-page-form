import Link from "next/link"
import { VercelLogo } from "@/components/vercel-logo"
import { Button } from "@/components/ui/button"
import { Settings2 } from "lucide-react"

interface HeaderProps {
  useMultiStep?: boolean
  onToggleForm?: () => void
}

export function Header({ useMultiStep = false, onToggleForm }: HeaderProps) {
  return (
    <header className="container mx-auto px-6 h-16 flex items-center justify-between max-w-[1400px]">
      <div className="flex items-center gap-8">
        <Link href="/" aria-label="Vercel Homepage">
          <VercelLogo className="h-4" />
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/ethanwoo-solution-overview.pdf" className="text-sm hover:text-gray-800">
            Solution Overview
          </Link>
        </nav>
      </div>
      <div className="flex items-center gap-2">
        {onToggleForm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleForm}
            className="hidden sm:inline-flex text-xs text-gray-500 hover:text-gray-700"
            title={`Switch to ${useMultiStep ? 'single-step' : 'multi-step'} form`}
          >
            <Settings2 className="w-3 h-3 mr-1" />
            {useMultiStep ? 'Single Step' : 'Multi Step'}
          </Button>
        )}
        <Link href="https://x.com/EthanWoo" target="_blank" rel="noopener noreferrer">
          <Button variant="ghost" className="hidden sm:inline-flex">
            Reach me on X
          </Button>
        </Link>
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500" />
      </div>
    </header>
  )
}
