import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { useTheme, type Theme } from '../context/ThemeContext'
import { getPendingRequests, getReceivedGifts } from '../api'
import AgaraLogo from './AgaraLogo'

const THEMES: { value: Theme; bg: string; label: string }[] = [
  { value: 'dark',  bg: '#070509', label: 'Oscuro'    },
  { value: 'pink',  bg: '#E0337A', label: 'Rosa'      },
  { value: 'white', bg: '#F7F7F8', label: 'Blanco'    },
]

function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  return (
    <div className="flex items-center gap-1 px-1.5 py-1 rounded-lg border border-white/[0.07] bg-white/[0.03]">
      {THEMES.map(t => (
        <button
          key={t.value}
          onClick={() => setTheme(t.value)}
          title={t.label}
          className={`w-4 h-4 rounded-full transition-all duration-150 ${
            theme === t.value ? 'ring-2 ring-primary ring-offset-1 ring-offset-transparent scale-110' : 'opacity-60 hover:opacity-100'
          }`}
          style={{ background: t.bg, border: t.value === 'white' ? '1px solid rgba(0,0,0,0.15)' : 'none' }}
        />
      ))}
    </div>
  )
}

function Badge({ count }: { count: number }) {
  if (count === 0) return null
  return (
    <span className="absolute -top-1 -right-1.5 bg-primary text-[#0F0C18] text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center leading-none">
      {count > 9 ? '9+' : count}
    </span>
  )
}

