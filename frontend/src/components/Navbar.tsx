import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { getPendingRequests, getReceivedGifts } from '../api'

function Badge({ count }: { count: number }) {
  if (count === 0) return null
  return (
    <span className="absolute -top-1 -right-1.5 bg-primary text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center leading-none">
      {count > 9 ? '9+' : count}
    </span>
  )
}

const IconExplore = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
)
const IconHeart = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
  </svg>
)
const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </svg>
)
const IconCard = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
  </svg>
)
const IconBell = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
  </svg>
)
const IconGift = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
  </svg>
)
const IconEye = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
)
const IconLogout = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
  </svg>
)

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
            toast('Nueva solicitud de match', { style: { background: '#111113', color: '#fff', border: '1px solid rgba(233,30,140,0.3)' } })
          if (newGifts > prevGifts.current)
            toast('Recibiste un nuevo regalo', { style: { background: '#111113', color: '#fff', border: '1px solid rgba(233,30,140,0.3)' } })
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
    { to: '/woman/profile',  label: 'Mi Perfil',    icon: <IconUser />,  badge: 0 },
    { to: '/woman/requests', label: 'Solicitudes',  icon: <IconBell />,  badge: pendingCount, onClear: () => setPendingCount(0) },
    { to: '/woman/gifts',    label: 'Regalos',      icon: <IconGift />,  badge: giftCount,   onClear: () => setGiftCount(0) },
    { to: '/woman/preview',  label: 'Vista pública',icon: <IconEye />,   badge: 0 },
  ]

  const manLinks = [
    { to: '/man/browse',    label: 'Explorar',    icon: <IconExplore /> },
    { to: '/man/requests',  label: 'Matches',     icon: <IconHeart /> },
    { to: '/man/profile',   label: 'Mi Perfil',   icon: <IconUser /> },
    { to: '/man/subscribe', label: 'Membresía',   icon: <IconCard /> },
  ]

  const isActive = (to: string) => location.pathname === to

  return (
    <nav className="bg-[#09090B]/95 backdrop-blur-md border-b border-white/[0.05] sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="font-black text-white tracking-tight text-lg hover:text-white/80 transition-colors">
          MatchUp
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {!user ? (
            <>
              <Link to="/login"
                className="px-4 py-2 text-sm text-white/40 hover:text-white/80 font-medium transition-colors">
                Iniciar sesión
              </Link>
              <Link to="/register"
                className="ml-2 bg-primary hover:bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-md shadow-primary/20">
                Registrarse
              </Link>
            </>
          ) : user.role === 'woman' ? (
            <>
              {womanLinks.map(l => (
                <Link key={l.to} to={l.to} onClick={l.onClear}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(l.to) ? 'text-white bg-white/[0.06]' : 'text-white/40 hover:text-white/80 hover:bg-white/[0.04]'
                  }`}>
                  {l.icon}
                  {l.label}
                  <Badge count={l.badge} />
                </Link>
              ))}
              <button onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white/25 hover:text-red-400 hover:bg-red-500/[0.06] transition-colors ml-2">
                <IconLogout />
                Salir
              </button>
            </>
          ) : (
            <>
              {manLinks.map(l => (
                <Link key={l.to} to={l.to}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(l.to) ? 'text-white bg-white/[0.06]' : 'text-white/40 hover:text-white/80 hover:bg-white/[0.04]'
                  }`}>
                  {l.icon}
                  {l.label}
                </Link>
              ))}
              <button onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white/25 hover:text-red-400 hover:bg-red-500/[0.06] transition-colors ml-2">
                <IconLogout />
                Salir
              </button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-9 h-9 rounded-lg hover:bg-white/[0.06] transition gap-[5px]"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Menú">
          <span className={`block w-5 h-[1.5px] bg-white/60 rounded-full transition-all duration-200 origin-center ${menuOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
          <span className={`block w-5 h-[1.5px] bg-white/60 rounded-full transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-[1.5px] bg-white/60 rounded-full transition-all duration-200 origin-center ${menuOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden border-t border-white/[0.05] overflow-hidden transition-all duration-250 ${menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-3 py-3 space-y-0.5 bg-[#09090B]">
          {!user ? (
            <>
              <Link to="/login" className="flex items-center gap-3 px-4 py-3 text-white/50 font-medium rounded-xl hover:bg-white/[0.04] hover:text-white/80 transition text-sm">
                Iniciar sesión
              </Link>
              <Link to="/register" className="flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white font-semibold rounded-xl text-sm text-center hover:bg-pink-600 transition">
                Registrarse
              </Link>
            </>
          ) : user.role === 'woman' ? (
            <>
              {womanLinks.map(l => (
                <Link key={l.to} to={l.to} onClick={l.onClear}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition ${
                    isActive(l.to) ? 'bg-white/[0.06] text-white' : 'text-white/40 hover:bg-white/[0.04] hover:text-white/70'
                  }`}>
                  <span className="flex items-center gap-3">{l.icon}{l.label}</span>
                  {l.badge > 0 && (
                    <span className="bg-primary text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                      {l.badge > 9 ? '9+' : l.badge}
                    </span>
                  )}
                </Link>
              ))}
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-white/25 rounded-xl hover:bg-red-500/[0.06] hover:text-red-400 transition text-sm font-medium">
                <IconLogout />Cerrar sesión
              </button>
            </>
          ) : (
            <>
              {manLinks.map(l => (
                <Link key={l.to} to={l.to}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                    isActive(l.to) ? 'bg-white/[0.06] text-white' : 'text-white/40 hover:bg-white/[0.04] hover:text-white/70'
                  }`}>
                  {l.icon}{l.label}
                </Link>
              ))}
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-white/25 rounded-xl hover:bg-red-500/[0.06] hover:text-red-400 transition text-sm font-medium">
                <IconLogout />Cerrar sesión
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
