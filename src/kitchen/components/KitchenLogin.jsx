import React, { useState } from 'react'
import { ChefHat, LockKeyhole } from 'lucide-react'

export default function KitchenLogin({ onLogin }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    try { await onLogin(password) } catch (err) { setError(err.message || 'Sign-in failed. Please try again.') }
    finally { setBusy(false) }
  }

  return (
    <main className="min-h-[75vh] grid place-items-center bg-stone-100/70 px-4 py-12">
      <form onSubmit={submit} className="w-full max-w-md rounded-3xl border border-stone-200 bg-white p-8 shadow-xl">
        <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-amber-100 text-amber-800"><ChefHat className="h-7 w-7" /></div>
        <h1 className="text-center font-serif text-2xl font-bold text-stone-900">Kitchen staff sign-in</h1>
        <p className="mt-2 text-center text-sm text-stone-500">Enter your staff password to open the kitchen dashboard.</p>
        <label htmlFor="kitchen-password" className="mt-7 mb-2 block text-sm font-semibold text-stone-700">Staff password</label>
        <div className="relative">
          <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input id="kitchen-password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-stone-300 py-3 pl-10 pr-3 outline-none focus:ring-2 focus:ring-amber-500" />
        </div>
        {error && <p role="alert" className="mt-3 text-sm text-rose-700">{error}</p>}
        <button disabled={busy} className="mt-5 w-full rounded-xl bg-amber-700 px-4 py-3 font-bold text-white hover:bg-amber-800 disabled:opacity-60">{busy ? 'Signing in…' : 'Sign in to kitchen'}</button>
      </form>
    </main>
  )
}
