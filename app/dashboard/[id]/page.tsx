import { notFound } from "next/navigation"
import Image from "next/image"
import { CalendarIcon, Mail, Phone, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Mock data for a specific organization
const getOrganization = (id: string) => {
  const organizations = [
    {
      id: "1",
      name: "TechConf Events",
      email: "info@techconf.com",
      phone: "+1 (555) 123-4567",
      contactPerson: "John Smith",
      verifiedAt: "2023-10-15",
      eventsCount: 12,
      logo: "/placeholder.svg?height=200&width=200",
      description:
        "TechConf Events organizes technology conferences and workshops for developers and IT professionals.",
      address: "123 Tech Blvd, San Francisco, CA 94107",
      events: [
        { id: "e1", name: "DevCon 2023", date: "2023-12-10", attendees: 500, status: "Upcoming" },
        { id: "e2", name: "AI Summit", date: "2023-11-15", attendees: 350, status: "Completed" },
        { id: "e3", name: "Web Dev Workshop", date: "2024-01-20", attendees: 100, status: "Upcoming" },
      ],
    },
  ]

  return organizations.find((org) => org.id === id)
}

export default function OrganizationDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const organization = getOrganization(params.id)

  if (!organization) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{organization.name}</h1>
          <p className="text-muted-foreground">Organization details and events</p>
        </div>
        <Button variant="outline" asChild>
          <a href="/dashboard">Back to Organizations</a>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Organization Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <div className="relative h-32 w-32 overflow-hidden rounded-full">
                <Image
                  src={organization.logo || "/placeholder.svg"}
                  alt={organization.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{organization.contactPerson}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{organization.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{organization.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span>Verified on {organization.verifiedAt}</span>
              </div>
            </div>
            <div>
              <h3 className="mb-1 text-sm font-medium">Address</h3>
              <p className="text-sm text-muted-foreground">{organization.address}</p>
            </div>
            <div>
              <h3 className="mb-1 text-sm font-medium">About</h3>
              <p className="text-sm text-muted-foreground">{organization.description}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Events</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Attendees</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {organization.events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.name}</TableCell>
                    <TableCell>{event.date}</TableCell>
                    <TableCell>{event.attendees}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          event.status === "Upcoming" ? "bg-blue-50 text-blue-700" : "bg-green-50 text-green-700"
                        }
                      >
                        {event.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
