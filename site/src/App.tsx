
import { h } from 'preact'
import Router from 'preact-router'
import Home from './pages/Home'
import AdminPage from './pages/AdminPage'

export default function App() {
  return (
    <div class="page min-vh-100 d-flex flex-column">
      <Router>
        <Home path="/" />
        <AdminPage path="/admin" />
      </Router>
    </div>
  )
}

