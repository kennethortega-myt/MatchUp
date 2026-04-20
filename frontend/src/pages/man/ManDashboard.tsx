import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getSubscriptionStatus, getManProfile } from '../../api'
import type { Subscription, ManProfile } from '../../types'

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
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="relative">
          {primaryPhoto ? (
            <img
              src={primaryPhoto.photo_url}
              alt="foto"
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-200"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold">
              {(profile?.first_name || user?.email || 'U')[0].toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Hola, {profile?.first_name || 'bienvenido'} 👋
          </h1>
          <p className="text-gray-400 text-sm">{user?.email}</p>
        </div>
      </div>

      {/* Subscription banner */}
      {loaded && !isActive && (
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-bold mb-1">Activa tu acceso premium</h2>
          <p className="opacity-80 text-sm mb-4">Suscríbete para ver perfiles y enviar solicitudes de match.</p>
          <Link to="/man/subscribe" className="bg-white text-blue-600 font-semibold px-5 py-2 rounded-xl text-sm hover:bg-blue-50 transition inline-block">
            Ver planes →
          </Link>
        </div>
      )}

      {loaded && isActive && sub && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <span className="text-emerald-500 text-xl">✓</span>
          <div>
            <p className="font-semibold text-emerald-800 text-sm">Plan {sub.plan === 'monthly' ? 'mensual' : 'anual'} activo</p>
            <p className="text-emerald-600 text-xs">Vence: {new Date(sub.expires_at).toLocaleDateString('es-PE')}</p>
          </div>
        </div>
      )}

      {/* Menu grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { to: '/man/browse',   icon: '🔍', title: 'Explorar',      desc: 'Descubre perfiles',        locked: !isActive, accent: 'border-blue-100 hover:border-blue-400' },
          { to: '/man/matches',  icon: '💘', title: 'Mis Matches',   desc: 'Perfiles desbloqueados',   locked: false,     accent: 'border-pink-100 hover:border-pink-400' },
          { to: '/man/gifts',    icon: '🎁', title: 'Regalos',       desc: 'Historial de regalos',     locked: false,     accent: 'border-yellow-100 hover:border-yellow-400' },
          { to: '/man/profile',  icon: '👤', title: 'Mi Perfil',     desc: 'Editar información',       locked: false,     accent: 'border-indigo-100 hover:border-indigo-400' },
          { to: '/man/subscribe',icon: '💳', title: 'Suscripción',   desc: isActive ? 'Gestionar plan' : 'Activar acceso', locked: false, accent: 'border-green-100 hover:border-green-400' },
        ].map(card => (
          <Link
            key={card.to}
            to={card.locked ? '/man/subscribe' : card.to}
            className={`bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition border-2 ${card.locked ? 'border-gray-100 opacity-60' : card.accent}`}
          >
            <div className="text-3xl mb-3">{card.locked ? '🔒' : card.icon}</div>
            <h2 className="font-semibold text-gray-800 mb-0.5 text-sm">{card.title}</h2>
            <p className="text-gray-400 text-xs">{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
