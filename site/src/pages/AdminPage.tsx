import { useState } from "preact/hooks";
import AdminLogin from "../components/admin/AdminLogin";
import ProjectsAdmin from "../components/admin/ProjectsAdmin";
import EventsAdmin from "../components/admin/EventsAdmin";

export default function AdminPage() {
  const [token, setToken] = useState(localStorage.getItem("token"))
  const [activeTab, setActiveTab] = useState<'projects' | 'events'>('projects')

  if (!token) {
    return <AdminLogin onLogin={(t) => { localStorage.setItem("token", t); setToken(t); }} />
  }

  return (
    <div class="container my-4">
      <h3>Admin Dashboard</h3>
      <ul class="nav nav-tabs admin-tabs">
        <li class="nav-item">
          <button
            class={`nav-link ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            Projects
          </button>
        </li>
        <li class="nav-item">
          <button
            class={`nav-link ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            Events
          </button>
        </li>
      </ul>

      <div class="tab-content mt-3">
        {activeTab === 'projects' && <ProjectsAdmin token={token} />}
        {activeTab === 'events' && <EventsAdmin token={token} />}
      </div>
    </div>
  )
}
