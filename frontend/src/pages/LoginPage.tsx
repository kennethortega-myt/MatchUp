import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import toast from 'react-hot-toast'
import { login as apiLogin, googleLogin } from '../api'
import { useAuth } from '../context/AuthContext'

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
        toast.error('Debes verificar tu correo antes de iniciar sesión')
      } else {
        toast.error(err.response?.data?.detail || 'Credenciales incorrectas')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#09090B] flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-[#0D0D0F] border-r border-white/[0.05] p-12">
        <Link to="/" className="font-black text-white text-xl tracking-tight">MatchUp</Link>
        <div>
          <blockquote className="text-3xl font-black text-white/80 leading-tight mb-4">
            "Para quienes no hacen<br />concesiones."
          </blockquote>
          <p className="text-white/25 text-sm">Privacidad real. Perfiles verificados. Conexiones que respetan tu tiempo.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs text-white/20 tracking-widest uppercase">Plataforma activa</span>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="block lg:hidden font-black text-white text-xl tracking-tight text-center mb-10">MatchUp</Link>

          <div className="mb-8">
            <h1 className="text-2xl font-black text-white mb-1.5">Bienvenido de vuelta</h1>
            <p className="text-white/30 text-sm">Inicia sesión para continuar</p>
          </div>

          {/* Google */}
          <div className="mb-6 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogle}
              onError={() => toast.error('Error al conectar con Google')}
              text="signin_with"
              shape="pill"
              theme="filled_black"
            />
          </div>

          <div className="relative mb-6">
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
              <div className="flex justify-between items-center mb-2">
                <label className="label-dark">Contraseña</label>
                <Link to="/forgot-password" className="text-[11px] text-primary/70 hover:text-primary transition font-medium">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} required value={password}
                  onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                  className="input-dark pr-11" />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition">
                  <EyeIcon open={showPw} />
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary mt-2">
              {loading ? 'Entrando...' : 'Iniciar sesión'}
            </button>
          </form>

          <p className="text-center text-sm text-white/25 mt-6">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-primary hover:text-pink-400 font-semibold transition">
              Regístrate gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
