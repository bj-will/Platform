export default function EventModal({ form, setForm, projects, selectedEvent, onClose, onSave }) {
  return (
    <div class="modal-backdrop d-flex justify-content-center align-items-center">
      <div class="modal-dialog modal-sm">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{selectedEvent ? "Edit Event" : "Add Event"}</h5>
            <button type="button" class="btn-close" onClick={onClose}></button>
          </div>

          <div class="modal-body d-flex flex-column gap-2">
            {/* Project */}
            <FormRow label="Project:">
              <input
                  type="text"
                  className="form-control flex-grow-1"
                  value={projects.find(p => p.id === form.projectId)?.name || ''}
                  disabled
              />
            </FormRow>

            {/* Title */}
            <FormRow label="Title:">
              <input class="form-control flex-grow-1" value={form.title || ""} onChange={e => setForm({ ...form, title: e.target.value })} />
            </FormRow>


            {/* Related Project */}
            <FormRow label="Related:">
              <select class="form-select flex-grow-1" value={form.relatedProjectId || ""} onChange={e => setForm({ ...form, relatedProjectId: e.target.value || null })}>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </FormRow>

            {/* Status */}
            <FormRow label="Status:">
              <input class="form-control flex-grow-1" value={form.status || ""} onChange={e => setForm({ ...form, status: e.target.value })} />
            </FormRow>

            {/* Date */}
            <FormRow label="Date:">
              <input type="datetime-local" class="form-control flex-grow-1" value={form.date || ""} onChange={e => setForm({ ...form, date: e.target.value })} />
            </FormRow>

            {/* Categories */}
            <FormRow label="Categories:">
              <input class="form-control flex-grow-1" value={form.categories?.join(", ") || ""} onChange={e => setForm({ ...form, categories: e.target.value.split(",").map(s => s.trim()) })} />
            </FormRow>

            {/* Types */}
            <FormRow label="Types:">
              <input class="form-control flex-grow-1" value={form.types?.join(", ") || ""} onChange={e => setForm({ ...form, types: e.target.value.split(",").map(s => s.trim()) })} />
            </FormRow>

            {/* News Link */}
            <FormRow label="News Link:">
              <input class="form-control flex-grow-1" value={form.newsLink || ""} onChange={e => setForm({ ...form, newsLink: e.target.value })} />
            </FormRow>

            {/* Rating */}
            <FormRow label="Rating:">
              <select class="form-select flex-grow-1" value={form.rating || 0}
                      onChange={e => setForm({ ...form, rating: Number(e.target.value) })} >
                <option value={0}>☆☆☆☆☆</option>
                <option value={1}>★☆☆☆☆</option>
                <option value={2}>★★☆☆☆</option>
                <option value={3}>★★★☆☆</option>
                <option value={4}>★★★★☆</option>
                <option value={5}>★★★★★</option>
              </select>
            </FormRow>

            {/* Banner Pic */}
            <FormRow label="Banner Pic:">
              <input class="form-control flex-grow-1" value={form.bannerPic || ""} onChange={e => setForm({ ...form, bannerPic: e.target.value })} />
            </FormRow>

            {/* Description */}
            <FormRow label="Description:">
              <textarea class="form-control flex-grow-1" value={form.description || ""} onChange={e => setForm({ ...form, description: e.target.value })}></textarea>
            </FormRow>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary me-2" onClick={onClose}>Cancel</button>
            <button class="btn btn-primary" onClick={onSave}>Save</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function FormRow({ label, children }) {
  return (
    <div class="d-flex align-items-center gap-2">
      <label class="col-form-label" style={{ width: "90px" }}>{label}</label>
      {children}
    </div>
  )
}
