
import { h } from 'preact'
import { useUIStore } from '../../store/uiStore'

export default function Footer(){
  const selected = useUIStore(s => s.selectedProjectId)
  const project = useUIStore(s => s.projects.find(p => p.id === selected) || null)

  return (
    <footer class="footer mt-4 border-top">
      <div class="container py-3 d-flex justify-content-between">
        <div>
          <strong>{project?.name || 'Project'}</strong>
          <div class="small text-muted">{project?.description}</div>
        </div>
        <div class="text-end small">
          {project?.links?.map(l => <a class="me-2" href={l} target="_blank">Link</a>)}
          <div class="text-muted">Contact: {project?.site || '—'}</div>
        </div>
      </div>
    </footer>
  )
}

