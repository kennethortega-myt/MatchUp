import { Link } from 'react-router-dom'
import AgaraLogo from '../components/AgaraLogo'

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
      </svg>
    ),
    label: 'Perfiles verificados',
    desc: 'Hasta 6 fotos reales por perfil. Sin filtros, sin bots, sin sorpresas desagradables.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
      </svg>
    ),
    label: 'Privacidad por diseño',
    desc: 'Tu perfil completo solo se revela cuando decides aceptar una solicitud.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
    label: 'Membresía de calidad',
    desc: 'La suscripción filtra a los no comprometidos. Solo llegan quienes van en serio.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
      </svg>
    ),
    label: 'Regalos con intención',
    desc: 'Una forma elegante de mostrar interés genuino antes de que ocurra la conexión.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
    label: 'Tu tiempo vale',
    desc: 'Las mujeres reciben el 30% de cada regalo. La atención merece retribución real.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    label: 'Sin algoritmos ocultos',
    desc: 'No hay ranking ni feed manipulado. El match ocurre cuando ambas personas lo deciden.',
  },
]

const womanSteps = [
  'Crea tu perfil con hasta 6 fotos verificadas',
  'Apareces en búsquedas de miembros activos',
  'Tú decides quién accede a tu perfil completo',
  'Acepta conexiones, recibe regalos y genera ingresos',
]

