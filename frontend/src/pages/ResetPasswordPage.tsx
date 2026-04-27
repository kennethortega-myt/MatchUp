import { useState, FormEvent } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { resetPassword } from '../api'
import AgaraLogo from '../components/AgaraLogo'

function checkPassword(pw: string) {
  return {
    length:  pw.length >= 8,
    upper:   /[A-Z]/.test(pw),
    lower:   /[a-z]/.test(pw),
    number:  /\d/.test(pw),
    special: /[!@#$%^&*(),.?":{}|<>_\-]/.test(pw),
  }
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  )
}

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const navigate = useNavigate()

  const checks = checkPassword(password)
  const isValid = Object.values(checks).every(Boolean)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!isValid) { toast.error('La contraseña no cumple los requisitos'); return }
    if (!token) { toast.error('Token inválido'); return }
    setLoading(true)
    try {
      await resetPassword(token, password)
      setDone(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Token inválido o expirado')
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

        {done ? (
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.07] flex items-center justify-center mx-auto mb-6">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-emerald-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
            <h1 className="text-2xl font-black text-[#F5F0E8] tracking-tight mb-3">Contraseña actualizada</h1>
            <p className="text-sm text-[#F5F0E8]/28 mb-2">Ya puedes iniciar sesión con tu nueva contraseña.</p>
            <p className="text-xs text-[#F5F0E8]/15">Redirigiendo en 3 segundos...</p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-black text-[#F5F0E8] tracking-tight mb-1.5">Nueva contraseña</h1>
              <p className="text-sm text-[#F5F0E8]/28">Elige una contraseña segura para tu cuenta.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label-agara">Nueva contraseña</label>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} required value={password}
                    onChange={e => setPassword(e.target.value)} placeholder="Mín. 8 caracteres"
                    className={`input-agara pr-11 ${
                      password && !isValid ? 'border-red-500/35' : password && isValid ? 'border-emerald-500/35' : ''
                    }`} />
                  <button type="button" onClick={() => setShowPw(p => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#F5F0E8]/18 hover:text-[#F5F0E8]/50 transition">
                    <EyeIcon open={showPw} />
                  </button>
                </div>
                {password && (
                  <ul className="mt-3 space-y-0.5">
                    {([
                      [checks.length,  '8 caracteres mínimo'],
                      [checks.upper,   'Una mayúscula'],
                      [checks.lower,   'Una minúscula'],
                      [checks.number,  'Un número'],
                      [checks.special, 'Un carácter especial'],
                    ] as [boolean, string][]).map(([ok, label]) => (
                      <li key={label} className={`text-[11px] flex items-center gap-1.5 ${ok ? 'text-emerald-400' : 'text-[#F5F0E8]/18'}`}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={ok ? 2.5 : 1.5} className="w-3 h-3 flex-shrink-0">
                          {ok ? <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                              : <circle cx="12" cy="12" r="8" />}
                        </svg>
                        {label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <button type="submit" disabled={loading || !isValid} className="btn-gold">
                {loading ? 'Guardando...' : 'Guardar nueva contraseña'}
              </button>
            </form>

            <p className="text-center mt-7">
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
