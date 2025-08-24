import { useEffect, useState } from "preact/hooks"
import { fetchProjects, createProject, updateProject } from "../../api/client"
import ProjectCard from "./ProjectCard"
import ProjectModal from "./ProjectModal"

export default function ProjectsAdmin({ token }) {
  const [projects, setProjects] = useState([])
  const [filteredProjects, setFilteredProjects] = useState([])
  const [filterText, setFilterText] = useState("")

  const [selectedProject, setSelectedProject] = useState(null)
  const [showDialog, setShowDialog] = useState(false)
  const [form, setForm] = useState({ name: "", slug: "", twitter: "", discord: "", site: "" })

  async function load() {
    const data = await fetchProjects(token)
    data.sort((a, b) => {
      if (a.isPrimary && !b.isPrimary) return -1
      if (!a.isPrimary && b.isPrimary) return 1
      if (a.added && !b.added) return -1
      if (!a.added && b.added) return 1
      return 0
    })
    setProjects(data)
    setFilteredProjects(data)
  }

  useEffect(() => { load() }, [])

  function handleFilterChange(text) {
    setFilterText(text)
    if (!text) {
      setFilteredProjects(projects)
    } else {
      const filtered = projects.filter(p =>
        p.name.toLowerCase().includes(text.toLowerCase())
      )
      setFilteredProjects(filtered)
    }
  }

  function resetFilter() {
    setFilterText("")
    setFilteredProjects(projects)
  }

  function openNewProject() {
    setForm({ name: "", slug: "", twitter: "", discord: "", site: "" })
    setSelectedProject(null)
    setShowDialog(true)
  }

  function openEditProject(p) {
    setForm({
      name: p.name,
      slug: p.slug,
      twitter: p.twitter || "",
      discord: p.discord || "",
      site: p.site || ""
    })
    setSelectedProject(p)
    setShowDialog(true)
  }

  async function saveProject() {
    if (selectedProject) {
      await updateProject(selectedProject.id, form, token)
    } else {
      await createProject(form, token)
    }
    setShowDialog(false)
    load()
  }

  return (
    <div class="mt-3">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5>Projects</h5>
        <button class="btn btn-primary" onClick={openNewProject}>Add Project</button>
      </div>

      {/* Filter input + reset */}
      <div class="d-flex gap-2 mb-3">
        <input
          type="text"
          class="form-control"
          placeholder="Filter by name"
          value={filterText}
          onInput={e => handleFilterChange(e.currentTarget.value)}
        />
        <button class="btn btn-secondary" onClick={resetFilter}>Reset</button>
      </div>

      {/* Grid of project cards */}
      <div class="row g-3">
        {filteredProjects.map(p => (
          <div class="col-sm-6 col-md-4 col-lg-3" key={p.id}>
            <ProjectCard project={p} onClick={() => openEditProject(p)} />
          </div>
        ))}
      </div>

      {showDialog && (
        <ProjectModal
          form={form}
          setForm={setForm}
          selectedProject={selectedProject}
          onClose={() => setShowDialog(false)}
          onSave={saveProject}
        />
      )}
    </div>
  )
}
