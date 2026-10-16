import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'

function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await register(form)
      navigate('/account', { replace: true })
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Unable to create your account right now.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function updateField(field, value) {
    setForm({ ...form, [field]: value })
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <p className="eyebrow">Start shopping better</p>
        <h1>Create your account</h1>
        <p className="auth-subtitle">Save your details for a smoother grocery run.</p>
        {error && <div className="error-state">{error}</div>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label>First name<input autoComplete="given-name" onChange={(event) => updateField('firstName', event.target.value)} required value={form.firstName} /></label>
            <label>Last name<input autoComplete="family-name" onChange={(event) => updateField('lastName', event.target.value)} required value={form.lastName} /></label>
          </div>
          <label>Email<input autoComplete="email" onChange={(event) => updateField('email', event.target.value)} required type="email" value={form.email} /></label>
          <label>Password<input autoComplete="new-password" minLength="8" onChange={(event) => updateField('password', event.target.value)} required type="password" value={form.password} /></label>
          <button className="button" disabled={isSubmitting} type="submit">{isSubmitting ? 'Creating account...' : 'Create account'}</button>
        </form>
        <p className="auth-footer">Already have an account? <Link to="/login">Sign in</Link></p>
      </section>
    </main>
  )
}

export default RegisterPage