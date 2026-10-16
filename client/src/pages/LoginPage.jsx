import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'

function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await login(form)
      navigate(location.state?.from || '/account', { replace: true })
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Unable to sign in right now.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <p className="eyebrow">Welcome back</p>
        <h1>Sign in to INSTACART</h1>
        <p className="auth-subtitle">Pick up where your grocery list left off.</p>
        {error && <div className="error-state">{error}</div>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>Email<input autoComplete="email" onChange={(event) => setForm({ ...form, email: event.target.value })} required type="email" value={form.email} /></label>
          <label>Password<input autoComplete="current-password" minLength="8" onChange={(event) => setForm({ ...form, password: event.target.value })} required type="password" value={form.password} /></label>
          <button className="button" disabled={isSubmitting} type="submit">{isSubmitting ? 'Signing in...' : 'Sign in'}</button>
        </form>
        <p className="auth-footer">New here? <Link to="/register">Create an account</Link></p>
      </section>
    </main>
  )
}

export default LoginPage