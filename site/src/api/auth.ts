const apiBase = import.meta.env.VITE_API_BASE;

export async function login(username: string, password: string) {
  const res = await fetch(`${apiBase}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  if (!res.ok) throw new Error('Invalid login')
  return res.json()
}
