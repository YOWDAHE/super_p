"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Building2, Search, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { User } from "@/types"
import { fetchOrganizations } from "@/lib/api"

export default function ApprovedOrganizationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [organizations, setOrganizations] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getOrganizations = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch organizations from our API
        const orgs = await fetchOrganizations()
        
        // Filter to get only approved organizations
        const approvedOrgs = orgs.filter(org => org.profile?.verification_status === "approved")
        
        setOrganizations(approvedOrgs)
      } catch (err) {
        console.error("Error fetching organizations:", err)
        setError("Failed to load approved organizations. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    getOrganizations()
  }, [])

  const filteredOrganizations = organizations.filter(
    (org) =>
      org.profile?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${org.first_name} ${org.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Approved Organizations</h1>
          <p className="text-muted-foreground">View and manage verified organizations using Pulcity</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search approved organizations..."
              className="w-full pl-8 md:w-[250px] lg:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Approved Organizations</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{organizations.length}</div>
          <p className="text-xs text-muted-foreground">Verified and approved organizations</p>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Verified Organizations</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <p>Loading organizations...</p>
            </div>
          ) : error ? (
            <div className="flex justify-center py-8 text-red-500">
              <p>{error}</p>
            </div>
          ) : (
            <div className="w-full overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Joined on</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrganizations.length > 0 ? (
                    filteredOrganizations.map((org) => (
                      <TableRow key={org.id}>
                        <TableCell className="font-medium">{org.profile?.name || "N/A"}</TableCell>
                        <TableCell>{org.email}</TableCell>
                        <TableCell>{org.profile?.contact_phone || "N/A"}</TableCell>
                        <TableCell>
                          {org.profile?.created_at 
                            ? new Date(org.profile.created_at).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "N/A"
                          }
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            Approved
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        {loading ? "Loading..." : "No approved organizations found"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 