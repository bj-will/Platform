import '@tabler/core/dist/css/tabler.css'
// import "./styles/main.css";

import { useUIStore } from './store/uiStore'

const { darkMode } = useUIStore.getState()
document.body.setAttribute('data-bs-theme', darkMode ? 'dark' : 'light')

import { render } from 'preact'
import { Router } from 'preact-router'
import App from './App'

render(<App />, document.getElementById('app')!)

