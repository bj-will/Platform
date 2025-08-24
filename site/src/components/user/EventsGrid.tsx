import { h } from 'preact'
import type { EventItem, Project } from '../../types/api'
import { useUIStore } from '../../store/uiStore'
import EventCard from './EventCard'

export default function EventsGrid({ projects, events }: { projects: Project[], events: EventItem[] }) {
  const projectMap = new Map<number, Project>()
  projects.forEach(p => projectMap.set(p.id, p))
  console.log(events)

  const { search, status, tag, priority, hideCompleted, sort } = useUIStore(s => s.filters)
  const completions = useUIStore(s => s.completions)

  const completedIds = new Set(
    Object.entries(completions || {})
      .filter(([_, v]) => v.completed)
      .map(([id]) => Number(id))
  )
  console.log(completedIds)

  const text = (x: string | null | undefined) => (x || '').toLowerCase()
  const now = Date.now()

  const main = events.filter(e => !(e.categories || []).includes('bottom'))

  function toMs(d: string | Date | null | undefined): number {
    if (!d) return 0
    const t = typeof d === 'string' ? Date.parse(d) : d.getTime?.()
    return isNaN(t) ? 0 : t
  }

  // --- FILTERS ---
  const filteredMain = main
    .filter(e => status.length === 0 ? true : status.includes(e.status))
    .filter(e => tag.length === 0 ? true : (e.categories || []).some(t => tag.includes(t)))
    .filter(e => {
      if (!search) return true
      const blob = [e.title, e.description, ...(e.categories || [])].map(text).join(' ')
      return blob.includes(search.toLowerCase())
    })
    .filter(e => {
      if (priority == null) return true
      const p = e.rating ?? 0
      return p >= priority
    })
    .filter(e => {
      if (!hideCompleted) return true
      if (!completedIds) return true
      return Array.isArray(completedIds)
        ? !completedIds.includes(e.id as any)
        : !completedIds.has(e.id as any)
    })

  // --- SORTS ---
  const sortedMain = [...filteredMain].sort((a, b) => {
    const ad = toMs(a.date)
    const bd = toMs(b.date)

    // detect completion
    const aCompleted = completedIds
      ? (Array.isArray(completedIds) ? completedIds.includes(a.id as any) : completedIds.has(a.id as any))
      : false
    const bCompleted = completedIds
      ? (Array.isArray(completedIds) ? completedIds.includes(b.id as any) : completedIds.has(b.id as any))
      : false

    // completed always go last
    if (aCompleted !== bCompleted) return aCompleted ? 1 : -1

    switch (sort) {
      case 'priority_desc': return (b.rating ?? 0) - (a.rating ?? 0)
      case 'priority_asc':  return (a.rating ?? 0) - (b.rating ?? 0)
      case 'date_asc':      return ad - bd
      case 'date_desc':     return bd - ad
      case 'upcoming_first': {
        const af = ad >= now, bf = bd >= now
        if (af !== bf) return af ? -1 : 1
        return ad - bd
      }
      case 'past_first': {
        const ap = ad < now, bp = bd < now
        if (ap !== bp) return ap ? -1 : 1
        return bd - ad
      }
      default:
        return 0
    }

  })

  return (
    <div class="d-flex flex-column gap-4">
      <div class="row g-3 justify-content-start">
        {sortedMain.map(ev => {
        const project = projectMap.get(ev.projectId)!
        const relatedProject = projectMap.get(ev.relatedProjectId)
        return (
          <div
            class="col-sm-6 col-lg-4"
            style={{
              height: '100%',
              minWidth: '340px', // Prevents squeezing to three per row on wider breakpoints
            }}
            key={String(ev.id)}
          >
            <EventCard
              event={ev}
              project={project}
              relatedProject={relatedProject}
            />
          </div>
        )})}
        {sortedMain.length === 0 && (
          <div class="col-12 text-muted">Coming soon</div>
        )}
      </div>
    </div>
  )
}
