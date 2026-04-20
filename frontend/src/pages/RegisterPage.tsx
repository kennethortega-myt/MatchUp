import { useState, FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

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
import toast from 'react-hot-toast'
import { register as apiRegister } from '../api'
import { useAuth } from '../context/AuthContext'

function checkPassword(pw: string) {
  return {
    length:    pw.length >= 8,
    upper:     /[A-Z]/.test(pw),
    lower:     /[a-z]/.test(pw),
    number:    /\d/.test(pw),
    special:   /[!@#$%^&*(),.?":{}|<>_\-]/.test(pw),
  }
}

function StrengthBar({ password }: { password: string }) {
  if (!password) return null
  const checks = checkPassword(password)
  const score = Object.values(checks).filter(Boolean).length
  const bars = [
    'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-lime-400', 'bg-green-500'
  ]
  const labels = ['Muy débil', 'Débil', 'Regular', 'Buena', 'Fuerte']
  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[1,2,3,4,5].map(i => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= score ? bars[score-1] : 'bg-gray-200'}`} />
        ))}
      </div>
      <p className={`text-xs font-medium ${score <= 2 ? 'text-red-500' : score <= 3 ? 'text-yellow-600' : 'text-green-600'}`}>
        {labels[score - 1] ?? ''}
      </p>
      <ul className="text-xs text-gray-500 space-y-0.5">
        {[
          [checks.length,  '8 caracteres mínimo'],
          [checks.upper,   'Una mayúscula'],
          [checks.lower,   'Una minúscula'],
          [checks.number,  'Un número'],
          [checks.special, 'Un carácter especial (!@#$%...)'],
        ].map(([ok, label]) => (
          <li key={label as string} className={`flex items-center gap-1 ${ok ? 'text-green-600' : 'text-gray-400'}`}>
            <span>{ok ? '✓' : '○'}</span> {label as string}
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
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const checks = checkPassword(password)
  const isValid = Object.values(checks).every(Boolean)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!isValid) {
      toast.error('La contraseña no cumple los requisitos de seguridad')
      return
    }
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Crear cuenta</h1>

        {/* Role toggle */}
        <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-6">
          <button type="button" onClick={() => setRole('woman')}
            className={`flex-1 py-2 text-sm font-medium transition ${role === 'woman' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-pink-50'}`}>
            Soy Mujer
          </button>
          <button type="button" onClick={() => setRole('man')}
            className={`flex-1 py-2 text-sm font-medium transition ${role === 'man' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
            Soy Hombre
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
                className={`w-full border rounded-xl px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-primary transition ${
                  password && !isValid ? 'border-red-300' : password && isValid ? 'border-green-400' : 'border-gray-300'
                }`} />
              <button type="button" onClick={() => setShowPw(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <EyeIcon open={showPw} />
              </button>
            </div>
            <StrengthBar password={password} />
          </div>
          <button type="submit" disabled={loading || !isValid}
            className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-pink-600 transition disabled:opacity-50">
            {loading ? 'Creando cuenta...' : 'Registrarse'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          ¿Ya tienes cuenta? <Link to="/login" className="text-primary font-medium">Inicia sesión</Link>
        </p>
      </div>
    </div>
  )
}
