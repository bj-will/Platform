import { h } from 'preact'
import { useUIStore } from '../../store/uiStore'
import StarSelector from './StarSelector'
import './FilterSidebar'

const statusOpts = ['live','upcoming','closed', 'inactive']

const sortOpts = [
  { value: 'priority_desc', label: 'Priority: High First' },
  { value: 'priority_asc', label: 'Priority: Low First' },
  { value: 'date_desc', label: 'Date: Newest' },
  { value: 'date_asc', label: 'Date: Oldest' },
//   { value: 'upcoming_first', label: 'Upcoming Soon' },
//   { value: 'past_first', label: 'Ending Soon' },
]

const statusColors: Record<string, string> = {
  live: 'bg-success text-white',
  upcoming: 'bg-orange text-white',
  closed: 'bg-danger text-white',
  inactive: 'bg-black text-white'
}

interface Props {
  categories: string[]
  filteredCount: number
}

export default function FilterSidebar({ categories, filteredCount }: Props) {
  const filters = useUIStore(s => s.filters)
  const setFilters = useUIStore(s => s.setFilters)

  function toggle(list: string[], val: string) {
    const has = list.includes(val)
    return has ? list.filter(x => x !== val) : [...list, val]
  }

  return (
    <div class="card card-sm sticky-top">
      <div class="card-body">
        {/* Search */}
        <div class="mb-3">
          <div class="filter-label">Filters</div>
          <input
            class="form-control form-control-sm"
            placeholder="Search"
            value={filters.search}
            onInput={e => setFilters({ search: (e.target as HTMLInputElement).value })}
          />
        </div>

        {/* Sort */}
        <div class="mb-3">
          <div class="filter-label">Sort by</div>
          <select
            class="form-select form-select-sm"
            value={filters.sort}
            onChange={e =>
              setFilters({ sort: (e.target as HTMLSelectElement).value })
            }
          >
            {sortOpts.map(opt => (
              <option value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div class="mb-2">
          <div class="filter-label">Status</div>
          <div class="d-flex flex-wrap gap-1">
            {statusOpts.map(s => (
              <button
                key={s}
                class={`btn btn-sm ${filters.status.includes(s) ? `btn-primary ${statusColors[s]}` : 'btn-outline-secondary'}`}
                onClick={() => setFilters({ status: toggle(filters.status, s) })}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div class="mb-2">
          <div class="filter-label">Category</div>
          <div class="d-flex flex-wrap gap-1">
            {categories.map(t => (
              <button
                key={t}
                class={`btn btn-sm ${filters.tag.includes(t) ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setFilters({ tag: toggle(filters.tag, t) })}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Hide completed */}
        <div class="form-check form-switch mb-2">
          <input
            class="form-check-input"
            type="checkbox"
            checked={filters.hideCompleted}
            onChange={e => setFilters({ hideCompleted: e.currentTarget.checked })}
            id="hideCompleted"
          />
          <label class="form-check-label small" for="hideCompleted">
            Hide completed
          </label>
        </div>

        {/* Priority */}
        <div class="mb-2">
          <div class="filter-label">Min. Priority</div>
            <StarSelector
              value={filters.priority}
              onChange={v => setFilters({ priority: v })}
            />
            <div class="small text-muted mt-1">
              {filters.priority !== null && !isNaN(filters.priority) ?  `Showing ≥ ${filters.priority}★` : "Showing All"}
            </div>
        </div>

        {/* Reset + Count */}
        <button
          class="btn btn-sm btn-outline-secondary w-100 mb-2"
          onClick={() => setFilters({ search: '', status: [], tag: [], priority: 0, hideCompleted: false, sort: '' })}
        >
          Reset Filters
        </button>
        <div class="text-muted small d-none">
          {filteredCount} results
        </div>
      </div>
    </div>
  )
}
