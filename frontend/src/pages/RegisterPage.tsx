import { useState, FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import toast from 'react-hot-toast'
import { register as apiRegister, googleLogin } from '../api'
import { useAuth } from '../context/AuthContext'
import PrivacyPolicyModal from '../components/PrivacyPolicyModal'

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4.5 h-4.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4.5 h-4.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  )
}

function checkPassword(pw: string) {
  return {
    length:  pw.length >= 8,
    upper:   /[A-Z]/.test(pw),
    lower:   /[a-z]/.test(pw),
    number:  /\d/.test(pw),
    special: /[!@#$%^&*(),.?":{}|<>_\-]/.test(pw),
  }
}

function StrengthBar({ password }: { password: string }) {
  if (!password) return null
  const checks = checkPassword(password)
  const score = Object.values(checks).filter(Boolean).length
  const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-emerald-500']
  const labels = ['Muy débil', 'Débil', 'Regular', 'Buena', 'Fuerte']
  const textColors = ['text-red-400', 'text-orange-400', 'text-yellow-400', 'text-lime-400', 'text-emerald-400']
  return (
    <div className="mt-2.5 space-y-2">
      <div className="flex gap-1">
        {[1,2,3,4,5].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= score ? colors[score-1] : 'bg-white/[0.06]'}`} />
        ))}
      </div>
      <p className={`text-xs font-semibold ${textColors[score-1] ?? 'text-white/20'}`}>{labels[score-1] ?? ''}</p>
      <ul className="space-y-0.5">
        {([
          [checks.length,  '8 caracteres mínimo'],
          [checks.upper,   'Una mayúscula'],
          [checks.lower,   'Una minúscula'],
          [checks.number,  'Un número'],
          [checks.special, 'Un carácter especial (!@#$%...)'],
        ] as [boolean, string][]).map(([ok, label]) => (
          <li key={label} className={`text-xs flex items-center gap-1.5 ${ok ? 'text-emerald-400' : 'text-white/20'}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={ok ? 2.5 : 1.5} className="w-3 h-3 flex-shrink-0">
              {ok
                ? <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                : <circle cx="12" cy="12" r="8" />}
            </svg>
            {label}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function RegisterPage() {
  const [searchParams] = useSearchParams()
  const defaultRole = searchParams.get('role') || 'woman'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [role, setRole] = useState<'man' | 'woman'>(defaultRole as 'man' | 'woman')
  const [accepted, setAccepted] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const checks = checkPassword(password)
  const isValid = Object.values(checks).every(Boolean)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!isValid) { toast.error('La contraseña no cumple los requisitos'); return }
    if (!accepted) { toast.error('Debes aceptar la Política de Privacidad'); return }
    setLoading(true)
    try {
      const res = await apiRegister(email, password, role)
      if (res.data.requires_verification) {
        navigate('/verify-email-sent', { state: { email } })
        return
      }
      const { access_token, user_id } = res.data
      login(access_token, { id: user_id, email, role })
      navigate(role === 'woman' ? '/woman/profile' : '/man/profile')
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Error al registrarse')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async (credentialResponse: any) => {
    if (!accepted) { toast.error('Debes aceptar la Política de Privacidad'); return }
    try {
      const res = await googleLogin(credentialResponse.credential, role)
      const { access_token, user_id, email: userEmail } = res.data
      login(access_token, { id: user_id, email: userEmail, role })
      navigate(role === 'woman' ? '/woman/profile' : '/man/profile')
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Error al iniciar sesión con Google')
    }
  }

  return (
    <div className="min-h-screen bg-[#09090B] flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-[#0D0D0F] border-r border-white/[0.05] p-12">
        <Link to="/" className="font-black text-white text-xl tracking-tight">MatchUp</Link>
        <div>
          <p className="text-[11px] text-primary tracking-[0.2em] uppercase font-bold mb-4">¿Por qué unirte?</p>
          <ul className="space-y-4">
            {[
              ['Privacidad total', 'Tu información nunca se revela sin tu consentimiento.'],
              ['Solo perfiles reales', 'Verificados y curados. Sin bots ni perfiles vacíos.'],
              ['Conexiones con criterio', 'Hombres con membresía activa. Mujeres que eligen.'],
            ].map(([title, desc]) => (
              <li key={title} className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-white/70 text-sm font-semibold">{title}</p>
                  <p className="text-white/25 text-xs mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs text-white/20 tracking-widest uppercase">Plataforma activa</span>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="block lg:hidden font-black text-white text-xl tracking-tight text-center mb-10">MatchUp</Link>

          <div className="mb-8">
            <h1 className="text-2xl font-black text-white mb-1.5">Crear cuenta</h1>
            <p className="text-white/30 text-sm">Registro gratuito, sin tarjeta de crédito</p>
          </div>

          {/* Role selector */}
          <div className="flex gap-2 mb-6 p-1 bg-white/[0.04] rounded-xl border border-white/[0.06]">
            <button type="button" onClick={() => setRole('woman')}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                role === 'woman' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-white/30 hover:text-white/60'
              }`}>
              Soy Mujer
            </button>
            <button type="button" onClick={() => setRole('man')}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                role === 'man' ? 'bg-white/10 text-white border border-white/20' : 'text-white/30 hover:text-white/60'
              }`}>
              Soy Hombre
            </button>
          </div>

          {/* Google */}
          <div className="mb-5 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogle}
              onError={() => toast.error('Error al conectar con Google')}
              text="signup_with"
              shape="pill"
              theme="filled_black"
            />
          </div>

          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.06]" />
            </div>
            <div className="relative flex justify-center text-[11px]">
              <span className="bg-[#09090B] px-3 text-white/20 tracking-widest uppercase">o con email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-dark">Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com" className="input-dark" />
            </div>

            <div>
              <label className="label-dark">Contraseña</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} required value={password}
                  onChange={e => setPassword(e.target.value)} placeholder="Mín. 8 caracteres"
                  className={`input-dark pr-11 ${
                    password && !isValid ? 'border-red-500/40' : password && isValid ? 'border-emerald-500/40' : ''
                  }`} />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition">
                  <EyeIcon open={showPw} />
                </button>
              </div>
              <StrengthBar password={password} />
            </div>

            {/* Privacy */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative mt-0.5 flex-shrink-0">
                <input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)} className="sr-only" />
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                  accepted ? 'bg-primary border-primary' : 'border-white/20 group-hover:border-primary/50'
                }`}>
                  {accepted && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-xs text-white/25 leading-relaxed">
                He leído y acepto la{' '}
                <button type="button" onClick={() => setShowPrivacy(true)} className="text-primary hover:text-pink-400 font-semibold transition">
                  Política de Privacidad
                </button>
              </span>
            </label>

            <button type="submit" disabled={loading || !isValid || !accepted} className="btn-primary">
              {loading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
            </button>
          </form>

          <p className="text-center text-sm text-white/25 mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-primary hover:text-pink-400 font-semibold transition">Inicia sesión</Link>
          </p>
        </div>
      </div>

      {showPrivacy && <PrivacyPolicyModal onClose={() => setShowPrivacy(false)} />}
    </div>
  )
}
