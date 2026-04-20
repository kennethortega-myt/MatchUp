import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-4 pt-20 pb-16 text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
          Encuentra tu <span className="text-primary">conexión real</span> 💘
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          Las mujeres comparten su historia. Los hombres descubren perfiles reales después de conectar.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register?role=woman"
            className="bg-primary text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-pink-600 transition shadow-lg"
          >
            Soy Mujer — Crear Perfil
          </Link>
          <Link
            to="/register?role=man"
            className="bg-gray-900 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-gray-700 transition shadow-lg"
          >
            Soy Hombre — Explorar
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-4 pb-20 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: '📸', title: 'Fotos reales', desc: 'Las mujeres suben hasta 8 fotos y controlan quién ve su perfil.' },
          { icon: '🔒', title: 'Privacidad total', desc: 'Los datos privados solo se revelan cuando la mujer acepta una solicitud.' },
          { icon: '💳', title: 'Acceso premium', desc: 'Los hombres activan su suscripción y empiezan a conectar.' },
        ].map((f) => (
          <div key={f.title} className="bg-white rounded-2xl p-6 shadow-sm text-center">
            <div className="text-4xl mb-3">{f.icon}</div>
            <h3 className="font-bold text-gray-800 mb-2">{f.title}</h3>
            <p className="text-gray-500 text-sm">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
