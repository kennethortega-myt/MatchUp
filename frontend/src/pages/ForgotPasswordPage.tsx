import { useState, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { forgotPassword } from '../api'
import AgaraLogo from '../components/AgaraLogo'

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
    <div className="min-h-screen bg-[#070509] text-[#F5F0E8] flex items-center justify-center px-6 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(201,168,76,0.06),transparent)] pointer-events-none" />

      <div className="relative w-full max-w-[360px]">
        <Link to="/" className="flex items-center justify-center gap-3 mb-12">
          <AgaraLogo size={36} />
          <span className="font-black text-[#F5F0E8] text-xl tracking-tight">Agara</span>
        </Link>

        {sent ? (
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl border border-primary/25 bg-primary/[0.07] flex items-center justify-center mx-auto mb-6">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-primary">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
            </div>
            <h1 className="text-2xl font-black text-[#F5F0E8] tracking-tight mb-3">Revisa tu correo</h1>
            <p className="text-sm text-[#F5F0E8]/30 leading-relaxed mb-2">
              Si <span className="text-[#F5F0E8]/60 font-medium">{email}</span> está registrado, recibirás un enlace de recuperación.
            </p>
            <p className="text-xs text-[#F5F0E8]/15 mb-10">Revisa también tu carpeta de spam.</p>
            <Link to="/login" className="text-primary hover:text-gold-light text-sm font-semibold transition">
              Volver al inicio de sesión
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-black text-[#F5F0E8] tracking-tight mb-1.5">¿Olvidaste tu contraseña?</h1>
              <p className="text-sm text-[#F5F0E8]/28">Te enviaremos un enlace para restablecerla.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label-agara">Email</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="tu@email.com" className="input-agara" />
              </div>
              <button type="submit" disabled={loading} className="btn-gold">
                {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
              </button>
            </form>

            <p className="text-center mt-7 text-sm">
              <Link to="/login" className="text-primary hover:text-gold-light font-semibold transition text-sm">
                Volver al inicio de sesión
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
