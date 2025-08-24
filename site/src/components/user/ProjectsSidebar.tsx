import { h } from 'preact'
import type { Project } from '../../types/api'
import { useUIStore } from '../../store/uiStore'
import ProjectLogo from "../ui/ProjectLogo";


interface Props {
  projects: Project[]
}

export default function ProjectsSidebar({ projects }: Props) {
  const selected = useUIStore(s => s.selectedProjectId)
  const select = useUIStore(s => s.selectProject)
  const setFilters = useUIStore(s => s.setFilters)


  const primaryProjects = projects.filter(p => p.isPrimary)
  const otherProjects = projects.filter(p => !p.isPrimary && p.added)

  const renderProject = (p: Project) => {
    const isActive = p.id === selected || (!selected && p.isPrimary)
    const logoUrl = `projects/logo/${p.slug}_logo.png`
    return (
      <button
        key={String(p.id)}
        class={`btn p-0 border-0 bg-transparent`}
        title={p.name}
        onClick={() => {
            select(p.id);
            setFilters({ search: '', status: [], tag: [] })
          }
        }
      >
        <ProjectLogo
          projectSlug={p.slug}
          size={60}
          className={`
            ${p.id === selected || (!selected && p.isPrimary)
              ? 'border border-2 border-primary'
              : 'border border-secondary-subtle'}
            overflow-hidden
          `}
        />
      </button>
    )
  }

  return (
    <div
      class="card sticky-top p-2"
    >
      <div
        class="card d-flex flex-lg-column flex-row gap-2 align-items-center rounded-3 p-2 shadow-sm"
      >
        {/* Primary */}
        {primaryProjects.map(renderProject)}

        {/* Separator (only for large screens) */}
        {primaryProjects.length > 0 && (
          <>
            <div class="d-none d-lg-block w-100">
              <hr class="my-2" />
            </div>
            <div class="d-lg-none vr align-self-stretch" />
          </>
        )}

        {/* Other projects */}
        {otherProjects.map(renderProject)}
      </div>
    </div>
  )
}
