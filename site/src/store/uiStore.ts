import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Id } from '../types/api'

type Priority = 'low'|'normal'|'high'

interface UIState {
  // UI
  selectedProjectId: Id | null
  darkMode: boolean
  filters: {
    search: string
    status: string[]    // multi-select
    tag: string[]       // categories
  }

  // per-user event state
  completions: Record<string, { completed: boolean; priority: Priority }>
  user: User | null

  // actions
  selectProject: (id: Id|null) => void
  setFilters: (f: Partial<UIState['filters']>) => void
  toggleDarkMode: () => void

  toggleComplete: (eventId: Id) => void
  setPriority: (eventId: Id, p: Priority) => void
  isComplete: (eventId: Id) => boolean
  getPriority: (eventId: Id) => Priority | null
}

export const useUIStore = create<UIState>()(persist((set, get) => ({
  selectedProjectId: null,
  projects: [],
  darkMode: false,
  filters: { search: '', status: [], tag: [], sort: "date_desc" },
  completions: {},
  user: null,

  selectProject(id) { set({ selectedProjectId: id }) },

  setFilters(f) { set(state => ({ filters: { ...state.filters, ...f } })) },

  toggleDarkMode() {
    set(state => {
      const next = !state.darkMode
      if (next) {
          document.body.classList.remove("theme-light");
          document.body.classList.add("theme-dark");
          document.body.setAttribute('data-bs-theme', 'dark');
      } else {
          document.body.classList.remove("theme-dark");
          document.body.classList.add("theme-light");
          document.body.setAttribute('data-bs-theme', 'light');
      }
      return { darkMode: next }
    })
  },

  toggleComplete(eventId) {
    const key = String(eventId)
    const curr = get().completions[key] || { completed: false, priority: 'normal' as const }
    const next = { ...curr, completed: !curr.completed }
    set(state => ({ completions: { ...state.completions, [key]: next } }))
  },

  setPriority(eventId, p) {
    const key = String(eventId)
    const curr = get().completions[key] || { completed: false, priority: 'normal' as const }
    const next = { ...curr, priority: p }
    set(state => ({ completions: { ...state.completions, [key]: next } }))
  },

  isComplete(eventId) { return !!get().completions[String(eventId)]?.completed },
  getPriority(eventId) { return get().completions[String(eventId)]?.priority ?? null },
}), { name: 'ui-store' }))
