import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getSubscriptionStatus, getManProfile } from '../../api'
import type { Subscription, ManProfile } from '../../types'

const menuCards = (isActive: boolean) => [
  { to: '/man/browse',    icon: '🔍', title: 'Explorar',     desc: 'Descubre perfiles',        locked: !isActive, color: 'from-blue-50 to-cyan-50 border-blue-100',     ring: 'group-hover:ring-blue-300' },
  { to: '/man/requests',  icon: '💘', title: 'Mis Matches',  desc: 'Perfiles desbloqueados',   locked: false,     color: 'from-pink-50 to-rose-50 border-pink-100',     ring: 'group-hover:ring-pink-300' },
  { to: '/man/gifts',     icon: '🎁', title: 'Regalos',      desc: 'Historial de regalos',     locked: false,     color: 'from-amber-50 to-yellow-50 border-amber-100', ring: 'group-hover:ring-amber-300' },
  { to: '/man/profile',   icon: '👤', title: 'Mi Perfil',    desc: 'Editar información',       locked: false,     color: 'from-indigo-50 to-blue-50 border-indigo-100', ring: 'group-hover:ring-indigo-300' },
  { to: '/man/subscribe', icon: '💳', title: 'Suscripción',  desc: isActive ? 'Gestionar plan' : 'Activar acceso', locked: false, color: 'from-emerald-50 to-teal-50 border-emerald-100', ring: 'group-hover:ring-emerald-300' },
]

export default function ManDashboard() {
  const { user } = useAuth()
  const [sub, setSub] = useState<Subscription | null>(null)
  const [profile, setProfile] = useState<ManProfile | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    Promise.all([
      getSubscriptionStatus().then(r => { if (r.data?.status) setSub(r.data) }).catch(() => {}),
      getManProfile().then(r => setProfile(r.data)).catch(() => {}),
    ]).finally(() => setLoaded(true))
  }, [])

  const isActive = sub?.status === 'active'
  const primaryPhoto = profile?.photos.find(p => p.is_primary) || profile?.photos[0]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">

        {/* Header */}
        <div className="flex items-center gap-4 mb-7">
          <div className="flex-shrink-0">
            {primaryPhoto ? (
              <img
                src={primaryPhoto.photo_url}
                alt="foto"
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover ring-2 ring-blue-200"
              />
            ) : (
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold">
                {(profile?.first_name || user?.email || 'U')[0].toUpperCase()}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-xs text-blue-400 font-semibold">Bienvenido de vuelta 👋</p>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-800 truncate">
              {profile?.first_name || 'Tu perfil'}
            </h1>
            <p className="text-gray-400 text-xs truncate">{user?.email}</p>
          </div>
        </div>

        {/* Subscription banner */}
        {loaded && !isActive && (
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl p-5 mb-5 shadow-lg shadow-blue-200">
            <h2 className="text-base font-bold mb-1">Activa tu acceso premium</h2>
            <p className="opacity-80 text-sm mb-4">Suscríbete para ver perfiles y enviar solicitudes de match.</p>
            <Link
              to="/man/subscribe"
              className="inline-block bg-white text-blue-600 font-bold px-5 py-2 rounded-xl text-sm hover:bg-blue-50 transition active:scale-95"
            >
              Ver planes →
            </Link>
          </div>
        )}

        {loaded && isActive && sub && (
          <div className="bg-white border border-emerald-200 rounded-2xl p-4 mb-5 flex items-center gap-3 shadow-sm">
            <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 font-bold flex-shrink-0">
              ✓
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-emerald-800 text-sm">
                Plan {sub.plan === 'monthly' ? 'mensual' : 'anual'} activo
              </p>
              <p className="text-emerald-600 text-xs">
                Vence: {new Date(sub.expires_at).toLocaleDateString('es-PE')}
              </p>
            </div>
          </div>
        )}

        {/* Menu grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {menuCards(isActive).map(card => (
            <Link
              key={card.to}
              to={card.locked ? '/man/subscribe' : card.to}
              className={`group bg-gradient-to-br ${card.color} border rounded-2xl p-4 sm:p-5 transition ring-2 ring-transparent ${card.ring} duration-200 ${card.locked ? 'opacity-60' : 'hover:shadow-card-hover'}`}
            >
              <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">
                {card.locked ? '🔒' : card.icon}
              </div>
              <h2 className="font-bold text-gray-800 text-sm mb-0.5">{card.title}</h2>
              <p className="text-gray-400 text-xs hidden sm:block">{card.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
