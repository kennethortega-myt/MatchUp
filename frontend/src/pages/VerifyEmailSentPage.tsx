import { useLocation, Link } from 'react-router-dom'

export default function VerifyEmailSentPage() {
  const location = useLocation()
  const email = (location.state as any)?.email || 'tu correo'

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md text-center">
        <div className="text-6xl mb-4">📧</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Verifica tu correo</h1>
        <p className="text-gray-500 mb-6">
          Enviamos un enlace de verificación a <br />
          <span className="font-semibold text-gray-700">{email}</span>
        </p>
        <div className="bg-pink-50 rounded-xl p-4 text-sm text-gray-600 mb-6">
          Revisa también tu carpeta de <strong>spam</strong> si no lo ves en los próximos minutos.
        </div>
        <Link to="/login" className="text-primary font-medium text-sm hover:underline">
          ¿Ya verificaste? Inicia sesión →
        </Link>
      </div>
    </div>
  )
}
