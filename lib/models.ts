import { z } from "zod";

export const profileSchema = z.object({
  id: z.number(),
  is_following: z.boolean(),
  social_media_links: z.any().optional(),
  name: z.string(),
  description: z.string(),
  logo_url: z.string(),
  contact_phone: z.string(),
  website_url: z.string().url(),
  verification_id: z.string().nullable(),
  verification_status: z.enum(["approved", "pending", "denied"]),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  user: z.number()
});

export const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  role: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  is_active: z.boolean(),
  date_joined: z.string().datetime(),
  username: z.string(),
  profile: profileSchema.optional()
});

export const userArraySchema = z.array(userSchema);

export type Profile = z.infer<typeof profileSchema>;
export type User = z.infer<typeof userSchema>; 