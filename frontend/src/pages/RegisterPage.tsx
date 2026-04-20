import { useState, FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { register as apiRegister } from '../api'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const [searchParams] = useSearchParams()
  const defaultRole = searchParams.get('role') || 'woman'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'man' | 'woman'>(defaultRole as 'man' | 'woman')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await apiRegister(email, password, role)
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
            <input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <button type="submit" disabled={loading}
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