const manSteps = [
  'Activa tu membresía premium',
  'Explora perfiles auténticos y verificados',
  'Envía solicitudes con mensaje y regalo opcional',
  'Cuando te aceptan, accedes al perfil completo',
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#070509] text-[#F5F0E8] overflow-x-hidden">

      {/* ───── HERO ───── */}
      <section className="relative min-h-screen flex flex-col justify-center items-center px-6 text-center overflow-hidden">

        {/* Background glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse,rgba(201,168,76,0.08)_0%,transparent_65%)] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[300px] bg-[radial-gradient(ellipse,rgba(124,58,237,0.07)_0%,transparent_65%)] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-[radial-gradient(ellipse,rgba(201,168,76,0.05)_0%,transparent_65%)] pointer-events-none" />

        {/* Fine grid */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(rgba(201,168,76,1) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,1) 1px,transparent 1px)', backgroundSize: '80px 80px' }} />

        <div className="relative max-w-5xl mx-auto">
          {/* Logo mark */}
          <div className="flex justify-center mb-8">
            <AgaraLogo size={64} />
          </div>

          {/* Eyebrow pill */}
          <div className="inline-flex items-center gap-2.5 border border-primary/20 bg-primary/[0.06] backdrop-blur-sm px-5 py-2 rounded-full mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-glow-pulse" />
            <span className="text-[11px] text-primary/80 tracking-[0.22em] uppercase font-semibold">Plataforma exclusiva · Solo para quienes eligen bien</span>
          </div>

          {/* Main headline */}
          <h1 className="text-[clamp(3rem,9vw,7.5rem)] font-black leading-[0.88] tracking-[-0.04em] mb-8">
            <span className="block text-[#F5F0E8]/85">Cada conexión</span>
            <span className="block text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg, #E0C070 0%, #C9A84C 40%, #A07830 100%)' }}>
              es una decisión.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-[#F5F0E8]/30 max-w-lg mx-auto leading-relaxed mb-14 font-light tracking-wide">
            Privacidad real. Perfiles verificados.<br />Conexiones que respetan tu tiempo y tus estándares.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto sm:max-w-none">
            <Link to="/register?role=woman"
              className="group inline-flex items-center justify-center gap-2.5 px-9 py-4 rounded-xl text-sm font-bold tracking-widest uppercase transition-all active:scale-[0.97]"
              style={{ background: 'linear-gradient(135deg, #E0C070, #C9A84C, #A07830)', color: '#0F0C18', boxShadow: '0 8px 30px rgba(201,168,76,0.25)' }}>
              Soy Mujer — Crear Perfil
              <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
            </Link>
            <Link to="/register?role=man"
              className="group inline-flex items-center justify-center gap-2.5 border border-primary/20 bg-primary/[0.06] hover:bg-primary/[0.12] hover:border-primary/35 text-[#F5F0E8]/70 hover:text-[#F5F0E8] px-9 py-4 rounded-xl text-sm font-bold tracking-widest uppercase transition-all active:scale-[0.97]">
              Soy Hombre — Activar Membresía
              <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
            </Link>
          </div>

          <p className="mt-6 text-[11px] text-[#F5F0E8]/12 tracking-widest uppercase">
            Registro gratuito · Sin tarjeta de crédito
          </p>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-20">
          <span className="text-[10px] tracking-[0.28em] uppercase text-primary">Descubrir</span>
          <svg className="w-4 h-4 animate-bounce text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </section>

      {/* ───── STATS ───── */}
      <section className="border-y border-primary/[0.08] bg-primary/[0.02]">
        <div className="max-w-4xl mx-auto px-6 py-12 grid grid-cols-3 divide-x divide-primary/[0.1]">
          {[
            { val: '100%', label: 'Privacidad garantizada' },
            { val: '30%',  label: 'Ingresos para mujeres'  },
            { val: '0',    label: 'Perfiles falsos'         },
          ].map(s => (
            <div key={s.label} className="text-center px-4 sm:px-8">
              <p className="text-3xl sm:text-4xl font-black tabular-nums"
                style={{ background: 'linear-gradient(135deg, #E0C070, #C9A84C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {s.val}
              </p>
              <p className="text-[10px] text-[#F5F0E8]/25 mt-2 tracking-widest uppercase">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───── FEATURES ───── */}
      <section className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-16">
            <span className="eyebrow">La plataforma</span>
            <h2 className="text-4xl sm:text-5xl font-black leading-[1.05] tracking-tight text-[#F5F0E8]/90">
              Diseñado para quienes
              <span className="text-[#F5F0E8]/22"> no hacen concesiones.</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-primary/[0.07] rounded-2xl overflow-hidden border border-primary/[0.08]">
            {features.map(f => (
              <div key={f.label}
                className="group bg-[#070509] p-7 hover:bg-primary/[0.04] transition-colors duration-300 cursor-default">
                <div className="w-10 h-10 rounded-lg border border-primary/20 bg-primary/[0.06] flex items-center justify-center text-primary/60 group-hover:text-primary group-hover:border-primary/40 group-hover:bg-primary/[0.12] transition-all mb-5">
                  {f.icon}
                </div>
                <h3 className="font-bold text-[#F5F0E8]/80 text-sm mb-2 tracking-wide">{f.label}</h3>
                <p className="text-[#F5F0E8]/28 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── HOW IT WORKS ───── */}
      <section className="py-28 px-6">
        <div className="divider-gold max-w-6xl mx-auto mb-28" />
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-16">
            <span className="eyebrow">El proceso</span>
            <h2 className="text-4xl sm:text-5xl font-black leading-[1.05] tracking-tight text-[#F5F0E8]/90">
              Simple. Directo.
              <span className="text-[#F5F0E8]/22"> Sin rodeos.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Women card */}
            <div className="relative border border-primary/12 bg-[#0F0C18] rounded-2xl p-8 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(201,168,76,0.05),transparent)]" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 border border-primary/25 bg-primary/[0.08] text-primary rounded-full px-3 py-1.5 text-[11px] font-bold tracking-widest uppercase mb-8">
                  <span className="w-1 h-1 rounded-full bg-primary" />Para Mujeres
                </div>
                <ol className="space-y-5">
                  {womanSteps.map((step, i) => (
                    <li key={step} className="flex items-start gap-4">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full border border-primary/35 bg-primary/[0.08] text-primary text-[11px] font-black flex items-center justify-center mt-0.5">{i+1}</span>
                      <span className="text-[#F5F0E8]/45 text-sm leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Men card */}
            <div className="relative border border-secondary/12 bg-[#0F0C18] rounded-2xl p-8 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(124,58,237,0.06),transparent)]" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 border border-secondary/30 bg-secondary/[0.08] text-violet-400 rounded-full px-3 py-1.5 text-[11px] font-bold tracking-widest uppercase mb-8">
                  <span className="w-1 h-1 rounded-full bg-violet-400" />Para Hombres
                </div>
                <ol className="space-y-5">
                  {manSteps.map((step, i) => (
                    <li key={step} className="flex items-start gap-4">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full border border-violet-500/35 bg-violet-500/[0.08] text-violet-400 text-[11px] font-black flex items-center justify-center mt-0.5">{i+1}</span>
                      <span className="text-[#F5F0E8]/45 text-sm leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── FINAL CTA ───── */}
      <section className="relative py-36 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_65%_at_50%_50%,rgba(201,168,76,0.08),transparent_70%)] pointer-events-none" />
        <div className="divider-gold max-w-6xl mx-auto mb-36" />
        <div className="relative max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <AgaraLogo size={52} />
          </div>
          <span className="eyebrow">Únete ahora</span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1] tracking-tight text-[#F5F0E8]/90 mb-6">
            Tu estándar merece<br />
            <span style={{ background: 'linear-gradient(135deg, #E0C070, #C9A84C, #A07830)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              una plataforma a su nivel.
            </span>
          </h2>
          <p className="text-[#F5F0E8]/25 mb-14 max-w-sm mx-auto leading-relaxed">
            Miles de personas eligiendo calidad sobre cantidad. La pregunta es cuándo empiezas tú.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register?role=woman"
              className="inline-flex items-center justify-center gap-2 px-9 py-4 rounded-xl text-sm font-bold tracking-widest uppercase transition-all active:scale-[0.97]"
              style={{ background: 'linear-gradient(135deg, #E0C070, #C9A84C, #A07830)', color: '#0F0C18', boxShadow: '0 8px 30px rgba(201,168,76,0.2)' }}>
              Crear perfil — Mujer
            </Link>
            <Link to="/register?role=man"
              className="inline-flex items-center justify-center gap-2 border border-primary/20 bg-primary/[0.06] hover:bg-primary/[0.12] text-[#F5F0E8]/60 hover:text-[#F5F0E8] px-9 py-4 rounded-xl text-sm font-bold tracking-widest uppercase transition-all active:scale-[0.97]">
              Activar membresía
            </Link>
          </div>
        </div>
      </section>

      {/* ───── FOOTER ───── */}
      <footer className="border-t border-primary/[0.07] bg-black/50 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <AgaraLogo size={28} />
            <div>
              <p className="font-black text-[#F5F0E8] text-base tracking-tight">Agara</p>
              <p className="text-[10px] text-[#F5F0E8]/15 tracking-wide">Conexiones reales, privacidad garantizada.</p>
            </div>
          </div>
          <div className="flex gap-8 text-xs text-[#F5F0E8]/18">
            <Link to="/register" className="hover:text-primary transition-colors">Registrarse</Link>
            <Link to="/login" className="hover:text-primary transition-colors">Iniciar sesión</Link>
          </div>
          <p className="text-[11px] text-[#F5F0E8]/10">© {new Date().getFullYear()} Agara</p>
        </div>
      </footer>
    </div>
  )
}
