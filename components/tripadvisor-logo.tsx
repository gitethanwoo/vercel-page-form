import Image from "next/image"
import type { HTMLAttributes } from "react"

interface TripadvisorLogoProps extends HTMLAttributes<HTMLDivElement> {}

export function TripadvisorLogo({ className, ...props }: TripadvisorLogoProps) {
  return (
    <div className={className} {...props}>
      <Image 
        src="/trip-advisor-light.37b99599.svg" 
        alt="TripAdvisor" 
        width={120} 
        height={32}
        className="h-6 w-auto"
      />
    </div>
  )
}
