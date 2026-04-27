import { useLocation, Link } from 'react-router-dom'

export default function VerifyEmailSentPage() {
  const location = useLocation()
  const email = (location.state as any)?.email || 'tu correo'

  return (
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md text-center">
        <Link to="/" className="block font-black text-white text-xl tracking-tight mb-12">MatchUp</Link>

        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7 text-primary">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
          </svg>
        </div>

        <h1 className="text-2xl font-black text-white mb-3">Verifica tu correo</h1>
        <p className="text-white/30 text-sm mb-2 leading-relaxed">
          Enviamos un enlace de verificación a
        </p>
        <p className="text-white/70 font-semibold text-sm mb-6">{email}</p>

        <div className="border border-white/[0.06] bg-white/[0.02] rounded-xl p-4 text-xs text-white/25 mb-8 leading-relaxed">
          Si no lo ves en unos minutos, revisa tu carpeta de <span className="text-white/40 font-medium">spam</span>.
        </div>

        <Link to="/login" className="text-primary hover:text-pink-400 text-sm font-semibold transition">
          ¿Ya verificaste? Iniciar sesión
        </Link>
      </div>
    </div>
  )
}
