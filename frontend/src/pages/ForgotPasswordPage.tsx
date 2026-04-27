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

  return (
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="block font-black text-white text-xl tracking-tight text-center mb-12">MatchUp</Link>

        {sent ? (
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7 text-primary">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
            </div>
            <h1 className="text-2xl font-black text-white mb-3">Revisa tu correo</h1>
            <p className="text-white/30 text-sm mb-2 leading-relaxed">
              Si <span className="text-white/60 font-medium">{email}</span> está registrado, recibirás un enlace para restablecer tu contraseña.
            </p>
            <p className="text-white/20 text-xs mb-8">Revisa también tu carpeta de spam.</p>
            <Link to="/login" className="text-primary hover:text-pink-400 text-sm font-semibold transition">
              Volver al inicio de sesión
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-black text-white mb-1.5">¿Olvidaste tu contraseña?</h1>
              <p className="text-white/30 text-sm">Te enviaremos un enlace para restablecerla.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label-dark">Email</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="tu@email.com" className="input-dark" />
              </div>
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Enviando...' : 'Enviar enlace'}
              </button>
            </form>

            <p className="text-center mt-6 text-sm text-white/25">
              <Link to="/login" className="text-primary hover:text-pink-400 font-semibold transition">
                Volver al inicio de sesión
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
