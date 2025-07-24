import Image from "next/image"
import type { HTMLAttributes } from "react"

interface SonosLogoProps extends HTMLAttributes<HTMLDivElement> {}

export function SonosLogo({ className, ...props }: SonosLogoProps) {
  return (
    <div className={className} {...props}>
      <Image 
        src="/sonos-light.7055d1a7.svg" 
        alt="Sonos" 
        width={100} 
        height={32}
        className="h-4 w-auto"
      />
    </div>
  )
}
