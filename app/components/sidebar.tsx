"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Home, Upload, Search, Shield, Settings } from "lucide-react"
import { usePathname } from "next/navigation"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"

import FileUpload from "./fileupload"

const FloatingDock: React.FC = () => {
  const [windowWidth, setWindowWidth] = useState(0)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [showFileUploadModal, setShowFileUploadModal] = useState(false)
  const [showCrawlerModal, setShowCrawlerModal] = useState(false)
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
    { icon: <Search size={24} />, text: "Scan", onClick: () => setShowCrawlerModal(true) },
    { icon: <Shield size={24} />, text: "Protect", href: "/dashboard" },
    { icon: <Settings size={24} />, text: "Settings", href: "/dashboard/settings" },
  ]

  return (
    <>
      <ToastContainer />
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
                onClick={item.onClick}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showFileUploadModal && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-[#0D1B2A] bg-opacity-50 backdrop-blur-md"></div>
            <motion.div
              className="relative bg-[#1B263B] p-6 rounded-lg w-full max-w-md shadow-2xl"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={() => setShowFileUploadModal(false)}
                className="absolute top-2 right-2 text-[#E0E1DD] text-xl"
              >
                &times;
              </button>
              <FileUpload />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCrawlerModal && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-[#0D1B2A] bg-opacity-50 backdrop-blur-md"></div>
            <motion.div
              className="relative bg-[#1B263B] p-6 rounded-lg w-full max-w-md shadow-2xl"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={() => setShowCrawlerModal(false)}
                className="absolute top-2 right-2 text-[#E0E1DD] text-xl"
              >
                &times;
              </button>
              <CrawlerForm onClose={() => setShowCrawlerModal(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

interface DockItemProps {
  icon: React.ReactNode
  text: string
  href?: string
  isActive: boolean
  onHover: (text: string | null) => void
  isHovered: boolean
  onClick?: () => void
}

const DockItem = ({ icon, text, href, isActive, onHover, isHovered, onClick }: DockItemProps) => {
  const content = (
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
  )

  return (
    <div className="relative group" onMouseEnter={() => onHover(text)} onMouseLeave={() => onHover(null)}>
      {onClick ? (
        <button onClick={onClick} className="w-full">
          {content}
        </button>
      ) : (
        <Link href={href || "#"}>{content}</Link>
      )}
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
    </div>
  )
}

interface CrawlerFormProps {
  onClose: () => void
}

const CrawlerForm = ({ onClose }: CrawlerFormProps) => {
  const [url, setUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const normalizeUrl = (input: string) => {
    let normalized = input.trim()
    if (!normalized.startsWith("http://") && !normalized.startsWith("https://")) {
      normalized = "https://" + normalized
    } else if (normalized.startsWith("http://")) {
      normalized = normalized.replace("http://", "https://")
    }
    return normalized
  }
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://acm.today:8080"

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!url) return
    setIsSubmitting(true)
    const normalizedUrl = normalizeUrl(url)
    try {
      const res = await fetch(`${backendUrl}/crawler/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: normalizedUrl }),
      })
      if (!res.ok) {
        throw new Error("Failed to submit URL for crawling")
      }
      const data = await res.json()
      toast.success(
        <div>
          <p>{data.message}</p>
        </div>,
      )
      setUrl("")
      onClose()
    } catch (error) {
      console.error("Error submitting URL:", error)
      toast.error("Error submitting URL for crawling")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold text-[#E0E1DD] mb-4">Submit URL for Crawling</h2>
      <form onSubmit={handleSubmit} className="w-full">
        <Input
          type="text"
          placeholder="Enter URL (e.g. example.com)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="mb-4 bg-[#415A77] text-[#E0E1DD] border-[#778DA9] focus:ring-2 focus:ring-[#778DA9] placeholder-[#E0E1DD]/50"
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#415A77] text-[#E0E1DD] hover:bg-[#778DA9] transition-colors duration-300"
        >
          {isSubmitting ? "Submitting..." : "Submit URL"}
        </Button>
      </form>
    </div>
  )
}

export default FloatingDock

