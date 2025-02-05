"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Upload, FileVideo, AlertTriangle, ChevronRight, Search, Frown } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog"

interface VideoUpload {
  id: number
  user_email: string
  filename: string
  title: string
  description: string
  fingerprint: string
  created_at: string
}

export default function Dashboard() {
  const { data: session } = useSession()
  const [uploads, setUploads] = useState<VideoUpload[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUpload, setSelectedUpload] = useState<VideoUpload | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUploads = async () => {
      if (!session?.user?.email) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const baseUrl = "http://4.240.103.202:8080/dashboard/videos/"
        const fullUrl = baseUrl + session.user.email

        const res = await fetch(fullUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!res.ok) {
          throw new Error("Failed to fetch uploads")
        }

        const data: VideoUpload[] = await res.json()
        setUploads(data || [])
        setError(null)
      } catch (err) {
        console.error("Error fetching uploads:", err)
        setError(err instanceof Error ? err.message : "An unknown error occurred")
        setUploads([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchUploads()
  }, [session])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  const filteredUploads = uploads.filter((upload) => upload.title.toLowerCase().includes(searchTerm.toLowerCase()))

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D1B2A] flex items-center justify-center">
        <div className="text-[#E0E1DD] text-2xl">Loading your uploads...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0D1B2A] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#1B263B] rounded-lg p-6 mb-6 shadow-lg border border-[#415A77]/30">
          <h1 className="text-3xl font-bold text-[#E0E1DD] mb-2">
            {getGreeting()}, {session?.user?.name?.split(" ")[0] || "User"}!
          </h1>
          <p className="text-lg text-[#415A77]">Welcome to your Marine Dashboard</p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <Link href="/dashboard/upload">
            <Button className="bg-[#415A77] text-[#E0E1DD] hover:bg-[#778DA9] transition-colors duration-300">
              <Upload className="mr-2 h-4 w-4" /> Upload New Content
            </Button>
          </Link>
          <div className="relative w-64">
            <Input
              type="text"
              placeholder="Search uploads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#1B263B] text-[#E0E1DD] border-[#415A77] focus:ring-2 focus:ring-[#778DA9] placeholder-[#778DA9]"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#778DA9]" />
          </div>
        </div>

        {error && (
          <Card className="bg-[#1B263B] border-red-500/30 text-center p-6">
            <CardContent>
              <AlertTriangle className="mx-auto text-red-400 h-16 w-16 mb-4" />
              <h2 className="text-2xl font-bold text-[#E0E1DD] mb-2">Error Fetching Uploads</h2>
              <p className="text-[#778DA9] mb-4">{error}</p>
            </CardContent>
          </Card>
        )}

        <div className="h-[calc(100vh-300px)] overflow-y-auto">
          {uploads.length === 0 && !error ? (
            <Card className="bg-[#1B263B] border-[#415A77]/30 text-center p-6">
              <CardContent>
                <Frown className="mx-auto text-[#778DA9] h-16 w-16 mb-4" />
                <h2 className="text-2xl font-bold text-[#E0E1DD] mb-2">No uploads yet</h2>
                <p className="text-[#778DA9] mb-4">Start by uploading your first piece of content!</p>
                <Link href="/dashboard/upload">
                  <Button className="bg-[#415A77] text-[#E0E1DD] hover:bg-[#778DA9] transition-colors duration-300">
                    <Upload className="mr-2 h-4 w-4" /> Upload New Content
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : filteredUploads.length === 0 ? (
            <Card className="bg-[#1B263B] border-[#415A77]/30 text-center p-6">
              <CardContent>
                <Search className="mx-auto text-[#778DA9] h-16 w-16 mb-4" />
                <h2 className="text-2xl font-bold text-[#E0E1DD] mb-2">No results found</h2>
                <p className="text-[#778DA9]">Try adjusting your search term</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUploads.map((upload) => (
                <Card
                  key={upload.id}
                  className="bg-[#1B263B] border-[#415A77]/30 hover:bg-[#415A77]/10 transition-all duration-300"
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-[#E0E1DD] text-lg flex items-center">
                      <FileVideo className="mr-2 text-[#778DA9]" />
                      {upload.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <CardDescription className="text-[#778DA9] text-xs">
                      Uploaded on {new Date(upload.created_at).toLocaleDateString()}
                    </CardDescription>
                    <p className="text-[#778DA9] text-sm mt-2">{upload.description || "No description provided."}</p>
                  </CardContent>
                  <CardFooter>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full text-[#E0E1DD] border-[#415A77] hover:bg-[#415A77] hover:text-[#E0E1DD] transition-colors duration-300"
                        >
                          View Details <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-[#1B263B] border-[#415A77]/30">
                        <DialogHeader>
                          <DialogTitle className="text-[#E0E1DD]">{upload.title}</DialogTitle>
                          <DialogDescription className="text-[#778DA9]">
                            Uploaded on {new Date(upload.created_at).toLocaleString()}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="text-[#778DA9]">
                          <p className="mb-2">
                            <strong className="text-[#E0E1DD]">Filename:</strong> {upload.filename}
                          </p>
                          <p className="mb-2">
                            <strong className="text-[#E0E1DD]">Description:</strong> {upload.description || "N/A"}
                          </p>
                          <p className="mb-2">
                            <strong className="text-[#E0E1DD]">Fingerprint:</strong> {upload.fingerprint}
                          </p>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

