import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { verifyEmail } from '../api'
import AgaraLogo from '../components/AgaraLogo'

type State = 'loading' | 'success' | 'error'

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const [state, setState] = useState<State>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) { setState('error'); setMessage('Token inválido'); return }
    verifyEmail(token)
      .then(res => { setState('success'); setMessage(res.data.message) })
      .catch(err => { setState('error'); setMessage(err.response?.data?.detail || 'Token inválido o expirado') })
  }, [token])

  return (
    <div className="min-h-screen bg-[#070509] text-[#F5F0E8] flex items-center justify-center px-6 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(201,168,76,0.06),transparent)] pointer-events-none" />

      <div className="relative w-full max-w-[360px] text-center">
        <Link to="/" className="inline-flex items-center gap-3 mb-12">
          <AgaraLogo size={36} />
          <span className="font-black text-[#F5F0E8] text-xl tracking-tight">Agara</span>
        </Link>

        {state === 'loading' && (
          <>
            <div className="w-14 h-14 rounded-2xl border border-white/[0.07] bg-white/[0.03] flex items-center justify-center mx-auto mb-6">
              <svg className="w-5 h-5 text-primary/50 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
            <p className="text-sm text-[#F5F0E8]/28">Verificando tu cuenta...</p>
          </>
        )}

        {state === 'success' && (
          <>
            <div className="w-14 h-14 rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.07] flex items-center justify-center mx-auto mb-6">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-emerald-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
            <h1 className="text-2xl font-black text-[#F5F0E8] tracking-tight mb-3">Cuenta verificada</h1>
            <p className="text-sm text-[#F5F0E8]/28 leading-relaxed mb-10">{message}</p>
            <Link to="/login"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold tracking-widest uppercase transition-all active:scale-[0.97] text-[#0F0C18]"
              style={{ background: 'linear-gradient(135deg,#E0C070,#C9A84C)', boxShadow: '0 6px 20px rgba(201,168,76,0.2)' }}>
              Iniciar sesión
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
            </Link>
          </>
        )}

        {state === 'error' && (
          <>
            <div className="w-14 h-14 rounded-2xl border border-red-500/25 bg-red-500/[0.07] flex items-center justify-center mx-auto mb-6">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-red-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-black text-[#F5F0E8] tracking-tight mb-3">Enlace inválido</h1>
            <p className="text-sm text-[#F5F0E8]/28 leading-relaxed mb-10">{message}</p>
            <Link to="/register" className="text-primary hover:text-gold-light text-sm font-semibold transition">
              Registrarse de nuevo
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
