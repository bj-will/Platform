export default function EventCard({ event, projects, onEdit }) {
  const project = projects.find(p => p.id === event.projectId)
  const relatedProject = projects.find(p => p.id === event.relatedProjectId)

  return (
    <div class="card card-sm card-compact shadow-sm" onClick={onEdit}>
      <div class="card-body d-flex flex-column gap-1">
        <div class="d-flex align-items-center gap-2">
          <div class="fw-bold flex-grow-1">{event.title}</div>
          {relatedProject && (
            <img
              src={`projects/logo/${relatedProject.slug}_logo.png`}
              class="rounded-circle border border-1"
              style={{ width: "30px", height: "30px", objectFit: "cover" }}
              title={relatedProject.name}
            />
          )}
        </div>

        <div class="d-flex flex-wrap gap-2 align-items-center mt-1" style={{ fontSize: "0.8rem" }}>
          {event.status && <span class="badge bg-black text-white">{event.status}</span>}
          {event.rating != null && <span class="badge bg-warning text-black">⭐ {event.rating}</span>}
          {event.categories?.length > 0 && <span class="badge bg-info text-white">{event.categories.join(", ")}</span>}
          {event.types?.length > 0 && <span class="badge bg-primary text-white">{event.types.join(", ")}</span>}
          <span class="text-muted">{new Date(event.date).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  )
}