const IcoSearch = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
const IcoHeart = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>
const IcoUser = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
const IcoCard = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" /></svg>
const IcoBell = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" /></svg>
const IcoGift = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" /></svg>
const IcoEye = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
const IcoLogout = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" /></svg>

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
            toast('Nueva solicitud de match', { style: { background: '#0F0C18', color: '#F5F0E8', border: '1px solid rgba(201,168,76,0.25)' } })
          if (newGifts > prevGifts.current)
            toast('Recibiste un nuevo regalo', { style: { background: '#0F0C18', color: '#F5F0E8', border: '1px solid rgba(201,168,76,0.25)' } })
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
  const isActive = (to: string) => location.pathname === to

  const womanLinks = [
    { to: '/woman/profile',  label: 'Mi Perfil',     icon: <IcoUser />,  badge: 0 },
    { to: '/woman/requests', label: 'Solicitudes',   icon: <IcoBell />,  badge: pendingCount, onClear: () => setPendingCount(0) },
    { to: '/woman/gifts',    label: 'Regalos',       icon: <IcoGift />,  badge: giftCount,   onClear: () => setGiftCount(0) },
    { to: '/woman/preview',  label: 'Vista pública', icon: <IcoEye />,   badge: 0 },
  ]

  const manLinks = [
    { to: '/man/browse',    label: 'Explorar',  icon: <IcoSearch /> },
    { to: '/man/requests',  label: 'Matches',   icon: <IcoHeart /> },
    { to: '/man/profile',   label: 'Mi Perfil', icon: <IcoUser /> },
    { to: '/man/subscribe', label: 'Membresía', icon: <IcoCard /> },
  ]

  return (
    <nav className="bg-[#070509]/96 backdrop-blur-md border-b border-primary/[0.06] sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <AgaraLogo size={30} />
          <span className="font-black text-[#F5F0E8] tracking-tight text-base group-hover:text-primary transition-colors">
            Agara
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-0.5">
          {!user ? (
            <>
              <ThemeSwitcher />
              <Link to="/login"
                className="px-4 py-2 text-sm text-[#F5F0E8]/35 hover:text-[#F5F0E8]/70 font-medium transition-colors rounded-lg hover:bg-white/[0.04]">
                Iniciar sesión
              </Link>
              <Link to="/register"
                className="ml-2 text-[#0F0C18] px-4 py-2 rounded-lg text-sm font-bold transition-all"
                style={{ background: 'linear-gradient(135deg, #E0C070, #C9A84C)', boxShadow: '0 2px 12px rgba(201,168,76,0.2)' }}>
                Registrarse
              </Link>
            </>
          ) : user.role === 'woman' ? (
            <>
              {womanLinks.map(l => (
                <Link key={l.to} to={l.to} onClick={l.onClear}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(l.to)
                      ? 'text-primary bg-primary/[0.08]'
                      : 'text-[#F5F0E8]/35 hover:text-[#F5F0E8]/70 hover:bg-white/[0.04]'
                  }`}>
                  {l.icon}{l.label}
                  <Badge count={l.badge} />
                </Link>
              ))}
              <ThemeSwitcher />
              <button onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-[#F5F0E8]/20 hover:text-red-400 hover:bg-red-500/[0.06] transition-colors ml-1">
                <IcoLogout />Salir
              </button>
            </>
          ) : (
            <>
              {manLinks.map(l => (
                <Link key={l.to} to={l.to}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(l.to)
                      ? 'text-primary bg-primary/[0.08]'
                      : 'text-[#F5F0E8]/35 hover:text-[#F5F0E8]/70 hover:bg-white/[0.04]'
                  }`}>
                  {l.icon}{l.label}
                </Link>
              ))}
              <ThemeSwitcher />
              <button onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-[#F5F0E8]/20 hover:text-red-400 hover:bg-red-500/[0.06] transition-colors ml-1">
                <IcoLogout />Salir
              </button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-9 h-9 rounded-lg hover:bg-primary/[0.08] transition gap-[5px]"
          onClick={() => setMenuOpen(o => !o)} aria-label="Menú">
          <span className={`block w-4.5 h-[1.5px] bg-[#F5F0E8]/50 rounded-full transition-all duration-200 origin-center ${menuOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
          <span className={`block w-4.5 h-[1.5px] bg-[#F5F0E8]/50 rounded-full transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-4.5 h-[1.5px] bg-[#F5F0E8]/50 rounded-full transition-all duration-200 origin-center ${menuOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
        </button>
      </div>

      {/* Mobile dropdown */}
      <div className={`md:hidden border-t border-primary/[0.06] overflow-hidden transition-all duration-200 ${menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-3 py-3 space-y-0.5 bg-[#070509]">
          {!user ? (
            <>
              <Link to="/login" className="flex items-center gap-3 px-4 py-3 text-[#F5F0E8]/40 font-medium rounded-xl hover:bg-white/[0.04] hover:text-[#F5F0E8]/70 transition text-sm">
                Iniciar sesión
              </Link>
              <Link to="/register"
                className="flex items-center justify-center px-4 py-3 font-bold rounded-xl text-sm text-center text-[#0F0C18]"
                style={{ background: 'linear-gradient(135deg, #E0C070, #C9A84C)' }}>
                Registrarse
              </Link>
            </>
          ) : user.role === 'woman' ? (
            <>
              {womanLinks.map(l => (
                <Link key={l.to} to={l.to} onClick={l.onClear}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition ${
                    isActive(l.to) ? 'bg-primary/[0.08] text-primary' : 'text-[#F5F0E8]/35 hover:bg-white/[0.04] hover:text-[#F5F0E8]/65'
                  }`}>
                  <span className="flex items-center gap-3">{l.icon}{l.label}</span>
                  {l.badge > 0 && <span className="bg-primary text-[#0F0C18] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">{l.badge > 9 ? '9+' : l.badge}</span>}
                </Link>
              ))}
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-[#F5F0E8]/20 rounded-xl hover:bg-red-500/[0.06] hover:text-red-400 transition text-sm font-medium">
                <IcoLogout />Cerrar sesión
              </button>
            </>
          ) : (
            <>
              {manLinks.map(l => (
                <Link key={l.to} to={l.to}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                    isActive(l.to) ? 'bg-primary/[0.08] text-primary' : 'text-[#F5F0E8]/35 hover:bg-white/[0.04] hover:text-[#F5F0E8]/65'
                  }`}>
                  {l.icon}{l.label}
                </Link>
              ))}
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-[#F5F0E8]/20 rounded-xl hover:bg-red-500/[0.06] hover:text-red-400 transition text-sm font-medium">
                <IcoLogout />Cerrar sesión
              </button>
            </>
          )}
          {/* Theme switcher row */}
          <div className="flex items-center gap-2 px-4 py-3 border-t border-white/[0.04] mt-1">
            <span className="text-[10px] text-[#F5F0E8]/25 uppercase tracking-widest font-bold flex-1">Tema</span>
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </nav>
  )
}
