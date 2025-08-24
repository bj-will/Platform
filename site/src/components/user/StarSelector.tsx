import { useState } from 'preact/hooks'

import './StarSelector'

export default function StarSelector({ value, onChange }: { value: number|null, onChange: (v:number|null)=>void }) {
  const [hover, setHover] = useState<number|null>(null)

  return (
    <div class="star-selector d-flex">
      {[1, 2, 3, 4, 5].map(n => {
        const active =
          hover !== null ? n >= hover : value !== null ? n >= value : false

        return (
          <span
            key={n}
            class={`star ${active ? 'text-warning' : 'text-muted'}`}
            style={{ cursor: 'pointer', fontSize: '1.2rem' }}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(null)}
            onClick={() => onChange(value === n ? null : n)}
          >
            ★
          </span>
        )
      })}
    </div>
  )
}
