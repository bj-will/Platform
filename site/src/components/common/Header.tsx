import { h } from 'preact'
import { useUIStore } from '../../store/uiStore'
import { route } from 'preact-router'
import { useState, useEffect } from 'preact/hooks';

import { IconSun, IconMoon } from '@tabler/icons-preact'

export default function Header() {
  const user = useUIStore(s => s.user)
//   const logout = useUIStore(s => s.logout)
  const darkMode = useUIStore(s => s.darkMode)
  const toggleDarkMode = useUIStore(s => s.toggleDarkMode)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    if (darkMode) {
      document.body.classList.remove("theme-light");
      document.body.classList.add("theme-dark");
    } else {
      document.body.classList.remove("theme-dark");
      document.body.classList.add("theme-light");
    }
  }, [darkMode]);
  async function connectWallet(type: 'keplr' | 'leap' | 'metamask' | 'mobile') {
    if (!activeChain || !userData) return
  }

  return (
    <header class="navbar navbar-expand-md navbar-light border-bottom">
      <div class="container">
        <a class="navbar-brand">Platform</a>

        <div class="ms-auto d-flex align-items-center gap-2">
          {/* Dark mode toggle button */}
          <button
            class="btn btn-outline-primary btn-sm"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <IconSun size={16} /> : <IconMoon size={16} />}
          </button>

          {user ? (
            <div class="d-flex align-items-center">
              <div class="me-3 text-muted">{user.name}</div>
              <button
                class="btn btn-outline-danger btn-sm"
                onClick={() => {
//                   logout()
                  route('/')
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <button class="btn btn-primary btn-sm d-none" onClick={() => {}}>
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

