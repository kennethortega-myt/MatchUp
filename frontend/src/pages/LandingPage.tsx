import { Link } from 'react-router-dom'

const features = [
  {
    icon: '📸',
    title: 'Fotos reales',
    desc: 'Las mujeres suben hasta 6 fotos y controlan quién ve su perfil completo.',
    color: 'from-pink-50 to-rose-50 border-pink-100',
    iconBg: 'bg-pink-100',
  },
  {
    icon: '🔒',
    title: 'Privacidad total',
    desc: 'Tus datos privados solo se revelan cuando decides aceptar una solicitud.',
    color: 'from-purple-50 to-indigo-50 border-purple-100',
    iconBg: 'bg-purple-100',
  },
  {
    icon: '💳',
    title: 'Acceso premium',
    desc: 'Los hombres activan su suscripción y comienzan a enviar solicitudes de match.',
    color: 'from-blue-50 to-cyan-50 border-blue-100',
    iconBg: 'bg-blue-100',
  },
  {
    icon: '🎁',
    title: 'Envía regalos',
    desc: 'Destácate enviando regalos virtuales junto a tu solicitud de match.',
    color: 'from-amber-50 to-yellow-50 border-amber-100',
    iconBg: 'bg-amber-100',
  },
  {
    icon: '💰',
    title: 'Gana dinero',
    desc: 'Las mujeres reciben el 30% del valor de cada regalo enviado por sus admiradores.',
    color: 'from-emerald-50 to-teal-50 border-emerald-100',
    iconBg: 'bg-emerald-100',
  },
  {
    icon: '💘',
    title: 'Conexiones reales',
    desc: 'Hombres y mujeres verificados buscando conexiones auténticas.',
    color: 'from-red-50 to-pink-50 border-red-100',
    iconBg: 'bg-red-100',
  },
]

const steps = [
  { role: 'Mujeres', emoji: '👩', steps: ['Crea tu perfil con fotos', 'Aparece en las búsquedas', 'Acepta o rechaza solicitudes', 'Recibe regalos y gana'] },
  { role: 'Hombres', emoji: '👨', steps: ['Activa tu suscripción', 'Explora perfiles reales', 'Envía solicitudes y regalos', 'Desbloquea los matches aceptados'] },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-pink-50 via-rose-50 to-purple-100 pt-16 pb-20 px-4 text-center overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-pink-200/40 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

        <div className="relative max-w-3xl mx-auto">
          <span className="inline-block bg-pink-100 text-primary text-xs font-bold px-3 py-1 rounded-full mb-5 tracking-wide uppercase">
            💘 La app de citas con privacidad real
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-5">
            Encuentra tu{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">
              conexión real
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 mb-10 max-w-xl mx-auto leading-relaxed">
            Las mujeres controlan su privacidad. Los hombres descubren perfiles auténticos después de conectar.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/register?role=woman"
              className="bg-gradient-to-r from-primary to-pink-600 text-white px-8 py-4 rounded-2xl text-base font-bold hover:from-pink-600 hover:to-rose-600 transition shadow-lg shadow-pink-200 active:scale-95"
            >
              Soy Mujer — Crear Perfil
            </Link>
            <Link
              to="/register?role=man"
              className="bg-gray-900 text-white px-8 py-4 rounded-2xl text-base font-bold hover:bg-gray-700 transition shadow-lg shadow-gray-200 active:scale-95"
            >
              Soy Hombre — Explorar
            </Link>
          </div>

          <p className="mt-5 text-xs text-gray-400">
            Registro gratuito · Sin tarjeta de crédito requerida
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-y border-gray-100 py-8 px-4">
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-4 text-center">
          {[
            { value: '100%', label: 'Privacidad' },
            { value: '30%', label: 'Ganancias mujer' },
            { value: '24/7', label: 'Disponible' },
          ].map(s => (
            <div key={s.label}>
              <p className="text-2xl sm:text-3xl font-extrabold text-primary">{s.value}</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">
              Todo lo que necesitas
            </h2>
            <p className="text-gray-500 max-w-md mx-auto text-sm sm:text-base">
              Una plataforma diseñada para conexiones auténticas y seguras.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map(f => (
              <div
                key={f.title}
                className={`bg-gradient-to-br ${f.color} border rounded-2xl p-5 hover:shadow-md transition`}
              >
                <div className={`w-11 h-11 ${f.iconBg} rounded-2xl flex items-center justify-center text-2xl mb-3`}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-gray-800 mb-1">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">¿Cómo funciona?</h2>
            <p className="text-gray-500 text-sm sm:text-base">Pasos simples para empezar a conectar</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {steps.map(role => (
              <div key={role.role} className="bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-100 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-3xl">{role.emoji}</span>
                  <h3 className="text-lg font-bold text-gray-800">{role.role}</h3>
                </div>
                <ol className="space-y-3">
                  {role.steps.map((step, i) => (
                    <li key={step} className="flex items-center gap-3">
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shadow-sm">
                        {i + 1}
                      </span>
                      <span className="text-gray-700 text-sm font-medium">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary to-pink-700 text-white text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">¿Listo para conectar?</h2>
          <p className="text-pink-100 mb-8 text-sm sm:text-base">
            Únete gratis hoy y comienza a construir conexiones reales.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/register?role=woman"
              className="bg-white text-primary font-bold px-7 py-3.5 rounded-2xl hover:bg-pink-50 transition shadow-lg active:scale-95 text-sm sm:text-base"
            >
              Crear perfil de mujer
            </Link>
            <Link
              to="/register?role=man"
              className="bg-white/20 text-white font-bold px-7 py-3.5 rounded-2xl hover:bg-white/30 transition border border-white/30 active:scale-95 text-sm sm:text-base"
            >
              Suscribirse como hombre
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-4 text-center text-xs">
        <p className="font-bold text-white text-base mb-1">MatchUp 💘</p>
        <p className="mb-3">Conexiones reales, privacidad garantizada.</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/register" className="hover:text-white transition">Registrarse</Link>
          <Link to="/login" className="hover:text-white transition">Iniciar sesión</Link>
        </div>
        <p className="mt-4 text-gray-600">© {new Date().getFullYear()} MatchUp. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}
