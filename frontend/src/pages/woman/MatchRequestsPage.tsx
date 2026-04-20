import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { getPendingRequests, acceptRequest, rejectRequest, getManPublicProfile } from '../../api'
import type { PendingRequest, ManProfile } from '../../types'

const GIFT_EMOJIS: Record<string, string> = {
  flowers: '💐', chocolates: '🍫', teddy: '🧸',
  wine: '🍷', ring: '💍', cake: '🎂',
}
const GIFT_LABELS: Record<string, string> = {
  flowers: 'Flores', chocolates: 'Chocolates', teddy: 'Osito',
  wine: 'Vino', ring: 'Anillo', cake: 'Torta',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-pink-100">
          <h2 className="text-lg font-bold text-gray-800">Perfil del hombre</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16 text-gray-400">
            <div className="text-4xl animate-pulse">👤</div>
          </div>
        ) : profile ? (
          <div className="p-5 space-y-5">
            {/* Photo gallery */}
            {profile.photos && profile.photos.length > 0 ? (
              <div className="space-y-2">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100">
                  <img
                    src={profile.photos[photoIdx]?.photo_url}
                    alt=""
                    className="w-full h-full object-contain"
                  />
                  {profile.photos.length > 1 && (
                    <>
                      <button
                        onClick={() => setPhotoIdx(i => Math.max(0, i - 1))}
                        disabled={photoIdx === 0}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-8 h-8 flex items-center justify-center disabled:opacity-30"
                      >
                        ‹
                      </button>
                      <button
                        onClick={() => setPhotoIdx(i => Math.min(profile.photos.length - 1, i + 1))}
                        disabled={photoIdx === profile.photos.length - 1}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-8 h-8 flex items-center justify-center disabled:opacity-30"
                      >
                        ›
                      </button>
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                        {profile.photos.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setPhotoIdx(i)}
                            className={`w-2 h-2 rounded-full transition ${i === photoIdx ? 'bg-white' : 'bg-white/50'}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                <span className="text-6xl font-bold text-blue-300">
                  {profile.first_name?.charAt(0)?.toUpperCase() || '?'}
                </span>
              </div>
            )}

            {/* Info */}
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{profile.first_name}</h3>
              <p className="text-gray-500 text-sm mt-0.5">{profile.age} años</p>
            </div>

            {(profile.country || profile.city) && (
              <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                <span>📍</span>
                <span>{[profile.city, profile.country].filter(Boolean).join(', ')}</span>
              </div>
            )}

            {profile.occupation && (
              <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                <span>💼</span>
                <span>{profile.occupation}</span>
              </div>
            )}

            {profile.bio && (
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-sm text-gray-600 leading-relaxed">{profile.bio}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <p>No se encontró el perfil</p>
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
      toast.success(action === 'accept' ? '¡Match aceptado! 💘' : 'Solicitud rechazada')
      load()
    } catch {
      toast.error('Error al procesar')
    }
  }

  const pending = requests.filter(r => r.status === 'pending')
  const accepted = requests.filter(r => r.status === 'accepted')
  const rejected = requests.filter(r => r.status === 'rejected')

  const shown = tab === 'pending' ? pending : tab === 'accepted' ? accepted : rejected

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl animate-pulse mb-3">💌</div>
          <p className="text-gray-400">Cargando solicitudes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Solicitudes de Match</h1>
          <p className="text-gray-500 mt-1 text-sm">Hombres interesados en conocerte</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('pending')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition ${
              tab === 'pending'
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-pink-50 border border-gray-200'
            }`}
          >
            Pendientes
            {pending.length > 0 && (
              <span className={`w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold ${
                tab === 'pending' ? 'bg-white/30 text-white' : 'bg-pink-100 text-pink-600'
              }`}>
                {pending.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab('accepted')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition ${
              tab === 'accepted'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-green-50 border border-gray-200'
            }`}
          >
            Aceptadas
            {accepted.length > 0 && (
              <span className={`w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold ${
                tab === 'accepted' ? 'bg-white/30 text-white' : 'bg-green-100 text-green-600'
              }`}>
                {accepted.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab('rejected')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition ${
              tab === 'rejected'
                ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            Rechazadas
          </button>
        </div>

        {/* Cards */}
        {shown.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">
              {tab === 'pending' ? '💌' : tab === 'accepted' ? '💘' : '🙈'}
            </p>
            <p className="text-gray-400 font-medium">
              {tab === 'pending' ? 'No tienes solicitudes pendientes' :
               tab === 'accepted' ? 'No has aceptado ninguna solicitud aún' :
               'No has rechazado ninguna solicitud'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {shown.map(r => {
              const manName = r.man_info?.first_name || `Hombre #${r.man_id}`
              const manPhoto = r.man_info?.photo_url
              const initial = manName.charAt(0).toUpperCase()

              return (
                <div
                  key={r.request_id}
                  className="bg-white rounded-3xl shadow-sm border border-pink-100 overflow-hidden hover:shadow-md transition"
                >
                  {/* Gift banner */}
                  {r.gift_type && (
                    <div className="bg-gradient-to-r from-pink-50 to-purple-50 border-b border-pink-100 px-5 py-3 flex items-center gap-3">
                      <span className="text-3xl">{GIFT_EMOJIS[r.gift_type] ?? '🎁'}</span>
                      <div>
                        <p className="text-sm font-semibold text-pink-700">
                          ¡Te enviaron {GIFT_LABELS[r.gift_type] ?? 'un regalo'}!
                        </p>
                        {r.gift_message && (
                          <p className="text-xs text-pink-500 italic">"{r.gift_message}"</p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        {manPhoto ? (
                          <img
                            src={manPhoto}
                            alt={manName}
                            className="w-14 h-14 rounded-2xl object-cover"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                            <span className="text-white text-xl font-bold">{initial}</span>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-bold text-gray-800">{manName}</p>
                            {r.man_info && (
                              <p className="text-xs text-gray-500 mt-0.5">
                                {r.man_info.age && `${r.man_info.age} años`}
                                {r.man_info.age && (r.man_info.city || r.man_info.country) && ' · '}
                                {[r.man_info.city, r.man_info.country].filter(Boolean).join(', ')}
                              </p>
                            )}
                          </div>
                          <span className={`flex-shrink-0 text-xs px-3 py-1 rounded-full font-semibold ${
                            r.status === 'pending'  ? 'bg-amber-100 text-amber-700' :
                            r.status === 'accepted' ? 'bg-green-100 text-green-700' :
                                                      'bg-red-100 text-red-500'
                          }`}>
                            {r.status === 'pending' ? '⏳ Pendiente' :
                             r.status === 'accepted' ? '✓ Aceptado' : 'Rechazado'}
                          </span>
                        </div>

                        {r.message && (
                          <p className="text-sm text-gray-500 mt-2 italic bg-gray-50 rounded-xl px-3 py-2">
                            "{r.message}"
                          </p>
                        )}

                        <p className="text-gray-400 text-xs mt-2">
                          {new Date(r.created_at).toLocaleDateString('es-PE', {
                            day: '2-digit', month: 'long', year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => setViewingManId(r.man_id)}
                        className="flex-shrink-0 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-semibold hover:bg-blue-100 transition"
                      >
                        Ver perfil
                      </button>

                      {r.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handle(r.request_id, 'accept')}
                            className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-2 rounded-xl text-sm font-semibold hover:from-pink-600 hover:to-rose-600 transition shadow-sm"
                          >
                            Aceptar 💘
                          </button>
                          <button
                            onClick={() => handle(r.request_id, 'reject')}
                            className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-xl text-sm font-semibold hover:bg-gray-200 transition"
                          >
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

      {/* Man profile modal */}
      {viewingManId !== null && (
        <ManProfileModal manId={viewingManId} onClose={() => setViewingManId(null)} />
      )}
    </div>
  )
}
