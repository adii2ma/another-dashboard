"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Home, Upload, Search, Shield, Settings } from "lucide-react"
import { usePathname } from "next/navigation"
import type React from "react"

const FloatingDock = () => {
  const [windowWidth, setWindowWidth] = useState(0)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const menuItems = [
    { icon: <Home size={24} />, text: "Dashboard", href: "/dashboard" },
    { icon: <Upload size={24} />, text: "Upload", href: "/dashboard/upload" },
    { icon: <Search size={24} />, text: "Data Analysis", href: "/dashboard" },
    { icon: <Shield size={24} />, text: "Protect", href: "/dashboard" },
    { icon: <Settings size={24} />, text: "Settings", href: "/dashboard/settings" },
  ]

  return (
    <div className="fixed bottom-4 w-full flex justify-center px-4 z-50">
      <motion.div
        className="relative w-full max-w-[400px]"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <motion.div
          className="p-2 flex justify-center items-center gap-2 rounded-full shadow-lg border-2 border-[#E0E1DD]/20"
          style={{
            backgroundColor: "rgba(65, 90, 119, 0.95)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 8px 32px rgba(13, 27, 42, 0.2)",
          }}
        >
          {menuItems.map((item, index) => (
            <DockItem
              key={index}
              icon={item.icon}
              text={item.text}
              href={item.href}
              isActive={pathname === item.href}
              onHover={setHoveredItem}
              isHovered={hoveredItem === item.text}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}

const DockItem = ({
  icon,
  text,
  href,
  isActive,
  onHover,
  isHovered,
}: {
  icon: React.ReactNode
  text: string
  href: string
  isActive: boolean
  onHover: (text: string | null) => void
  isHovered: boolean
}) => {
  return (
    <Link href={href} className="relative group" onMouseEnter={() => onHover(text)} onMouseLeave={() => onHover(null)}>
      <motion.div
        className={`flex flex-col items-center justify-center mx-auto p-2 rounded-full transition-all duration-300 ${
          isActive
            ? "bg-[#778DA9] text-[#0D1B2A] shadow-lg shadow-[#0D1B2A]/20"
            : "text-[#E0E1DD] hover:bg-[#778DA9] hover:text-[#0D1B2A]"
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{
          opacity: isHovered ? 1 : 0.85,
        }}
      >
        {icon}
      </motion.div>
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-[#778DA9] text-[#0D1B2A] px-3 py-1.5 rounded-md text-sm font-medium shadow-lg border border-[#E0E1DD]/20"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            {text}
          </motion.div>
        )}
      </AnimatePresence>
    </Link>
  )
}

export default FloatingDock

