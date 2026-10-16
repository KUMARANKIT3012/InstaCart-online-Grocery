import { useAuth } from '../context/useAuth.js'

function AccountPage() {
  const { user, logout } = useAuth()

  return (
    <main className="page-shell">
      <section className="account-card">
        <p className="eyebrow">Your account</p>
        <h1>Hello, {user.first_name}.</h1>
        <p className="auth-subtitle">{user.email}</p>
        <button className="button" onClick={logout} type="button">Sign out</button>
      </section>
    </main>
  )
}

export default AccountPage