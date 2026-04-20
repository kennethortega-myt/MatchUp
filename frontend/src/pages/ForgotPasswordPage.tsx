import { useState, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { forgotPassword } from '../api'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await forgotPassword(email)
      setSent(true)
    } catch {
      toast.error('Error al enviar el correo. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50 px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
          <div className="text-5xl mb-4">📧</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-3">Revisa tu correo</h1>
          <p className="text-gray-500 mb-6">
            Si <strong>{email}</strong> está registrado, recibirás un enlace para restablecer tu contraseña en los próximos minutos.
          </p>
          <Link to="/login" className="text-primary font-medium hover:underline">Volver al inicio de sesión</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-2 text-gray-800">¿Olvidaste tu contraseña?</h1>
        <p className="text-center text-sm text-gray-500 mb-6">
          Ingresa tu email y te enviaremos un enlace para restablecerla.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-pink-600 transition disabled:opacity-50">
            {loading ? 'Enviando...' : 'Enviar enlace'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          <Link to="/login" className="text-primary font-medium hover:underline">Volver al inicio de sesión</Link>
        </p>
      </div>
    </div>
  )
}
