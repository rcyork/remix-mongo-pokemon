import React from 'react'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-screen w-full bg-blue-600 font-mono">
      {children}
    </div>
  )
}
