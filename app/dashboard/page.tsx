"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Upload, FileVideo, AlertTriangle, ChevronRight, Search, Frown, Globe } from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Badge } from "../components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog"

import FileUpload from "../components/fileupload"

interface ActiveMatch {
  crawled_video_id: number
  video_url: string
  similarity: number
}

interface VideoUpload {
  id: number
  user_email: string
  filename: string
  title: string
  description: string
  fingerprint: string
  flagged?: boolean
  active_matches?: ActiveMatch[]
  created_at: string
}

export default function Dashboard() {
  const { data: session } = useSession()
  const [uploads, setUploads] = useState<VideoUpload[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUpload, setSelectedUpload] = useState<VideoUpload | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showUploadModal, setShowUploadModal] = useState(false)

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://acm.today:8080"

  useEffect(() => {
    const fetchUploads = async () => {
      if (!session?.user?.email) {
        setIsLoading(false)
        return
      }
      try {
        setIsLoading(true)
        const baseUrl = `${backendUrl}/dashboard/videos/`
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
  }, [session, backendUrl])

  useEffect(() => {
    if (!session?.user?.email) return

    const sseUrl = `${backendUrl}/relay-sse?user_email=${encodeURIComponent(session.user.email)}`
    const eventSource = new EventSource(sseUrl)

    eventSource.onmessage = (e) => {
      toast.info(e.data)
    }

    eventSource.onerror = (e) => {
      console.error("SSE error", e)
      eventSource.close()
    }

    return () => {
      eventSource.close()
    }
  }, [session, backendUrl])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  const filteredUploads = uploads.filter((upload) =>
    upload.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const triggerCrawl = async (url: string) => {
    let normalizedUrl = url.trim()
    if (!normalizedUrl.startsWith("http://") && !normalizedUrl.startsWith("https://")) {
      normalizedUrl = "https://" + normalizedUrl
    } else if (normalizedUrl.startsWith("http://")) {
      normalizedUrl = normalizedUrl.replace("http://", "https://")
    }
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
      toast.success(data.message)
    } catch (error) {
      console.error(error)
      toast.error("Error submitting URL for crawling")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D1B2A] flex items-center justify-center">
        <div className="text-[#E0E1DD] text-2xl">Loading your uploads...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0D1B2A] p-6">
      <ToastContainer />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-[#1B263B] rounded-lg p-6 mb-6 shadow-lg border border-[#415A77]">
          <h1 className="text-3xl font-bold text-[#E0E1DD] mb-2">
            {getGreeting()}, {session?.user?.name?.split(" ")[0] || "User"}!
          </h1>
          <p className="text-lg text-[#778DA9]">Welcome to your Marine Dashboard</p>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center mb-6">
          <Button
            className="bg-[#415A77] text-[#E0E1DD] hover:bg-[#778DA9] transition-colors duration-300"
            onClick={() => setShowUploadModal(true)}
          >
            <Upload className="mr-2 h-4 w-4" /> Upload New Content
          </Button>
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

        {showUploadModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-[#1B263B] p-6 rounded-lg relative">
              <button
                onClick={() => setShowUploadModal(false)}
                className="absolute top-2 right-2 text-[#E0E1DD] text-xl"
              >
                &times;
              </button>
              <FileUpload />
            </div>
          </div>
        )}

        {error && (
          <Card className="bg-[#1B263B] border-red-500 text-center p-6 mb-4">
            <CardContent>
              <AlertTriangle className="mx-auto text-red-500 h-16 w-16 mb-4" />
              <h2 className="text-2xl font-bold text-[#E0E1DD] mb-2">Error Fetching Uploads</h2>
              <p className="text-[#778DA9] mb-4">{error}</p>
            </CardContent>
          </Card>
        )}

        {uploads.length === 0 && !error ? (
          <Card className="bg-[#1B263B] border-[#415A77] text-center p-6">
            <CardContent>
              <Frown className="mx-auto text-[#778DA9] h-16 w-16 mb-4" />
              <h2 className="text-2xl font-bold text-[#E0E1DD] mb-2">No uploads yet</h2>
              <p className="text-[#778DA9] mb-4">Start by uploading your first piece of content!</p>
              <Button
                className="bg-[#415A77] text-[#E0E1DD] hover:bg-[#778DA9] transition-colors duration-300"
                onClick={() => setShowUploadModal(true)}
              >
                <Upload className="mr-2 h-4 w-4" /> Upload New Content
              </Button>
            </CardContent>
          </Card>
        ) : filteredUploads.length === 0 ? (
          <Card className="bg-[#1B263B] border-[#415A77] text-center p-6">
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
                className="relative bg-[#1B263B] border-[#415A77] hover:bg-[#415A77] transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedUpload(upload)}
              >
                {upload.flagged && upload.active_matches?.length && upload.active_matches?.length > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      triggerCrawl(upload.active_matches?.[0]?.video_url || "")
                    }}
                    className="absolute top-2 left-2 p-1 bg-[#E0E1DD] bg-opacity-20 rounded-full hover:bg-opacity-40"
                  >
                    <Globe className="h-4 w-4 text-[#E0E1DD]" />
                  </button>
                )}
                <CardHeader className="pb-2 flex justify-between items-center">
                  <CardTitle className="text-[#E0E1DD] text-lg flex items-center">
                    <FileVideo className="mr-2 text-[#778DA9]" />
                    {upload.title}
                  </CardTitle>
                  {/* Badge based on flagged state */}
                  <Badge variant={upload.flagged ? "destructive" : "default"} className="text-xs">
                    {upload.flagged ? "Flagged" : "Clean"}
                  </Badge>
                </CardHeader>
                <CardContent className="pb-2">
                  <CardDescription className="text-[#778DA9] text-xs">
                    Uploaded on {new Date(upload.created_at).toLocaleDateString()}
                  </CardDescription>
                  <p className="text-[#E0E1DD] text-sm mt-2">
                    {upload.description || "No description provided."}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full text-[#E0E1DD] border-[#415A77] hover:bg-[#778DA9] hover:text-[#0D1B2A] transition-colors duration-300"
                      >
                        View Details <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#1B263B] border-[#415A77]">
                      <DialogHeader>
                        <DialogTitle className="text-[#E0E1DD]">{selectedUpload?.title}</DialogTitle>
                        <DialogDescription className="text-[#778DA9]">
                          Uploaded on {selectedUpload ? new Date(selectedUpload.created_at).toLocaleString() : ""}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="text-[#E0E1DD]">
                        <p className="mb-2">
                          <strong>Filename:</strong> {selectedUpload?.filename}
                        </p>
                        <p className="mb-2">
                          <strong>Description:</strong> {selectedUpload?.description || "N/A"}
                        </p>
                        <p className="mb-2">
                          <strong>Fingerprint:</strong> {selectedUpload?.fingerprint}
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
  )
}
