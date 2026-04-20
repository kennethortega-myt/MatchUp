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
    <div className="min-h-screen flex items-center justify-center bg-pink-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md text-center">
        {state === 'loading' && (
          <>
            <div className="text-5xl mb-4 animate-pulse">⏳</div>
            <p className="text-gray-500">Verificando tu cuenta...</p>
          </>
        )}
        {state === 'success' && (
          <>
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">¡Cuenta verificada!</h1>
            <p className="text-gray-500 mb-6">{message}</p>
            <Link
              to="/login"
              className="inline-block bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-pink-600 transition"
            >
              Iniciar sesión →
            </Link>
          </>
        )}
        {state === 'error' && (
          <>
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Enlace inválido</h1>
            <p className="text-gray-500 mb-6">{message}</p>
            <Link to="/register" className="text-primary font-medium text-sm hover:underline">
              Registrarse de nuevo →
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
