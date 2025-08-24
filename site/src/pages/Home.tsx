import { h } from 'preact'
import { useEffect, useMemo, useState } from 'preact/hooks'
import Header from '../components/common/Header'
import ProjectsSidebar from '../components/user/ProjectsSidebar'
import FilterSidebar from '../components/user/FilterSidebar'
import EventsGrid from '../components/user/EventsGrid'
import Footer from '../components/common/Footer'
import { fetchProjects, fetchEvents } from '../api/client'
import type { Project, EventItem } from '../types/api'
import { useUIStore } from '../store/uiStore'

export default function Home(){
  const selectedProjectId = useUIStore(s => s.selectedProjectId)
  const selectProject = useUIStore(s => s.selectProject)

  const [projects, setProjects] = useState<Project[]>([])
  const [eventsByProject, setEventsByProject] = useState<Record<string, EventItem[]>>({})
  const [loading, setLoading] = useState({ projects: true, events: false })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        setLoading(p => ({ ...p, projects: true }))
        const ps = await fetchProjects()
        if (!alive) return
        setProjects(ps)
        if (ps.length && !selectedProjectId) {
          const primary = ps.find(p => p.is_primary)
          selectProject(primary ? primary.id : ps[0].id)
        }
      } catch (e: any) {
        setError(e?.message || 'Failed to load projects')
      } finally {
        if (alive) setLoading(p => ({ ...p, projects: false }))
      }
    })()
    return () => { alive = false }
  // run once + when selectedProjectId not set yet
  }, [])

  // Load events when project changes and not cached
  useEffect(() => {
    let alive = true
    const pid = selectedProjectId ?? projects[0]?.id
    if (!pid) return
    const key = String(pid)
    if (eventsByProject[key]) return

    setLoading(p => ({ ...p, events: true }))
    fetchEvents(pid)
      .then(evts => { if (alive) setEventsByProject(s => ({ ...s, [key]: evts })) })
      .catch(e => { if (alive) setError(e?.message || 'Failed to load events') })
      .finally(() => { if (alive) setLoading(p => ({ ...p, events: false })) })

    return () => { alive = false }
  }, [selectedProjectId, projects])

  const currentProject = useMemo(() => {
    return (
      projects.find(p => String(p.id) === String(selectedProjectId)) ||
      projects.find(p => p.is_primary) ||
      projects[0]
    )
  }, [projects, selectedProjectId])
  const currentEvents = currentProject ? eventsByProject[String(currentProject.id)] || [] : []
  const categories = [...new Set(currentEvents.flatMap(event => event.categories))]

  return (
    <div class="d-flex flex-column min-vh-100">
      <Header />

      <main class="container-fluid my-4 flex-grow-1">
        {error && <div class="alert alert-danger">{error}</div>}

        <div class="row g-3">
          {/* Project Sidebar */}
          <div class="col-12 col-lg-auto">
            <ProjectsSidebar projects={projects} />
          </div>

          {/* Filter Sidebar */}
          <div class="col-12 col-lg-3 col-xl-2">
            <FilterSidebar categories={categories} />
          </div>

          {/* Events Grid */}
          <div class="col-12 col-lg flex-grow-1">
            {(loading.projects || loading.events) && (
              <div class="page-status">Loading…</div>
            )}
            {currentProject ? (
              <EventsGrid projects={projects} events={currentEvents} />
            ) : (
              !loading.projects && <div class="page-status">No projects yet.</div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
