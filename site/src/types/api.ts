export type Id = number | string

export interface Project {
  id: Id
  name: string
  slug: string
  description?: string
  twitter: string
  discord: string
  site: string
  added: boolean
}


export type EventStatus = 'live' | 'upcoming' | 'closed'

export interface EventItem {
  id: Id
  project_id: Id
  related_project_id: Id
  title: string
  banner: string | null
  description?: string | null
  status: EventStatus
  categories: string[] | null
  types: string[] | null
  news_link?: string | null
  rating?: number | null
  date?: string | null  // ISO string
}
