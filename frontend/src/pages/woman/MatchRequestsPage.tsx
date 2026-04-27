import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { getPendingRequests, acceptRequest, rejectRequest, getManPublicProfile } from '../../api'
import type { PendingRequest, ManProfile } from '../../types'

const GIFT_EMOJIS: Record<string, string> = {
  flowers: '💐', chocolates: '🍫', teddy: '🧸',
  wine: '🍷', ring: '💍', cake: '🎂',
  kiss: '💋', balloon: '🎈', star: '⭐',
  perfume: '🌹', diamond: '💎', crown: '👑',
  trip: '✈️', yacht: '🛥️',
}
const GIFT_LABELS: Record<string, string> = {
  flowers: 'Flores', chocolates: 'Chocolates', teddy: 'Osito',
  wine: 'Vino', ring: 'Anillo', cake: 'Torta',
  kiss: 'Beso', balloon: 'Globos', star: 'Estrella',
  perfume: 'Perfume', diamond: 'Diamante', crown: 'Corona',
  trip: 'Viaje', yacht: 'Yate',
}

type Tab = 'pending' | 'accepted' | 'rejected'

interface ManProfileModalProps {
  manId: number
  onClose: () => void
}

function ManProfileModal({ manId, onClose }: ManProfileModalProps) {
  const [profile, setProfile] = useState<ManProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [photoIdx, setPhotoIdx] = useState(0)

  useEffect(() => {
    getManPublicProfile(manId)
      .then(r => { setProfile(r.data); setLoading(false) })
      .catch(() => { toast.error('No se pudo cargar el perfil'); setLoading(false) })
  }, [manId])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#0F0C18] border border-white/[0.08] rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 60px rgba(201,168,76,0.04)' }}
        onClick={e => e.stopPropagation()}>

        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <h2 className="text-sm font-bold text-[#F5F0E8]/70 tracking-widest uppercase">Perfil</h2>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg border border-white/[0.08] bg-white/[0.03] flex items-center justify-center text-[#F5F0E8]/40 hover:text-[#F5F0E8] transition">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <svg className="w-7 h-7 text-primary/50 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : profile ? (
          <div>
            {profile.photos && profile.photos.length > 0 ? (
              <div className="relative aspect-[3/4] overflow-hidden bg-[#0A0812]">
                <img src={profile.photos[photoIdx]?.photo_url} alt="" className="w-full h-full object-contain" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F0C18] via-transparent to-transparent" />
                {profile.photos.length > 1 && (
                  <>
                    {photoIdx > 0 && (
                      <button onClick={() => setPhotoIdx(i => i - 1)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 border border-white/[0.1] backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white transition">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
                      </button>
                    )}
                    {photoIdx < profile.photos.length - 1 && (
                      <button onClick={() => setPhotoIdx(i => i + 1)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 border border-white/[0.1] backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white transition">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
                      </button>
                    )}
                    <div className="absolute bottom-[72px] left-0 right-0 flex justify-center gap-1.5">
                      {profile.photos.map((_, i) => (
                        <button key={i} onClick={() => setPhotoIdx(i)}
                          className={`rounded-full transition-all ${i === photoIdx ? 'w-4 h-1.5 bg-primary' : 'w-1.5 h-1.5 bg-white/30'}`} />
                      ))}
                    </div>
                  </>
                )}
                <div className="absolute bottom-4 left-5 right-5">
                  <h3 className="text-xl font-black text-white tracking-tight">
                    {profile.first_name}{profile.age ? `, ${profile.age}` : ''}
                  </h3>
                </div>
              </div>
            ) : (
              <div className="aspect-[3/4] bg-[#0A0812] flex items-center justify-center">
                <span className="text-6xl font-black text-[#F5F0E8]/10">
                  {profile.first_name?.charAt(0)?.toUpperCase() || '?'}
                </span>
              </div>
            )}

            <div className="p-5 space-y-3">
              {(profile.city || profile.country) && (
                <div className="flex items-center gap-2 text-sm text-[#F5F0E8]/45">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-primary/50 flex-shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                  {[profile.city, profile.country].filter(Boolean).join(', ')}
                </div>
              )}
              {profile.occupation && (
                <div className="flex items-center gap-2 text-sm text-[#F5F0E8]/45">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-primary/50 flex-shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                  {profile.occupation}
                </div>
              )}
              {profile.bio && (
                <p className="text-sm text-[#F5F0E8]/38 leading-relaxed border-t border-white/[0.05] pt-3">{profile.bio}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-[#F5F0E8]/30 text-sm">No se encontró el perfil</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function MatchRequestsPage() {
  const [requests, setRequests] = useState<PendingRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Tab>('pending')
  const [viewingManId, setViewingManId] = useState<number | null>(null)

  const load = () => {
    setLoading(true)
    getPendingRequests()
      .then(r => { setRequests(r.data); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handle = async (id: number, action: 'accept' | 'reject') => {
    try {
      if (action === 'accept') await acceptRequest(id)
      else await rejectRequest(id)
      toast.success(action === 'accept' ? '¡Match aceptado!' : 'Solicitud rechazada')
      load()
    } catch {
      toast.error('Error al procesar')
    }
  }

  const pending  = requests.filter(r => r.status === 'pending')
  const accepted = requests.filter(r => r.status === 'accepted')
  const rejected = requests.filter(r => r.status === 'rejected')
  const shown    = tab === 'pending' ? pending : tab === 'accepted' ? accepted : rejected

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

  const TABS: { key: Tab; label: string; count?: number }[] = [
    { key: 'pending',  label: 'Pendientes',  count: pending.length  },
    { key: 'accepted', label: 'Aceptadas',   count: accepted.length },
    { key: 'rejected', label: 'Rechazadas' },
  ]

  return (
    <div className="min-h-screen bg-[#070509] text-[#F5F0E8]">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(201,168,76,0.05),transparent_65%)] pointer-events-none" />

      <div className="relative max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <p className="text-[11px] text-primary tracking-[0.22em] uppercase font-bold mb-2">Conexiones</p>
          <h1 className="text-3xl font-black tracking-tight">Solicitudes de Match</h1>
          <p className="text-[#F5F0E8]/30 text-sm mt-1.5">Hombres interesados en conocerte</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/[0.05] rounded-xl mb-8 w-fit">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg tracking-widest uppercase transition-all ${
                tab === t.key ? 'text-[#0F0C18]' : 'text-[#F5F0E8]/30 hover:text-[#F5F0E8]/55'
              }`}
              style={tab === t.key ? { background: 'linear-gradient(135deg,#E0C070,#C9A84C)' } : {}}>
              {t.label}
              {t.count !== undefined && t.count > 0 && (
                <span className={`w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-black ${
                  tab === t.key ? 'bg-[#0F0C18]/20 text-[#0F0C18]' : 'bg-primary/20 text-primary'
                }`}>{t.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* Empty state */}
        {shown.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl border border-white/[0.06] bg-white/[0.02] flex items-center justify-center mx-auto mb-5">
              <span className="text-2xl">
                {tab === 'pending' ? '💌' : tab === 'accepted' ? '💘' : '🙈'}
              </span>
            </div>
            <p className="text-[#F5F0E8]/35 font-medium text-sm">
              {tab === 'pending'  ? 'No tienes solicitudes pendientes' :
               tab === 'accepted' ? 'No has aceptado ninguna solicitud aún' :
                                    'No has rechazado ninguna solicitud'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {shown.map(r => {
              const manName  = r.man_info?.first_name || `Hombre #${r.man_id}`
              const manPhoto = r.man_info?.photo_url
              const initial  = manName.charAt(0).toUpperCase()

              return (
                <div key={r.request_id}
                  className="bg-[#0F0C18] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-primary/[0.15] transition-all"
                  style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }}>

                  {/* Gift banner */}
                  {r.gift_type && (
                    <div className="border-b border-primary/[0.1] bg-primary/[0.05] px-5 py-3 flex items-center gap-3">
                      <span className="text-2xl">{GIFT_EMOJIS[r.gift_type] ?? '🎁'}</span>
                      <div>
                        <p className="text-xs font-bold text-primary tracking-wide">
                          ¡Te enviaron {GIFT_LABELS[r.gift_type] ?? 'un regalo'}!
                        </p>
                        {r.gift_message && (
                          <p className="text-[11px] text-[#F5F0E8]/35 italic mt-0.5">"{r.gift_message}"</p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        {manPhoto ? (
                          <img src={manPhoto} alt={manName}
                            className="w-14 h-14 rounded-xl object-cover border border-white/[0.08]" />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-[#1A1428] border border-white/[0.06] flex items-center justify-center">
                            <span className="text-[#F5F0E8]/30 text-xl font-black">{initial}</span>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-bold text-[#F5F0E8]">{manName}</p>
                            {r.man_info && (
                              <p className="text-xs text-[#F5F0E8]/35 mt-0.5">
                                {r.man_info.age && `${r.man_info.age} años`}
                                {r.man_info.age && (r.man_info.city || r.man_info.country) && ' · '}
                                {[r.man_info.city, r.man_info.country].filter(Boolean).join(', ')}
                              </p>
                            )}
                          </div>
                          <span className={`flex-shrink-0 text-[10px] px-2.5 py-1 rounded-full font-bold tracking-wide uppercase ${
                            r.status === 'pending'  ? 'border border-amber-500/25 bg-amber-500/[0.08] text-amber-400' :
                            r.status === 'accepted' ? 'border border-emerald-500/25 bg-emerald-500/[0.08] text-emerald-400' :
                                                      'border border-white/[0.08] bg-white/[0.03] text-[#F5F0E8]/30'
                          }`}>
                            {r.status === 'pending' ? 'Pendiente' :
                             r.status === 'accepted' ? 'Aceptado' : 'Rechazado'}
                          </span>
                        </div>

                        {r.message && (
                          <p className="text-xs text-[#F5F0E8]/35 mt-2 italic bg-white/[0.02] border border-white/[0.04] rounded-xl px-3 py-2">
                            "{r.message}"
                          </p>
                        )}

                        <p className="text-[#F5F0E8]/20 text-[10px] mt-2">
                          {new Date(r.created_at).toLocaleDateString('es-PE', {
                            day: '2-digit', month: 'long', year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-4">
                      <button onClick={() => setViewingManId(r.man_id)}
                        className="flex-shrink-0 px-4 py-2 border border-white/[0.08] bg-white/[0.03] text-[#F5F0E8]/55 rounded-xl text-xs font-bold tracking-wide uppercase hover:border-primary/30 hover:text-primary transition">
                        Ver perfil
                      </button>

                      {r.status === 'pending' && (
                        <>
                          <button onClick={() => handle(r.request_id, 'accept')}
                            className="flex-1 py-2 rounded-xl text-xs font-bold tracking-wide uppercase transition text-[#0F0C18]"
                            style={{ background: 'linear-gradient(135deg,#E0C070,#C9A84C)' }}>
                            Aceptar
                          </button>
                          <button onClick={() => handle(r.request_id, 'reject')}
                            className="flex-1 py-2 border border-white/[0.07] bg-white/[0.02] text-[#F5F0E8]/35 rounded-xl text-xs font-bold tracking-wide uppercase hover:bg-white/[0.05] transition">
                            Rechazar
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {viewingManId !== null && (
        <ManProfileModal manId={viewingManId} onClose={() => setViewingManId(null)} />
      )}
    </div>
  )
}
