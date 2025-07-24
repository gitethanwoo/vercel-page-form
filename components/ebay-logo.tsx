import Image from "next/image"
import type { HTMLAttributes } from "react"

interface EbayLogoProps extends HTMLAttributes<HTMLDivElement> {}

export function EbayLogo({ className, ...props }: EbayLogoProps) {
  return (
    <div className={className} {...props}>
      <Image 
        src="/ebay-light.2b57bb49.svg" 
        alt="eBay" 
        width={80} 
        height={32}
        className="h-7 w-auto"
      />
    </div>
  )
}
