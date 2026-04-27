import { useState, useEffect } from 'react'
import { getProfilePreview, getCardPreview } from '../../api'
import type { FullProfile } from '../../types'

type ViewMode = 'card' | 'full'

const LOOKING_FOR_MAP: Record<string, { label: string; emoji: string }> = {
  relationship: { label: 'Relación seria',      emoji: '💑' },
  casual:       { label: 'Casual',              emoji: '✨' },
  commitment:   { label: 'Compromiso',          emoji: '💍' },
  outing:       { label: 'Salir a conocernos',  emoji: '🌸' },
  surprise:     { label: 'Sorpréndeme',         emoji: '🎲' },
}

export default function PublicPreviewPage() {
  const [profile, setProfile]   = useState<FullProfile | null>(null)
  const [card, setCard]         = useState<{ first_name: string; primary_photo_url?: string } | null>(null)
  const [loading, setLoading]   = useState(true)
  const [view, setView]         = useState<ViewMode>('card')
  const [photoIdx, setPhotoIdx] = useState(0)

  useEffect(() => {
    Promise.all([getProfilePreview(), getCardPreview()])
      .then(([profileRes, cardRes]) => {
        setProfile(profileRes.data)
        setCard(cardRes.data)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070509] flex items-center justify-center">
        <svg className="w-8 h-8 text-primary/50 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    )
  }

  const locationText = [profile?.city, profile?.country].filter(Boolean).join(', ') || profile?.location

  return (
    <div className="min-h-screen bg-[#070509] text-[#F5F0E8]">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(201,168,76,0.07),transparent_65%)] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[300px] bg-[radial-gradient(ellipse,rgba(124,58,237,0.04),transparent)] pointer-events-none" />

      <div className="relative max-w-xl mx-auto px-4 py-10">
        <div className="mb-8">
          <p className="text-[11px] text-primary tracking-[0.22em] uppercase font-bold mb-2">Tu visibilidad</p>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black tracking-tight">Vista Pública</h1>
            <span className="border border-primary/25 bg-primary/[0.08] text-primary text-[10px] px-2.5 py-1 rounded-full font-bold tracking-widest uppercase">Preview</span>
          </div>
          <p className="text-[#F5F0E8]/30 text-sm mt-1.5">Así te ven los miembros de Agara</p>
        </div>

        {/* Toggle */}
        <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/[0.05] rounded-xl mb-8 w-fit">
          {(['card', 'full'] as ViewMode[]).map(v => (
            <button key={v} onClick={() => { setView(v); if (v === 'full') setPhotoIdx(0) }}
              className={`px-5 py-2 text-xs font-bold rounded-lg tracking-widest uppercase transition-all ${
                view === v ? 'text-[#0F0C18]' : 'text-[#F5F0E8]/30 hover:text-[#F5F0E8]/55'
              }`}
              style={view === v ? { background: 'linear-gradient(135deg,#E0C070,#C9A84C)' } : {}}>
              {v === 'card' ? 'Tarjeta' : 'Perfil completo'}
            </button>
          ))}
        </div>

        {/* ── Card view ── */}
        {view === 'card' && (
          <div className="flex flex-col items-center">
            <div className="border border-primary/[0.1] bg-primary/[0.04] rounded-xl px-5 py-3 mb-6 text-center">
              <p className="text-xs text-[#F5F0E8]/35">Solo se muestra tu foto y nombre. El resto permanece oculto.</p>
            </div>
            <div className="relative w-52 rounded-2xl overflow-hidden border border-white/[0.07]"
              style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(201,168,76,0.06)' }}>
              <div className="aspect-[3/4] bg-[#0F0C18]">
                {card?.primary_photo_url ? (
                  <img src={card.primary_photo_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.75" className="w-14 h-14 text-[#F5F0E8]/8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-4">
                <p className="text-white font-bold text-base">{card?.first_name || '(sin nombre)'}</p>
              </div>
            </div>
            <p className="text-[#F5F0E8]/18 text-xs mt-5 text-center max-w-xs leading-relaxed">
              El perfil completo solo se desbloquea cuando aceptas una solicitud.
            </p>
          </div>
        )}

        {/* ── Full profile view ── */}
        {view === 'full' && profile && (
          <div className="bg-[#0F0C18] border border-white/[0.06] rounded-2xl overflow-hidden"
            style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.5), 0 0 60px rgba(201,168,76,0.04)' }}>

            <div className="border-b border-primary/[0.1] bg-primary/[0.04] px-4 py-2.5 text-center">
              <p className="text-[11px] text-primary/65 tracking-wide font-medium">Visible solo tras aceptar una solicitud</p>
            </div>

            {/* Photos */}
            {profile.photos.length > 0 ? (
              <div className="relative aspect-[3/4] overflow-hidden bg-[#0A0812]">
                <img src={profile.photos[photoIdx]?.photo_url} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F0C18] via-[#0F0C18]/10 to-transparent" />
                {profile.photos.length > 1 && (
                  <div className="absolute bottom-[76px] left-0 right-0 flex justify-center gap-1.5 z-10">
                    {profile.photos.map((_, i) => (
                      <button key={i} onClick={() => setPhotoIdx(i)}
                        className={`rounded-full transition-all duration-200 ${i === photoIdx ? 'w-5 h-1.5 bg-primary' : 'w-1.5 h-1.5 bg-white/25'}`} />
                    ))}
                  </div>
                )}
                {photoIdx > 0 && (
                  <button onClick={() => setPhotoIdx(i => i - 1)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 border border-white/[0.08] backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white transition z-10">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
                  </button>
                )}
                {photoIdx < profile.photos.length - 1 && (
                  <button onClick={() => setPhotoIdx(i => i + 1)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 border border-white/[0.08] backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white transition z-10">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
                  </button>
                )}
                <div className="absolute bottom-4 left-5 right-5 z-10 flex items-end justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-white tracking-tight">
                      {profile.first_name || '(sin nombre)'}{profile.age ? `, ${profile.age}` : ''}
                    </h2>
                    {locationText && (
                      <p className="text-white/45 text-xs flex items-center gap-1 mt-0.5">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
                        {locationText}
                      </p>
                    )}
                  </div>
                  <span className="border border-primary/40 bg-primary/[0.15] text-primary text-[9px] px-2 py-1 rounded-full font-black tracking-widest uppercase backdrop-blur-sm">Match</span>
                </div>
              </div>
            ) : (
              <div className="w-full aspect-[3/4] bg-[#0A0812] flex flex-col items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.75" className="w-16 h-16 text-[#F5F0E8]/8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
                <p className="text-[#F5F0E8]/20 text-xs mt-4">Sin fotos aún</p>
              </div>
            )}

            {/* Info section */}
            <div className="p-6 space-y-3.5">

              {/* Occupation */}
              {profile.occupation && (
                <div className="flex items-center gap-3 text-sm text-[#F5F0E8]/50">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-primary/50 flex-shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                  {profile.occupation}
                </div>
              )}

              {/* Bio */}
              {profile.bio && (
                <p className="text-sm text-[#F5F0E8]/38 leading-relaxed border-t border-white/[0.05] pt-3.5">{profile.bio}</p>
              )}

              {/* Looking for */}
              {profile.looking_for && LOOKING_FOR_MAP[profile.looking_for] && (
                <div className="border-t border-white/[0.05] pt-3.5">
                  <p className="text-[10px] font-bold text-[#F5F0E8]/25 uppercase tracking-widest mb-2">Busca</p>
                  <span className="inline-flex items-center gap-1.5 border border-primary/20 bg-primary/[0.07] text-primary text-xs px-3 py-1.5 rounded-full font-semibold">
                    <span>{LOOKING_FOR_MAP[profile.looking_for].emoji}</span>
                    <span>{LOOKING_FOR_MAP[profile.looking_for].label}</span>
                  </span>
                </div>
              )}

              {/* Contact info */}
              {(profile.phone || profile.instagram || profile.telegram || profile.tiktok) && (
                <div className="border-t border-white/[0.05] pt-3.5 space-y-2.5">
                  {profile.phone && (
                    <div className="flex items-center gap-3 text-sm">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-primary/50 flex-shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>
                      <span className="text-primary font-semibold">{profile.phone}</span>
                    </div>
                  )}
                  {profile.instagram && (
                    <div className="flex items-center gap-3 text-sm">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-primary/50 flex-shrink-0"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" strokeWidth="0" /></svg>
                      <span className="text-[#F5F0E8]/50">{profile.instagram}</span>
                    </div>
                  )}
                  {profile.telegram && (
                    <div className="flex items-center gap-3 text-sm">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-primary/50 flex-shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" /></svg>
                      <span className="text-[#F5F0E8]/50">{profile.telegram}</span>
                    </div>
                  )}
                  {profile.tiktok && (
                    <div className="flex items-center gap-3 text-sm">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-primary/50 flex-shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>
                      <span className="text-[#F5F0E8]/50">{profile.tiktok}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Empty state */}
              {!profile.occupation && !profile.bio && !profile.looking_for &&
               !profile.phone && !profile.instagram && !profile.telegram && !profile.tiktok && (
                <div className="text-center py-6">
                  <p className="text-[#F5F0E8]/22 text-sm">Tu perfil está incompleto.</p>
                  <a href="/woman/profile" className="text-primary text-sm font-semibold hover:text-gold-light transition mt-1.5 inline-block">Completar perfil →</a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
