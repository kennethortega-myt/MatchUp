import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { getPendingRequests, getReceivedGifts } from '../api'

function Badge({ count }: { count: number }) {
  if (count === 0) return null
  return (
    <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
      {count > 9 ? '9+' : count}
    </span>
  )
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [pendingCount, setPendingCount] = useState(0)
  const [giftCount, setGiftCount] = useState(0)
  const prevPending = useRef(0)
  const prevGifts = useRef(0)
  const initialized = useRef(false)

  useEffect(() => {
    if (!user || user.role !== 'woman') return

    const check = async () => {
      try {
        const [reqRes, giftRes] = await Promise.all([
          getPendingRequests(),
          getReceivedGifts(),
        ])
        const newPending = reqRes.data.filter((r: any) => r.status === 'pending').length
        const newGifts: number = giftRes.data.total_gifts ?? 0

        if (initialized.current) {
          if (newPending > prevPending.current) {
            toast('💌 Nueva solicitud de match', { icon: '💌', style: { background: '#fff0f6', color: '#be185d' } })
          }
          if (newGifts > prevGifts.current) {
            toast('🎁 ¡Recibiste un nuevo regalo!', { icon: '🎁', style: { background: '#fff0f6', color: '#be185d' } })
          }
        }

        prevPending.current = newPending
        prevGifts.current = newGifts
        setPendingCount(newPending)
        setGiftCount(newGifts)
        initialized.current = true
      } catch {
        // silently ignore polling errors
      }
    }

    check()
    const id = setInterval(check, 30_000)
    return () => clearInterval(id)
  }, [user])

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
              <Link to="/login" className="text-gray-600 hover:text-primary text-sm font-medium">
                Iniciar sesión
              </Link>
              <Link to="/register" className="bg-primary text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-pink-600 transition">
                Registrarse
              </Link>
            </>
          ) : user.role === 'woman' ? (
            <>
              <Link to="/woman/profile" className="text-gray-600 hover:text-primary text-sm font-medium">
                Mi Perfil
              </Link>

              <Link to="/woman/requests" className="relative text-gray-600 hover:text-primary text-sm font-medium"
                onClick={() => setPendingCount(0)}>
                Solicitudes
                <Badge count={pendingCount} />
              </Link>

              <Link to="/woman/gifts" className="relative text-gray-600 hover:text-primary text-sm font-medium"
                onClick={() => setGiftCount(0)}>
                Regalos 🎁
                <Badge count={giftCount} />
              </Link>

              <Link to="/woman/preview" className="text-gray-600 hover:text-primary text-sm font-medium">
                Vista pública
              </Link>
              <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 text-sm font-medium transition">
                Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/man/browse" className="text-gray-600 hover:text-primary text-sm font-medium">
                Explorar
              </Link>
              <Link to="/man/requests" className="text-gray-600 hover:text-primary text-sm font-medium">
                Matches
              </Link>
              <Link to="/man/photos" className="text-gray-600 hover:text-primary text-sm font-medium">
                Mis Fotos
              </Link>
              <Link to="/man/subscribe" className="text-gray-600 hover:text-primary text-sm font-medium">
                Suscripción
              </Link>
              <Link to="/man/profile" className="bg-blue-500 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-blue-600 transition">
                Mi Perfil
              </Link>
              <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 text-sm font-medium transition">
                Salir
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
