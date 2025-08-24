import type { Project, EventItem } from '../types/api'

const apiBase = import.meta.env.VITE_API_BASE;


export async function fetchProjects(token?: string) {
  const res = await fetch(`${apiBase}/projects`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined
  })
  if (!res.ok) throw new Error(`Failed to load projects: ${res.status}`)
  return res.json()
}

export async function createProject(data: { name: string; slug: string }, token: string) {
  const res = await fetch(`${apiBase}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error(`Failed to create project: ${res.status}`)
  return res.json()
}

export async function updateProject(id: number, form: dict, token: string) {
  const res = await fetch(`${apiBase}/projects/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) throw new Error(`Failed to delete project: ${res.status}`)
  return res.json()
}

export async function fetchEvents(projectId: string | number, token?: string) {
  const res = await fetch(`${apiBase}/events/${projectId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined
  })
  console.log(projectId)
  if (!res.ok) throw new Error(`Failed to load events: ${res.status}`)
  return res.json()
}

export async function createEvent(data: { title: string; projectId: number }, token: string) {
  const res = await fetch(`${apiBase}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error(`Failed to create event: ${res.status}`)
  return res.json()
}

export async function updateEvent(id: number, form: dict, token: string) {
  const res = await fetch(`${apiBase}/events/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) throw new Error(`Failed to delete event: ${res.status}`)
  return res.json()
}

