'use client'

import { Menu } from 'lucide-react'
import React from 'react'

interface MobileMenuButtonProps {
  onClick: () => void
}

export const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="md:hidden p-2 hover:bg-accent rounded-md transition-colors"
      aria-label="Open menu"
      aria-expanded={false}
    >
      <Menu className="w-6 h-6" />
    </button>
  )
}
