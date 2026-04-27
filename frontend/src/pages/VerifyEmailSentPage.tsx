import { useLocation, Link } from 'react-router-dom'
import AgaraLogo from '../components/AgaraLogo'

export default function VerifyEmailSentPage() {
  const location = useLocation()
  const email = (location.state as any)?.email || 'tu correo'

  return (
    <div className="min-h-screen bg-[#070509] text-[#F5F0E8] flex items-center justify-center px-6 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(201,168,76,0.06),transparent)] pointer-events-none" />

      <div className="relative w-full max-w-[380px] text-center">
        <Link to="/" className="inline-flex items-center gap-3 mb-12">
          <AgaraLogo size={36} />
          <span className="font-black text-[#F5F0E8] text-xl tracking-tight">Agara</span>
        </Link>

        <div className="w-14 h-14 rounded-2xl border border-primary/25 bg-primary/[0.07] flex items-center justify-center mx-auto mb-6">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-primary">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
          </svg>
        </div>

        <h1 className="text-2xl font-black text-[#F5F0E8] tracking-tight mb-3">Verifica tu correo</h1>
        <p className="text-sm text-[#F5F0E8]/28 mb-2">Enviamos un enlace de verificación a</p>
        <p className="text-sm font-semibold text-[#F5F0E8]/65 mb-8">{email}</p>

        <div className="border border-primary/[0.09] bg-primary/[0.03] rounded-xl p-4 text-xs text-[#F5F0E8]/20 mb-10 leading-relaxed">
          Si no lo ves en unos minutos, revisa tu carpeta de <span className="text-[#F5F0E8]/40 font-medium">spam</span>.
        </div>

        <Link to="/login" className="text-primary hover:text-gold-light text-sm font-semibold transition">
          ¿Ya verificaste? Iniciar sesión
        </Link>
      </div>
    </div>
  )
}
