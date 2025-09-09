'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

type ShimmerButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  intensity?: 'soft' | 'normal' | 'strong'
}

export function ShimmerButton({
  className,
  intensity = 'normal',
  children,
  ...props
}: ShimmerButtonProps) {
  const bgSize = intensity === 'soft' ? '300% 100%' : intensity === 'strong' ? '600% 100%' : '400% 100%'

  return (
    <button
      className={cn(
        'relative inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-400',
        'bg-[linear-gradient(110deg,#ec4899,45%,#a855f7,55%,#ec4899)]',
        'bg-[length:200%_100%] animate-shimmer',
        'shadow-[0_10px_20px_rgba(236,72,153,0.25)] hover:shadow-[0_12px_24px_rgba(168,85,247,0.35)]',
        className
      )}
      style={{ backgroundSize: bgSize }}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <span className="absolute inset-0 rounded-md bg-gradient-to-br from-white/10 to-transparent" />
    </button>
  )
}



