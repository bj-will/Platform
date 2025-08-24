import { useState } from "preact/hooks"
import { login } from '../../api/auth'

export default function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const data = await login(username, password)
      localStorage.setItem('token', data.token)
      onLogin(data.token)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div class="page page-center">
      <div class="container-tight py-4">
        <div class="text-center mb-4">
          <a href="/" class="navbar-brand navbar-brand-autodark">
            <img src="/static/logo.svg" height="36" alt="Logo" />
          </a>
        </div>

        <form class="card card-md" onSubmit={handleSubmit}>
          <div class="card-body">
            <h2 class="card-title text-center mb-4">Admin Login</h2>
            <div class="mb-3">
              <input
                type="text"
                class="form-control"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.currentTarget.value)}
              />
            </div>
            <div class="mb-2">
              <input
                type="password"
                class="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
              />
            </div>
            {error && <div class="text-danger mb-3">{error}</div>}
            <div class="form-footer">
              <button type="submit" class="btn btn-primary w-100">
                Login
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
