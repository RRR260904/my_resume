export interface Profile {
  id?: string;
  _id?: string;
  name: string;
  role: string;
  tagline?: string;
  bio?: string;
  profile_image?: string;
  resume_url?: string;
  location?: string;
  years_of_experience?: number;
  available_for_work?: boolean;
  email?: string;
  phone?: string;
  is_active: boolean;
}

export interface About {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  highlights?: string[];
  quote?: string;
  hobbies?: string[];
  avatar_secondary?: string;
  is_active: boolean;
}

export interface Skill {
  id?: string;
  _id?: string;
  name: string;
  category: string;
  proficiency: number;
  icon?: string;
  featured?: boolean;
  display_order: number;
  is_active: boolean;
}

export interface Experience {
  id?: string;
  _id?: string;
  company: string;
  role: string;
  period: string;
  start_date?: string;
  end_date?: string;
  is_current?: boolean;
  location?: string;
  description?: string;
  responsibilities?: string[];
  technologies?: string[];
  company_url?: string;
  display_order: number;
  is_active: boolean;
}

export interface Education {
  id?: string;
  _id?: string;
  institution: string;
  degree: string;
  field_of_study?: string;
  period?: string;
  start_year?: number;
  end_year?: number;
  grade?: string;
  activities?: string[];
  description?: string;
  display_order: number;
  is_active: boolean;
}

export interface Project {
  id?: string;
  _id?: string;
  title: string;
  slug: string;
  short_description: string;
  full_description?: string;
  thumbnail: string;
  gallery?: string[];
  technologies: string[];
  features?: string[];
  problem?: string;
  solution?: string;
  challenges?: string;
  github_url?: string;
  live_demo_url?: string;
  video_url?: string;
  category?: string;
  status?: string;
  featured: boolean;
  display_order: number;
  is_active: boolean;
}

export interface Certification {
  id?: string;
  _id?: string;
  title: string;
  issuer: string;
  issue_date?: string;
  expiry_date?: string;
  credential_id?: string;
  credential_url?: string;
  badge_image?: string;
  skills?: string[];
  display_order: number;
  is_active: boolean;
}

export interface Achievement {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  date?: string;
  metric?: string;
  organization?: string;
  link?: string;
  icon?: string;
  display_order: number;
  is_active: boolean;
}

export interface SocialLink {
  id?: string;
  _id?: string;
  platform: string;
  url: string;
  username?: string;
  display_order: number;
  is_active: boolean;
}

export interface ContactInfo {
  id?: string;
  _id?: string;
  email: string;
  phone?: string;
  location?: string;
  working_hours?: string;
  availability_note?: string;
  is_active: boolean;
}

export interface ContactMessage {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  created_at: string;
  is_read: boolean;
  is_replied: boolean;
}

export interface SiteSettings {
  id?: string;
  _id?: string;
  site_title?: string;
  meta_description?: string;
  og_image?: string;
  keywords?: string;
  enable_glow_effects?: boolean;
  theme_accent_color?: string;
  footer_text?: string;
  is_active: boolean;
}

export interface PortfolioData {
  profile: Profile | null;
  about: About | null;
  skills: Skill[];
  experiences: Experience[];
  education: Education[];
  projects: Project[];
  certifications: Certification[];
  achievements: Achievement[];
  social_links: SocialLink[];
  contact_info: ContactInfo | null;
  site_settings: SiteSettings | null;
}

export interface AdminStats {
  counts: Record<string, number>;
  unread_messages: number;
  database_type: string;
  connected: boolean;
}
