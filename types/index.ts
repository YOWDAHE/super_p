export interface User {
  id: number
  email: string
  role: string
  first_name: string
  last_name: string
  is_active: boolean
  date_joined: string
  username: string
  profile?: Profile
}

export interface Profile {
  id: number
  is_following: boolean
  social_media_links?: any
  name: string
  description: string
  logo_url: string
  contact_phone: string
  website_url: string
  verification_id: string | null
  verification_status: "pending" | "approved" | "denied"
  created_at: string
  updated_at: string
  user: number
}

export interface AdminUser {
  id: number
  username: string
  password_hash: string
  created_at: string
}
