import { Link } from 'react-router-dom'

const features = [
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" /></svg>,
    title: 'Perfiles verificados',
    desc: 'Hasta 6 fotos reales por perfil. Sin filtros, sin engaños, sin sorpresas.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>,
    title: 'Privacidad absoluta',
    desc: 'Tu información personal permanece oculta hasta que tú decidas aceptar una conexión.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" /></svg>,
    title: 'Solo perfiles serios',
    desc: 'La membresía de pago filtra los curiosos. Aquí llegan quienes van en serio.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" /></svg>,
    title: 'Regalos con propósito',
    desc: 'Demuestra intención real con regalos virtuales que complementan tu solicitud.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>,
    title: 'Tu atención tiene valor',
    desc: 'Las mujeres reciben el 30% de cada regalo enviado. El tiempo merece retribución.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>,
    title: 'Conexión inmediata',
    desc: 'Sin algoritmos opacos ni esperas. El match ocurre cuando ambos lo deciden.',
  },
]

const womanSteps = [
  'Crea tu perfil con hasta 6 fotos verificadas',
  'Apareces en búsquedas de hombres con membresía activa',
  'Tú decides quién accede a tu perfil completo',
  'Acepta conexiones, recibe regalos y genera ingresos',
]

const manSteps = [
  'Activa tu membresía premium una sola vez',
  'Explora perfiles reales y verificados',
  'Envía solicitudes con o sin regalo destacado',
  'Al aceptar, tienes acceso completo al perfil',
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#09090B] text-white overflow-x-hidden">

      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex flex-col justify-center items-center px-6 text-center overflow-hidden">
        {/* Radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_50%_0%,rgba(233,30,140,0.13),transparent_70%)] pointer-events-none" />
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '72px 72px' }} />

        {/* Floating orb */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2.5 border border-white/8 bg-white/[0.04] backdrop-blur-sm px-4 py-2 rounded-full mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[11px] text-white/50 tracking-[0.2em] uppercase font-medium">Plataforma exclusiva de conexiones</span>
          </div>

          {/* Headline */}
          <h1 className="text-[clamp(2.8rem,8vw,6.5rem)] font-black leading-[0.92] tracking-[-0.03em] mb-6">
            <span className="block text-white/90">Para quienes no</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-pink-400 to-rose-300">
              hacen concesiones.
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-lg sm:text-xl text-white/35 max-w-lg mx-auto leading-relaxed mb-12 font-light">
            Privacidad real. Perfiles verificados.<br />Conexiones que respetan tu tiempo.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register?role=woman"
              className="group inline-flex items-center justify-center gap-2 bg-primary hover:bg-pink-600 text-white px-8 py-4 rounded-xl text-sm font-bold tracking-wide uppercase transition-all shadow-xl shadow-primary/20 active:scale-[0.97]">
              Crear perfil — Mujer
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
            </Link>
            <Link to="/register?role=man"
              className="group inline-flex items-center justify-center gap-2 border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/20 text-white px-8 py-4 rounded-xl text-sm font-bold tracking-wide uppercase transition-all active:scale-[0.97]">
              Membresía — Hombre
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
            </Link>
          </div>
          <p className="mt-5 text-[11px] text-white/15 tracking-widest uppercase">Registro gratuito · Sin tarjeta requerida</p>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/15">
          <span className="text-[10px] tracking-[0.25em] uppercase">Explorar</span>
          <svg className="w-4 h-4 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="border-y border-white/[0.05] bg-white/[0.02]">
        <div className="max-w-4xl mx-auto px-6 py-10 grid grid-cols-3 divide-x divide-white/[0.05]">
          {[
            { val: '100%', label: 'Privacidad garantizada' },
            { val: '30%',  label: 'Ingresos para mujeres'  },
            { val: '0',    label: 'Perfiles falsos'         },
          ].map(s => (
            <div key={s.label} className="text-center px-4">
              <p className="text-3xl sm:text-4xl font-black text-white/90 tabular-nums">{s.val}</p>
              <p className="text-[11px] text-white/25 mt-1.5 tracking-widest uppercase">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-xl mb-16">
            <p className="text-[11px] text-primary tracking-[0.2em] uppercase font-bold mb-4">La plataforma</p>
            <h2 className="text-4xl sm:text-5xl font-black leading-tight text-white/90">
              Diseñado para quienes<br />
              <span className="text-white/25">no aceptan menos.</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.05] rounded-2xl overflow-hidden border border-white/[0.05]">
            {features.map(f => (
              <div key={f.title}
                className="bg-[#09090B] p-7 hover:bg-white/[0.03] transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white/50 group-hover:text-primary group-hover:border-primary/30 transition-colors mb-5">
                  {f.icon}
                </div>
                <h3 className="font-bold text-white/80 text-[15px] mb-2">{f.title}</h3>
                <p className="text-white/30 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-28 px-6 border-t border-white/[0.05]">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-xl mb-16">
            <p className="text-[11px] text-primary tracking-[0.2em] uppercase font-bold mb-4">El proceso</p>
            <h2 className="text-4xl sm:text-5xl font-black leading-tight text-white/90">
              Simple. Claro.<br />
              <span className="text-white/25">Sin rodeos.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Women */}
            <div className="border border-white/[0.06] bg-white/[0.02] rounded-2xl p-8">
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary rounded-full px-3 py-1 text-[11px] font-bold tracking-widest uppercase mb-8">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><circle cx="12" cy="8" r="4" /><path d="M12 14c-5 0-8 2-8 3v1h16v-1c0-1-3-3-8-3z" /></svg>
                Para Mujeres
              </div>
              <ol className="space-y-5">
                {womanSteps.map((step, i) => (
                  <li key={step} className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-black flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-white/50 text-sm leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Men */}
            <div className="border border-white/[0.06] bg-white/[0.02] rounded-2xl p-8">
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full px-3 py-1 text-[11px] font-bold tracking-widest uppercase mb-8">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><circle cx="12" cy="8" r="4" /><path d="M12 14c-5 0-8 2-8 3v1h16v-1c0-1-3-3-8-3z" /></svg>
                Para Hombres
              </div>
              <ol className="space-y-5">
                {manSteps.map((step, i) => (
                  <li key={step} className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-black flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-white/50 text-sm leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="relative py-36 px-6 overflow-hidden border-t border-white/[0.05]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_70%_at_50%_50%,rgba(233,30,140,0.1),transparent_70%)] pointer-events-none" />
        <div className="relative max-w-2xl mx-auto text-center">
          <p className="text-[11px] text-primary tracking-[0.2em] uppercase font-bold mb-5">Únete ahora</p>
          <h2 className="text-4xl sm:text-5xl font-black leading-tight text-white/90 mb-6">
            Tu estándar merece<br />una plataforma a tu nivel.
          </h2>
          <p className="text-white/25 mb-12 max-w-md mx-auto text-base leading-relaxed">
            Miles de personas eligiendo calidad sobre cantidad. La pregunta es cuándo empiezas tú.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register?role=woman"
              className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-pink-600 text-white font-bold px-8 py-4 rounded-xl text-sm tracking-wide uppercase transition-all shadow-xl shadow-primary/20 active:scale-[0.97]">
              Crear perfil — Mujer
            </Link>
            <Link to="/register?role=man"
              className="inline-flex items-center justify-center gap-2 border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-white font-bold px-8 py-4 rounded-xl text-sm tracking-wide uppercase transition-all active:scale-[0.97]">
              Activar membresía
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-white/[0.05] bg-black/40 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-black text-white text-base tracking-tight">MatchUp</p>
            <p className="text-[11px] text-white/15 mt-0.5 tracking-wide">Conexiones reales, privacidad garantizada.</p>
          </div>
          <div className="flex gap-8 text-xs text-white/20">
            <Link to="/register" className="hover:text-white/60 transition">Registrarse</Link>
            <Link to="/login" className="hover:text-white/60 transition">Iniciar sesión</Link>
          </div>
          <p className="text-[11px] text-white/10">© {new Date().getFullYear()} MatchUp</p>
        </div>
      </footer>
    </div>
  )
}
