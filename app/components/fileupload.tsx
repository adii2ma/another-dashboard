"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Upload } from 'lucide-react'
import { useSession } from "next-auth/react"

export default function FileUpload() {
  const { data: session } = useSession()
  const [file, setFile] = useState<File | null>(null)
  const [description, setDescription] = useState("")
  const [name, setName] = useState("")
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      setName(selectedFile.name.replace(/\.[^/.]+$/, ""))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    const userEmail = session?.user?.email
    if (!userEmail) {
      setMessage("User not authenticated. Please sign in.")
      return
    }

    setUploading(true)
    setMessage("")

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("user_email", userEmail)
      formData.append("name", name)
      formData.append("description", description)

      const response = await fetch("https://acm.today:8080/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Upload failed")

      const data = await response.json()
      setMessage(`Upload successful! Video ID: ${data.id}`)
    } catch (error) {
      console.error("Upload error:", error)
      setMessage("Upload failed. Please try again.")
    } finally {
      setUploading(false)
      setFile(null)
      setDescription("")
      setName("")
    }
  }

  return (
    <div className="bg-[#778DA9] rounded-lg p-8 w-[28rem] md:w-[34rem] lg:w-[40rem] max-h-[90vh] overflow-y-auto shadow-xl border border-[#E0E1DD]/30 relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#415A77] via-[#E0E1DD] to-[#415A77]" />
      
      <h2 className="text-2xl font-bold text-[#0D1B2A] mb-6 flex items-center">
        <Upload className="mr-3 h-6 w-6 text-[#1B263B]" />
        Upload Your Content
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <input type="file" accept="video/*,image/*" onChange={handleFileChange} className="hidden" id="file-upload" />
          <label
            htmlFor="file-upload"
            className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-[#415A77] rounded-lg text-sm font-medium text-[#1B263B] hover:border-[#0D1B2A] hover:bg-[#E0E1DD]/10 transition-all duration-300 cursor-pointer group"
          >
            {file ? (
              <span className="text-[#0D1B2A] group-hover:text-[#1B263B]">{file.name}</span>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <Upload className="h-8 w-8 text-[#1B263B] group-hover:text-[#0D1B2A] transition-colors" />
                <span className="text-[#1B263B] group-hover:text-[#0D1B2A] transition-colors">
                  Choose a file to upload
                </span>
              </div>
            )}
          </label>
        </div>

        {file && (
          <div className="space-y-2">
            <label htmlFor="name" className="block text-[#0D1B2A] text-sm font-medium">
              Video Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 text-[#0D1B2A] bg-[#E0E1DD] rounded-lg border border-[#415A77] focus:outline-none focus:ring-2 focus:ring-[#1B263B] transition-all placeholder-[#1B263B]/50"
            />
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="description" className="block text-[#0D1B2A] text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter file description for best results!"
            className="w-full px-4 py-3 text-[#0D1B2A] bg-[#E0E1DD] rounded-lg border border-[#415A77] focus:outline-none focus:ring-2 focus:ring-[#1B263B] transition-all placeholder-[#1B263B]/50"
            rows={4}
          />
        </div>

        <motion.button
          type="submit"
          disabled={uploading || !file}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full px-6 py-3 text-[#E0E1DD] font-semibold rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-[#1B263B] focus:ring-opacity-50 transition-all ${
            uploading || !file
              ? "bg-[#415A77]/50 cursor-not-allowed"
              : "bg-[#415A77] hover:bg-[#1B263B] hover:shadow-[#0D1B2A]/20"
          }`}
        >
          {uploading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#E0E1DD]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </span>
          ) : (
            "Upload and Protect"
          )}
        </motion.button>
      </form>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`mt-6 p-4 text-sm rounded-lg border ${
            message.includes("successful")
              ? "bg-[#415A77]/20 text-[#0D1B2A] border-[#1B263B]/30"
              : "bg-red-500/20 text-red-100 border-red-500/30"
          }`}
        >
          {message}
        </motion.div>
      )}
    </div>
  )
}
