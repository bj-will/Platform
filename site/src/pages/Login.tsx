import { h } from 'preact'
import { useState } from 'preact/hooks'
import { route } from 'preact-router'
import { useUIStore } from '../store/uiStore'


export default function Login(){
  const [name, setName] = useUIStore('')
  const login = useUIStore(s => s.login)
  return (
    <div class="container py-10">
      <div class="row justify-content-center">
        <div class="col-6">
          <div class="card">
            <div class="card-body">
              <h4>Login</h4>
              <input class="form-control my-2" placeholder="Your name" value={name} onInput={e => setName((e.target as HTMLInputElement).value)} />
              <div class="d-flex justify-content-end">
                <button class="btn btn-primary" onClick={() => { login(name); route('/') }}>Enter</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

