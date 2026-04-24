import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const cards = [
  { to: '/woman/profile',  icon: '✏️', title: 'Mi Perfil',      desc: 'Edita tu información personal',    color: 'from-pink-50 to-rose-50 border-pink-100',    ring: 'group-hover:ring-pink-300' },
  { to: '/woman/requests', icon: '💌', title: 'Solicitudes',     desc: 'Acepta o rechaza solicitudes',      color: 'from-purple-50 to-pink-50 border-purple-100', ring: 'group-hover:ring-purple-300' },
  { to: '/woman/gifts',    icon: '🎁', title: 'Mis Regalos',     desc: 'Regalos recibidos y tu balance',    color: 'from-amber-50 to-yellow-50 border-amber-100', ring: 'group-hover:ring-amber-300' },
  { to: '/woman/preview',  icon: '👁️', title: 'Vista Pública',  desc: 'Cómo te ven los hombres',           color: 'from-blue-50 to-indigo-50 border-blue-100',   ring: 'group-hover:ring-blue-300' },
]

export default function WomanDashboard() {
  const { user } = useAuth()
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm text-pink-400 font-semibold mb-1">Bienvenida de vuelta 👋</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800">Panel principal</h1>
          <p className="text-gray-400 text-sm mt-1 truncate">{user?.email}</p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {cards.map(card => (
            <Link
              key={card.to}
              to={card.to}
              className={`group bg-gradient-to-br ${card.color} border rounded-2xl p-4 sm:p-6 hover:shadow-card-hover transition ring-2 ring-transparent ${card.ring} duration-200`}
            >
              <div className="text-2xl sm:text-3xl mb-3">{card.icon}</div>
              <h2 className="font-bold text-gray-800 text-sm sm:text-base mb-0.5">{card.title}</h2>
              <p className="text-gray-500 text-xs leading-snug hidden sm:block">{card.desc}</p>
            </Link>
          ))}
        </div>

        {/* Quick tip */}
        <div className="mt-6 bg-white/80 backdrop-blur-sm border border-pink-100 rounded-2xl px-5 py-4 flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">💡</span>
          <div>
            <p className="text-sm font-semibold text-gray-800">Tip: completa tu perfil</p>
            <p className="text-xs text-gray-500 mt-0.5">Los perfiles con foto y bio reciben hasta 5x más solicitudes.</p>
          </div>
          <Link to="/woman/profile" className="ml-auto flex-shrink-0 text-xs text-primary font-semibold hover:underline">
            Editar →
          </Link>
        </div>
      </div>
    </div>
  )
}
