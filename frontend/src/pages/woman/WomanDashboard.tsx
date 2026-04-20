import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function WomanDashboard() {
  const { user } = useAuth()
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Hola 👋</h1>
      <p className="text-gray-500 mb-8">{user?.email}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { to: '/woman/profile',  icon: '✏️', title: 'Mi Perfil',     desc: 'Edita tu información personal' },
          { to: '/woman/photos',   icon: '📸', title: 'Mis Fotos',      desc: 'Sube y gestiona tus fotografías' },
          { to: '/woman/requests', icon: '💌', title: 'Solicitudes',    desc: 'Acepta o rechaza solicitudes' },
          { to: '/woman/gifts',    icon: '🎁', title: 'Mis Regalos',    desc: 'Regalos recibidos y tu balance' },
          { to: '/woman/preview',  icon: '👁️', title: 'Vista Pública', desc: 'Cómo te ven los hombres' },
        ].map(card => (
          <Link key={card.to} to={card.to}
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition border border-pink-50 hover:border-primary">
            <div className="text-3xl mb-3">{card.icon}</div>
            <h2 className="font-semibold text-gray-800 mb-1">{card.title}</h2>
            <p className="text-gray-500 text-sm">{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
