"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { 
  Plus,
  X,
  Check,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Badge } from "../../components/ui/badge"

interface SiteList {
  whitelisted: string[]
  blacklisted: string[]
}

export default function Settings() {
  const { data: session } = useSession()
  const [whitelistInput, setWhitelistInput] = useState("")
  const [blacklistInput, setBlacklistInput] = useState("")
  const [sites, setSites] = useState<SiteList>({
    whitelisted: [],
    blacklisted: []
  })

  const addToList = (site: string, list: 'whitelisted' | 'blacklisted') => {
    if (!site.trim()) return

    // Update local state directly
    setSites(prev => ({
      ...prev,
      [list]: [...prev[list], site.trim()]
    }))

    // Clear input
    if (list === 'whitelisted') {
      setWhitelistInput("")
    } else {
      setBlacklistInput("")
    }

    // Show temporary success message (optional)
    console.log(`Site "${site}" added to ${list}`)
  }

  const removeFromList = (site: string, list: 'whitelisted' | 'blacklisted') => {
    setSites(prev => ({
      ...prev,
      [list]: prev[list].filter(s => s !== site)
    }))
  }

  return (
    <div className="min-h-screen bg-[#005f63] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#008a90] rounded-lg p-6 mb-6 shadow-lg border border-[#00d1c1]/30">
          <h1 className="text-3xl font-bold text-[#00d1c1] mb-2">Site Settings</h1>
          <p className="text-lg text-[#00b8d4]">Manage your whitelisted and blacklisted sites</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Whitelist Section */}
          <Card className="bg-[#005f63] border-[#00d1c1]/50">
            <CardHeader>
              <CardTitle className="text-[#00d1c1]">Whitelisted Sites</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Input
                  type="text"
                  placeholder="Enter site URL..."
                  value={whitelistInput}
                  onChange={(e) => setWhitelistInput(e.target.value)}
                  className="bg-[#008a90] text-white border-[#00d1c1] placeholder-[#00a9b0]/70"
                />
                <Button
                  onClick={() => addToList(whitelistInput, 'whitelisted')}
                  className="bg-[#00b8d4] hover:bg-[#00a9b0] text-white"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {sites.whitelisted.map((site) => (
                  <Badge
                    key={site}
                    className="w-full justify-between bg-[#008a90] text-[#00d1c1] hover:bg-[#008a90]"
                  >
                    <span className="flex items-center">
                      <Check className="h-4 w-4 mr-2" />
                      {site}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromList(site, 'whitelisted')}
                      className="h-4 w-4 p-0 hover:bg-transparent"
                    >
                      <X className="h-4 w-4 text-[#00d1c1]" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Blacklist Section */}
          <Card className="bg-[#005f63] border-[#00d1c1]/50">
            <CardHeader>
              <CardTitle className="text-[#00d1c1]">Blacklisted Sites</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Input
                  type="text"
                  placeholder="Enter site URL..."
                  value={blacklistInput}
                  onChange={(e) => setBlacklistInput(e.target.value)}
                  className="bg-[#008a90] text-white border-[#00d1c1] placeholder-[#00a9b0]/70"
                />
                <Button
                  onClick={() => addToList(blacklistInput, 'blacklisted')}
                  className="bg-[#00b8d4] hover:bg-[#00a9b0] text-white"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {sites.blacklisted.map((site) => (
                  <Badge
                    key={site}
                    className="w-full justify-between bg-[#008a90] text-[#00d1c1] hover:bg-[#008a90]"
                  >
                    <span className="flex items-center">
                      <X className="h-4 w-4 mr-2" />
                      {site}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromList(site, 'blacklisted')}
                      className="h-4 w-4 p-0 hover:bg-transparent"
                    >
                      <X className="h-4 w-4 text-[#00d1c1]" />
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