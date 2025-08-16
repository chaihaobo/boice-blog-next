"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  showIcon?: boolean
  size?: "sm" | "md" | "lg"
}

export function Logo({ className, showIcon = true, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  }

  const iconSizeClasses = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  }

  return (
    <Link
      href="/"
      className={cn(
        "flex items-center space-x-2 font-bold text-primary hover:text-primary/80 transition-colors group",
        className,
      )}
    >
      {showIcon && (
        <div
          className={cn(
            "flex items-center justify-center rounded-lg bg-primary text-primary-foreground transition-all group-hover:scale-105",
            iconSizeClasses[size],
            size === "sm" ? "p-1" : size === "md" ? "p-1.5" : "p-2",
          )}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-full h-full"
          >
            <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
            <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
            <path d="M2 2l2 2" />
            <path d="M2 22l2-2" />
            <path d="M22 2l-2 2" />
            <path d="M22 22l-2-2" />
          </svg>
        </div>
      )}
      <span className={cn("font-bold tracking-tight", sizeClasses[size])}>
        Boice
        <span className="text-accent">.</span>
      </span>
    </Link>
  )
}
