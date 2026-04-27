import { Link } from 'react-router-dom'

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
      </svg>
    ),
    title: 'Fotos auténticas',
    desc: 'Perfiles verificados con hasta 6 fotos. Sin filtros falsos, sin perfiles vacíos.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
      </svg>
    ),
    title: 'Privacidad absoluta',
    desc: 'Tu información personal permanece oculta hasta que tú decidas aceptar una conexión.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
      </svg>
    ),
    title: 'Acceso premium',
    desc: 'Suscripción exclusiva que garantiza interacciones de calidad y hombres serios.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
      </svg>
    ),
    title: 'Regalos exclusivos',
    desc: 'Destácate con regalos virtuales que demuestran tu nivel de interés genuino.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
    title: 'Genera ingresos',
    desc: 'Las mujeres reciben el 30% del valor de cada regalo. Tu tiempo y atención tienen valor.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
    title: 'Conexiones verificadas',
    desc: 'Usuarios verificados y perfiles curados. Sin bots, sin perfiles falsos.',
  },
]

const steps = [
  {
    role: 'Para Mujeres',
    accent: 'from-rose-500 to-pink-600',
    border: 'border-rose-500/20',
    glow: 'shadow-rose-500/10',
    steps: [
      'Crea tu perfil con hasta 6 fotos',
      'Aparece en búsquedas de hombres premium',
      'Acepta o rechaza solicitudes a tu criterio',
      'Recibe regalos y monetiza tu presencia',
    ],
  },
  {
    role: 'Para Hombres',
    accent: 'from-amber-400 to-yellow-500',
    border: 'border-amber-500/20',
    glow: 'shadow-amber-500/10',
    steps: [
      'Activa tu membresía premium',
      'Explora perfiles auténticos y verificados',
      'Envía solicitudes y regalos destacados',
      'Desbloquea el perfil completo al hacer match',
    ],
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#080808] text-white overflow-x-hidden">

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 text-center overflow-hidden">
        {/* Background gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(233,30,140,0.15),transparent)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-600/5 rounded-full blur-3xl pointer-events-none" />

        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full mb-8">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-xs text-white/60 tracking-widest uppercase font-medium">Plataforma exclusiva de conexiones</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tight mb-6">
            <span className="block text-white">Conexiones</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-400 to-rose-300">
              de alto nivel.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-white/40 mb-12 max-w-xl mx-auto leading-relaxed font-light">
            La plataforma donde la privacidad es un derecho, el tiempo tiene valor
            y las conexiones son completamente reales.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register?role=woman"
              className="group relative inline-flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white px-8 py-4 rounded-xl text-sm font-bold tracking-wide uppercase hover:from-rose-400 hover:to-pink-500 transition-all shadow-xl shadow-rose-500/20 active:scale-95"
            >
              <span>Crear perfil — Mujeres</span>
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
            </Link>
            <Link
              to="/register?role=man"
              className="group inline-flex items-center justify-center gap-2 border border-white/15 bg-white/5 backdrop-blur-sm text-white px-8 py-4 rounded-xl text-sm font-bold tracking-wide uppercase hover:bg-white/10 hover:border-white/25 transition-all active:scale-95"
            >
              <span>Membresía — Hombres</span>
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
            </Link>
          </div>

          <p className="mt-6 text-xs text-white/20 tracking-wide">
            Registro gratuito · Sin tarjeta de crédito requerida
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20">
          <span className="text-xs tracking-widest uppercase">Descubrir</span>
          <svg className="w-4 h-4 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/5 bg-white/[0.02] py-10 px-4">
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-4 text-center">
          {[
            { value: '100%', label: 'Privacidad garantizada' },
            { value: '30%', label: 'Ingresos para mujeres' },
            { value: '0', label: 'Perfiles falsos' },
          ].map(s => (
            <div key={s.label}>
              <p className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">{s.value}</p>
              <p className="text-xs text-white/30 mt-1 tracking-wide uppercase">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs text-rose-400 tracking-widest uppercase font-bold mb-3">La plataforma</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
              Diseñado para quienes<br />
              <span className="text-white/30">no aceptan menos.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map(f => (
              <div
                key={f.title}
                className="group relative border border-white/5 bg-white/[0.03] rounded-2xl p-6 hover:bg-white/[0.06] hover:border-white/10 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4 group-hover:bg-rose-500/20 transition-colors">
                  {f.icon}
                </div>
                <h3 className="font-bold text-white text-base mb-2">{f.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* How it works */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs text-rose-400 tracking-widest uppercase font-bold mb-3">El proceso</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
              Simple. Directo.{' '}
              <span className="text-white/30">Sin rodeos.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {steps.map(role => (
              <div
                key={role.role}
                className={`relative border ${role.border} bg-white/[0.03] rounded-2xl p-8 shadow-2xl ${role.glow}`}
              >
                <div className={`inline-block text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full bg-gradient-to-r ${role.accent} text-black mb-6`}>
                  {role.role}
                </div>
                <ol className="space-y-4">
                  {role.steps.map((step, i) => (
                    <li key={step} className="flex items-start gap-4">
                      <span className={`flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br ${role.accent} text-black text-xs font-black flex items-center justify-center mt-0.5`}>
                        {i + 1}
                      </span>
                      <span className="text-white/60 text-sm leading-relaxed font-medium pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="relative py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_50%,rgba(233,30,140,0.12),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_50%_50%,rgba(233,30,140,0.06),transparent)]" />

        <div className="relative max-w-2xl mx-auto text-center">
          <p className="text-xs text-rose-400 tracking-widest uppercase font-bold mb-4">Únete ahora</p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight mb-6">
            Tu estándar merece<br />una plataforma a tu nivel.
          </h2>
          <p className="text-white/30 mb-12 text-base max-w-md mx-auto">
            Miles de personas eligiendo calidad sobre cantidad. ¿Cuándo empiezas tú?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register?role=woman"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold px-8 py-4 rounded-xl hover:from-rose-400 hover:to-pink-500 transition-all shadow-xl shadow-rose-500/25 active:scale-95 text-sm tracking-wide uppercase"
            >
              Crear perfil de mujer
            </Link>
            <Link
              to="/register?role=man"
              className="inline-flex items-center justify-center gap-2 border border-white/15 bg-white/5 text-white font-bold px-8 py-4 rounded-xl hover:bg-white/10 hover:border-white/25 transition-all active:scale-95 text-sm tracking-wide uppercase"
            >
              Activar membresía
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-black py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-black text-white text-lg tracking-tight">MatchUp</p>
            <p className="text-xs text-white/20 mt-0.5">Conexiones reales, privacidad garantizada.</p>
          </div>
          <div className="flex gap-6 text-xs text-white/25">
            <Link to="/register" className="hover:text-white transition">Registrarse</Link>
            <Link to="/login" className="hover:text-white transition">Iniciar sesión</Link>
          </div>
          <p className="text-xs text-white/15">© {new Date().getFullYear()} MatchUp</p>
        </div>
      </footer>
    </div>
  )
}
