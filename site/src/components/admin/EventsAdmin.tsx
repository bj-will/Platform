import { useEffect, useState } from "preact/hooks";
import { fetchProjects, fetchEvents, createEvent, updateEvent } from "../../api/client";
import EventCard from "./EventCard";
import EventModal from "./EventModal";

export default function EventsAdmin({ token }) {
  const [events, setEvents] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [form, setForm] = useState({});
  const [selectedProjectId, setSelectedProjectId] = useState("");

  // Load projects once
  useEffect(() => {
    async function loadProjects() {
      const prjs = await fetchProjects(token);
      prjs.sort((a, b) =>
        a.isPrimary ? -1 : b.isPrimary ? 1 : a.added ? -1 : b.added ? 1 : 0
      );
      setProjects(prjs);

      // set default project if none selected
      if (!selectedProjectId) {
        const defaultId = prjs.find((p) => p.isPrimary)?.id || "";
        setSelectedProjectId(String(defaultId));
      }
    }
    loadProjects();
  }, [token]);

  // Load events when project changes
  useEffect(() => {
    async function loadEvents() {
      if (!selectedProjectId) {
        setEvents([]);
        return;
      }
      const evs = await fetchEvents(selectedProjectId, token);
      setEvents(evs);
    }
    loadEvents();
  }, [selectedProjectId, token]);

  function openNewEvent() {
    setForm({ title: "", projectId: selectedProjectId });
    setSelectedEvent(null);
    setShowDialog(true);
  }

  function openEditEvent(ev) {
    setForm({ ...ev, projectId: ev.projectId });
    setSelectedEvent(ev);
    setShowDialog(true);
  }

  async function saveEvent() {
    if (selectedEvent) {
      await updateEvent(
        selectedEvent.id,
        { ...form, projectId: Number(form.projectId) },
        token
      );
    } else {
      await createEvent(
        { ...form, projectId: Number(form.projectId) },
        token
      );
    }
    setShowDialog(false);
    // reload events after save
    const evs = await fetchEvents(selectedProjectId, token);
    setEvents(evs);
  }

  const filteredEvents = events.filter((ev) => {
    const project = projects.find((p) => p.id === ev.projectId);
    if (!project?.added) return false;
    if (selectedProjectId && String(ev.projectId) !== selectedProjectId)
      return false;
    return true;
  });

  return (
    <div class="mt-3">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5>Events</h5>
        <button class="btn btn-primary" onClick={openNewEvent}>
          Add Event
        </button>
      </div>

      {/* Filter dropdown */}
      <div class="mb-3">
        <select
          class="form-select w-auto"
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(e.target.value)}
        >
          {projects
            .filter((p) => p.added)
            .sort((a, b) =>
              a.isPrimary === b.isPrimary ? 0 : a.isPrimary ? -1 : 1
            )
            .map((p) => (
              <option key={p.id} value={p.id}>
                {p.isPrimary ? "★ " : ""}
                {p.name}
              </option>
            ))}
        </select>
      </div>

      {/* Event cards */}
      <div class="row g-3">
        {filteredEvents.map((ev) => (
          <div class="col-sm-6 col-md-4 col-lg-3" key={ev.id}>
            <EventCard
              event={ev}
              projects={projects}
              onEdit={() => openEditEvent(ev)}
            />
          </div>
        ))}
      </div>

      {showDialog && (
        <EventModal
          form={form}
          setForm={setForm}
          projects={projects}
          selectedEvent={selectedEvent}
          onClose={() => setShowDialog(false)}
          onSave={saveEvent}
        />
      )}
    </div>
  );
}
