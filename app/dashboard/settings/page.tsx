"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Plus, X, Check, Settings } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Badge } from "../../components/ui/badge"

interface SiteList {
  whitelisted: string[]
  blacklisted: string[]
}

export default function Setting() {
  const { data: session } = useSession()
  const [whitelistInput, setWhitelistInput] = useState("")
  const [blacklistInput, setBlacklistInput] = useState("")
  const [sites, setSites] = useState<SiteList>({
    whitelisted: [],
    blacklisted: [],
  })

  const addToList = (site: string, list: "whitelisted" | "blacklisted") => {
    if (!site.trim()) return
    setSites((prev) => ({
      ...prev,
      [list]: [...prev[list], site.trim()],
    }))
    if (list === "whitelisted") {
      setWhitelistInput("")
    } else {
      setBlacklistInput("")
    }
  }

  const removeFromList = (site: string, list: "whitelisted" | "blacklisted") => {
    setSites((prev) => ({
      ...prev,
      [list]: prev[list].filter((s) => s !== site),
    }))
  }

  return (
    <div className="min-h-screen bg-[#0D1B2A] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#415A77] rounded-lg p-6 mb-6 shadow-lg border border-[#778DA9]/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#778DA9] via-[#E0E1DD] to-[#778DA9]" />
          
          <div className="flex items-center gap-3 mb-2">
            <Settings className="h-8 w-8 text-[#E0E1DD]" />
            <h1 className="text-3xl font-bold text-[#E0E1DD]">Site Settings</h1>
          </div>
          <p className="text-lg text-[#E0E1DD]">Manage your whitelisted and blacklisted sites</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Whitelist Section */}
          <Card className="bg-[#778DA9] border-[#E0E1DD]/30 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#E0E1DD]/50" />
            <CardHeader>
              <CardTitle className="text-[#0D1B2A] flex items-center gap-2">
                <Check className="h-5 w-5 text-[#1B263B]" />
                Whitelisted Sites
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Input
                  type="text"
                  placeholder="Enter site URL..."
                  value={whitelistInput}
                  onChange={(e) => setWhitelistInput(e.target.value)}
                  className="bg-[#E0E1DD] text-[#0D1B2A] border-[#415A77] focus:border-[#1B263B] placeholder-[#1B263B]/50"
                />
                <Button
                  onClick={() => addToList(whitelistInput, "whitelisted")}
                  className="bg-[#415A77] hover:bg-[#1B263B] text-[#E0E1DD] transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {sites.whitelisted.map((site) => (
                  <Badge
                    key={site}
                    className="w-full justify-between bg-[#E0E1DD] text-[#0D1B2A] hover:bg-[#E0E1DD]/80 border border-[#415A77]/20"
                  >
                    <span className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-[#1B263B]" />
                      {site}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromList(site, "whitelisted")}
                      className="h-4 w-4 p-0 hover:bg-transparent"
                    >
                      <X className="h-4 w-4 text-[#1B263B] hover:text-[#0D1B2A]" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Blacklist Section */}
          <Card className="bg-[#778DA9] border-[#E0E1DD]/30 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#E0E1DD]/50" />
            <CardHeader>
              <CardTitle className="text-[#0D1B2A] flex items-center gap-2">
                <X className="h-5 w-5 text-[#1B263B]" />
                Blacklisted Sites
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Input
                  type="text"
                  placeholder="Enter site URL..."
                  value={blacklistInput}
                  onChange={(e) => setBlacklistInput(e.target.value)}
                  className="bg-[#E0E1DD] text-[#0D1B2A] border-[#415A77] focus:border-[#1B263B] placeholder-[#1B263B]/50"
                />
                <Button
                  onClick={() => addToList(blacklistInput, "blacklisted")}
                  className="bg-[#415A77] hover:bg-[#1B263B] text-[#E0E1DD] transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {sites.blacklisted.map((site) => (
                  <Badge
                    key={site}
                    className="w-full justify-between bg-[#E0E1DD] text-[#0D1B2A] hover:bg-[#E0E1DD]/80 border border-[#415A77]/20"
                  >
                    <span className="flex items-center">
                      <X className="h-4 w-4 mr-2 text-[#1B263B]" />
                      {site}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromList(site, "blacklisted")}
                      className="h-4 w-4 p-0 hover:bg-transparent"
                    >
                      <X className="h-4 w-4 text-[#1B263B] hover:text-[#0D1B2A]" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
