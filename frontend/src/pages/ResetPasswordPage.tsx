import { useState, FormEvent } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { resetPassword } from '../api'

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
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
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
    if (!isValid) {
      toast.error('La contraseña no cumple los requisitos de seguridad')
      return
    }
    if (!token) {
      toast.error('Token inválido')
      return
    }
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

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50 px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-3">¡Contraseña actualizada!</h1>
          <p className="text-gray-500 mb-2">Ya puedes iniciar sesión con tu nueva contraseña.</p>
          <p className="text-sm text-gray-400">Redirigiendo en 3 segundos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-2 text-gray-800">Nueva contraseña</h1>
        <p className="text-center text-sm text-gray-500 mb-6">Ingresa tu nueva contraseña.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nueva contraseña</label>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} required value={password}
                onChange={e => setPassword(e.target.value)}
                className={`w-full border rounded-xl px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-primary transition ${
                  password && !isValid ? 'border-red-300' : password && isValid ? 'border-green-400' : 'border-gray-300'
                }`} />
              <button type="button" onClick={() => setShowPw(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <EyeIcon open={showPw} />
              </button>
            </div>
            {password && (
              <ul className="text-xs text-gray-500 space-y-0.5 mt-2">
                {([
                  [checks.length,  '8 caracteres mínimo'],
                  [checks.upper,   'Una mayúscula'],
                  [checks.lower,   'Una minúscula'],
                  [checks.number,  'Un número'],
                  [checks.special, 'Un carácter especial (!@#$%...)'],
                ] as [boolean, string][]).map(([ok, label]) => (
                  <li key={label} className={`flex items-center gap-1 ${ok ? 'text-green-600' : 'text-gray-400'}`}>
                    <span>{ok ? '✓' : '○'}</span> {label}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button type="submit" disabled={loading || !isValid}
            className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-pink-600 transition disabled:opacity-50">
            {loading ? 'Guardando...' : 'Guardar nueva contraseña'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          <Link to="/login" className="text-primary font-medium hover:underline">Volver al inicio de sesión</Link>
        </p>
      </div>
    </div>
  )
}
