import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
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
  const location = useLocation()

  const [pendingCount, setPendingCount] = useState(0)
  const [giftCount, setGiftCount] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const prevPending = useRef(0)
  const prevGifts = useRef(0)
  const initialized = useRef(false)

  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  useEffect(() => {
    if (!user || user.role !== 'woman') return
    const check = async () => {
      try {
        const [reqRes, giftRes] = await Promise.all([getPendingRequests(), getReceivedGifts()])
        const newPending = reqRes.data.filter((r: any) => r.status === 'pending').length
        const newGifts: number = giftRes.data.total_gifts ?? 0
        if (initialized.current) {
          if (newPending > prevPending.current)
            toast('💌 Nueva solicitud de match', { icon: '💌', style: { background: '#fff0f6', color: '#be185d' } })
          if (newGifts > prevGifts.current)
            toast('🎁 ¡Recibiste un nuevo regalo!', { icon: '🎁', style: { background: '#fff0f6', color: '#be185d' } })
        }
        prevPending.current = newPending
        prevGifts.current = newGifts
        setPendingCount(newPending)
        setGiftCount(newGifts)
        initialized.current = true
      } catch {}
    }
    check()
    const id = setInterval(check, 30_000)
    return () => clearInterval(id)
  }, [user])

  const handleLogout = () => { logout(); navigate('/') }

  const womanLinks = [
    { to: '/woman/profile',  label: 'Mi Perfil',    badge: 0 },
    { to: '/woman/requests', label: 'Solicitudes',  badge: pendingCount, onClick: () => setPendingCount(0) },
    { to: '/woman/gifts',    label: 'Regalos 🎁',   badge: giftCount,   onClick: () => setGiftCount(0) },
    { to: '/woman/preview',  label: 'Vista pública', badge: 0 },
  ]

  const manLinks = [
    { to: '/man/browse',     label: '🔍 Explorar' },
    { to: '/man/requests',   label: '💘 Matches' },
    { to: '/man/profile',    label: '👤 Mi Perfil' },
    { to: '/man/subscribe',  label: '💳 Suscripción' },
  ]

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-pink-100 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="text-xl font-extrabold text-primary tracking-tight">
          MatchUp <span className="text-base">💘</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-5">
          {!user ? (
            <>
              <Link to="/login" className="text-gray-600 hover:text-primary text-sm font-medium transition">
                Iniciar sesión
              </Link>
              <Link to="/register" className="bg-primary text-white px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-pink-600 transition shadow-sm">
                Registrarse
              </Link>
            </>
          ) : user.role === 'woman' ? (
            <>
              {womanLinks.map(l => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={l.onClick}
                  className="relative text-gray-600 hover:text-primary text-sm font-medium transition"
                >
                  {l.label}
                  <Badge count={l.badge} />
                </Link>
              ))}
              <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 text-sm font-medium transition">
                Salir
              </button>
            </>
          ) : (
            <>
              {manLinks.map(l => (
                <Link key={l.to} to={l.to} className="text-gray-600 hover:text-primary text-sm font-medium transition">
                  {l.label}
                </Link>
              ))}
              <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 text-sm font-medium transition">
                Salir
              </button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-xl hover:bg-pink-50 transition gap-1.5"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Abrir menú"
        >
          <span className={`block w-5 h-0.5 bg-gray-700 rounded-full transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-gray-700 rounded-full transition-all duration-300 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-gray-700 rounded-full transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile dropdown */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="border-t border-pink-100 bg-white px-3 py-3 space-y-1">
          {!user ? (
            <>
              <Link to="/login" className="block px-4 py-3 text-gray-700 font-medium rounded-2xl hover:bg-pink-50 transition text-sm">
                Iniciar sesión
              </Link>
              <Link to="/register" className="block px-4 py-3 text-white font-semibold rounded-2xl bg-primary hover:bg-pink-600 transition text-sm text-center">
                Registrarse
              </Link>
            </>
          ) : user.role === 'woman' ? (
            <>
              {womanLinks.map(l => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={l.onClick}
                  className="flex items-center justify-between px-4 py-3 text-gray-700 font-medium rounded-2xl hover:bg-pink-50 transition text-sm"
                >
                  <span>{l.label}</span>
                  {l.badge > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {l.badge > 9 ? '9+' : l.badge}
                    </span>
                  )}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-red-500 font-medium rounded-2xl hover:bg-red-50 transition text-sm"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              {manLinks.map(l => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="block px-4 py-3 text-gray-700 font-medium rounded-2xl hover:bg-pink-50 transition text-sm"
                >
                  {l.label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-red-500 font-medium rounded-2xl hover:bg-red-50 transition text-sm"
              >
                Cerrar sesión
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
