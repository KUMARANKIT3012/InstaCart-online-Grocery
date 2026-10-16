import { useState } from 'react'
import { ToastContext } from './toast-context.js'

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  function removeToast(id) { setToasts((current) => current.filter((toast) => toast.id !== id)) }
  function addToast(message, type = 'success') {
    const id = Date.now() + Math.random()
    setToasts((current) => [...current, { id, message, type }])
    window.setTimeout(() => removeToast(id), 3500)
  }

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div aria-live="polite" className="toast-stack">{toasts.map((toast) => <div className={`toast toast-${toast.type}`} key={toast.id}><span>{toast.message}</span><button onClick={() => removeToast(toast.id)} type="button">×</button></div>)}</div>
    </ToastContext.Provider>
  )
}