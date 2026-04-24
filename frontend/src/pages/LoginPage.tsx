import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import toast from 'react-hot-toast'
import { login as apiLogin, googleLogin } from '../api'
import { useAuth } from '../context/AuthContext'

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

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleGoogle = async (credentialResponse: any) => {
    try {
      const res = await googleLogin(credentialResponse.credential)
      const { access_token, user_id, email: userEmail, role } = res.data
      login(access_token, { id: user_id, email: userEmail, role })
      navigate(role === 'woman' ? '/woman' : '/man')
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Error al iniciar sesión con Google')
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await apiLogin(email, password)
      const { access_token, user_id, role } = res.data
      login(access_token, { id: user_id, email, role })
      navigate(role === 'woman' ? '/woman' : '/man')
    } catch (err: any) {
      if (err.response?.status === 403) {
        toast.error('Debes verificar tu correo electrónico antes de iniciar sesión')
      } else {
        toast.error(err.response?.data?.detail || 'Credenciales incorrectas')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-100 px-4 py-10">
      <div className="bg-white rounded-3xl shadow-card w-full max-w-sm sm:max-w-md p-6 sm:p-8 animate-slide-up">

        {/* Logo */}
        <div className="text-center mb-7">
          <Link to="/" className="inline-block text-2xl font-extrabold text-primary">MatchUp 💘</Link>
          <h1 className="text-xl font-bold text-gray-800 mt-2">Bienvenido de vuelta</h1>
          <p className="text-gray-400 text-sm mt-1">Inicia sesión en tu cuenta</p>
        </div>

        {/* Google */}
        <div className="mb-5 flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogle}
            onError={() => toast.error('Error al conectar con Google')}
            text="signin_with"
            shape="pill"
          />
        </div>

        <div className="relative mb-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 text-gray-400">o continúa con email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
            />
          </div>
          <div>
            <div className="flex justify-between mb-1.5">
              <label className="block text-sm font-semibold text-gray-700">Contraseña</label>
              <Link to="/forgot-password" className="text-xs text-primary hover:underline font-medium">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
              />
              <button
                type="button"
                onClick={() => setShowPw(p => !p)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              >
                <EyeIcon open={showPw} />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-pink-600 text-white py-3 rounded-2xl font-bold hover:from-pink-600 hover:to-rose-600 transition disabled:opacity-50 shadow-sm active:scale-[0.98] mt-1"
          >
            {loading ? 'Entrando...' : 'Iniciar sesión'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-primary font-semibold hover:underline">
            Regístrate gratis
          </Link>
        </p>
      </div>
    </div>
  )
}
