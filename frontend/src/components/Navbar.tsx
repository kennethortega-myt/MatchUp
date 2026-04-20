import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-white shadow-sm border-b border-pink-100">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-primary">
          MatchUp 💘
        </Link>

        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <Link
                to="/login"
                className="text-gray-600 hover:text-primary text-sm font-medium"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="bg-primary text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-pink-600 transition"
              >
                Registrarse
              </Link>
            </>
          ) : user.role === 'woman' ? (
            <>
              <Link
                to="/woman/profile"
                className="text-gray-600 hover:text-primary text-sm font-medium"
              >
                Mi Perfil
              </Link>
              <Link
                to="/woman/requests"
                className="text-gray-600 hover:text-primary text-sm font-medium"
              >
                Solicitudes
              </Link>
              <Link
                to="/woman/gifts"
                className="text-gray-600 hover:text-primary text-sm font-medium"
              >
                Regalos 🎁
              </Link>
              <Link
                to="/woman/preview"
                className="text-gray-600 hover:text-primary text-sm font-medium"
              >
                Vista pública
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-500 text-sm font-medium transition"
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <Link
                to="/man/browse"
                className="text-gray-600 hover:text-primary text-sm font-medium"
              >
                Explorar
              </Link>
              <Link
                to="/man/requests"
                className="text-gray-600 hover:text-primary text-sm font-medium"
              >
                Matches
              </Link>
              <Link
                to="/man/photos"
                className="text-gray-600 hover:text-primary text-sm font-medium"
              >
                Mis Fotos
              </Link>
              <Link
                to="/man/subscribe"
                className="text-gray-600 hover:text-primary text-sm font-medium"
              >
                Suscripción
              </Link>
              <Link
                to="/man/profile"
                className="bg-blue-500 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-blue-600 transition"
              >
                Mi Perfil
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-500 text-sm font-medium transition"
              >
                Salir
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
