import { useState, useEffect } from "react"

interface BoxRevealProps {
  children: React.ReactNode
}

export const BoxReveal = ({ children }: BoxRevealProps) => {
  const [isRevealed, setIsRevealed] = useState(false)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsRevealed(true)
    }, 500) // Adjust delay as needed

    return () => clearTimeout(timeoutId)
  }, [])

  return <div className={`transition-opacity duration-500 ${isRevealed ? "opacity-100" : "opacity-0"}`}>{children}</div>
}

