import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { verifyEmail } from '../api'

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
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md text-center">
        <Link to="/" className="block font-black text-white text-xl tracking-tight mb-12">MatchUp</Link>

        {state === 'loading' && (
          <>
            <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mx-auto mb-6">
              <svg className="w-6 h-6 text-white/30 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
            <p className="text-white/30 text-sm">Verificando tu cuenta...</p>
          </>
        )}

        {state === 'success' && (
          <>
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7 text-emerald-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
            <h1 className="text-2xl font-black text-white mb-3">Cuenta verificada</h1>
            <p className="text-white/30 text-sm mb-8 leading-relaxed">{message}</p>
            <Link to="/login"
              className="inline-flex items-center gap-2 bg-primary hover:bg-pink-600 text-white px-6 py-3 rounded-xl text-sm font-bold tracking-wide uppercase transition-all shadow-lg shadow-primary/20 active:scale-[0.97]">
              Iniciar sesión
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
            </Link>
          </>
        )}

        {state === 'error' && (
          <>
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7 text-red-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-black text-white mb-3">Enlace inválido</h1>
            <p className="text-white/30 text-sm mb-8 leading-relaxed">{message}</p>
            <Link to="/register" className="text-primary hover:text-pink-400 text-sm font-semibold transition">
              Registrarse de nuevo
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
