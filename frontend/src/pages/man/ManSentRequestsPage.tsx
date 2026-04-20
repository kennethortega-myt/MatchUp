import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { getMySentRequests, sendGiftOnRequest, getAcceptedProfile } from '../../api'
import type { ManRequestOut, FullProfile } from '../../types'

const GIFT_CATALOG: Array<{ key: string; emoji: string; label: string; price: number }> = [
  { key: 'kiss',       emoji: '💋', label: 'Beso',       price:   5 },
  { key: 'balloon',    emoji: '🎈', label: 'Globos',     price:  10 },
  { key: 'chocolates', emoji: '🍫', label: 'Chocolates', price:  15 },
  { key: 'star',       emoji: '⭐', label: 'Estrella',   price:  20 },
  { key: 'flowers',    emoji: '💐', label: 'Flores',     price:  25 },
  { key: 'teddy',      emoji: '🧸', label: 'Osito',      price:  35 },
  { key: 'wine',       emoji: '🍷', label: 'Vino',       price:  45 },
  { key: 'cake',       emoji: '🎂', label: 'Torta',      price:  55 },
  { key: 'perfume',    emoji: '🌹', label: 'Perfume',    price:  65 },
  { key: 'ring',       emoji: '💍', label: 'Anillo',     price:  99 },
  { key: 'diamond',    emoji: '💎', label: 'Diamante',   price: 150 },
  { key: 'crown',      emoji: '👑', label: 'Corona',     price: 200 },
  { key: 'trip',       emoji: '✈️', label: 'Viaje',      price: 350 },
  { key: 'yacht',      emoji: '🛥️', label: 'Yate',       price: 500 },
]

// ── Woman profile modal ───────────────────────────────────────────────────────

interface WomanProfileModalProps {
  womanId: number
  onClose: () => void
}

function WomanProfileModal({ womanId, onClose }: WomanProfileModalProps) {
  const [profile, setProfile] = useState<FullProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [photoIdx, setPhotoIdx] = useState(0)

  useEffect(() => {
    getAcceptedProfile(womanId)
      .then(r => { setProfile(r.data); setLoading(false) })
      .catch(() => { toast.error('No se pudo cargar el perfil'); setLoading(false) })
  }, [womanId])

  const LOOKING_FOR_LABELS: Record<string, string> = {
    relationship: '💑 Relación seria',
    casual: '😊 Casual',
    commitment: '💍 Compromiso',
    outing: '🌸 Salir a pasear',
    surprise: '✨ Sorpréndeme',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-indigo-100">
          <h2 className="text-lg font-bold text-gray-800">Perfil completo</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="text-4xl animate-pulse">👤</div>
          </div>
        ) : profile ? (
          <div className="p-5 space-y-4">
            {/* Photos */}
            {profile.photos && profile.photos.length > 0 ? (
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
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-8 h-8 flex items-center justify-center text-lg disabled:opacity-30"
                    >
                      ‹
                    </button>
                    <button
                      onClick={() => setPhotoIdx(i => Math.min(profile.photos.length - 1, i + 1))}
                      disabled={photoIdx === profile.photos.length - 1}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-8 h-8 flex items-center justify-center text-lg disabled:opacity-30"
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
            ) : (
              <div className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center">
                <span className="text-6xl font-bold text-pink-300">
                  {profile.first_name?.charAt(0)?.toUpperCase() || '?'}
                </span>
              </div>
            )}

            <div>
              <h3 className="text-2xl font-bold text-gray-800">{profile.first_name}</h3>
              <p className="text-gray-500 text-sm">{profile.age} años</p>
            </div>

            {(profile.country || profile.city) && (
              <p className="text-sm text-gray-500 flex items-center gap-1.5">
                <span>📍</span>
                {[profile.city, profile.country].filter(Boolean).join(', ')}
              </p>
            )}

            {profile.occupation && (
              <p className="text-sm text-gray-500 flex items-center gap-1.5">
                <span>💼</span>{profile.occupation}
              </p>
            )}

            {profile.looking_for && (
              <p className="text-sm text-indigo-600 font-medium">
                {LOOKING_FOR_LABELS[profile.looking_for] || profile.looking_for}
              </p>
            )}

            {profile.bio && (
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-sm text-gray-600 leading-relaxed">{profile.bio}</p>
              </div>
            )}

            {profile.phone && (
              <div className="bg-green-50 rounded-2xl p-3 flex items-center gap-2">
                <span>📱</span>
                <span className="text-sm text-green-700 font-medium">{profile.phone}</span>
              </div>
            )}

            {profile.instagram && (
              <div className="bg-purple-50 rounded-2xl p-3 flex items-center gap-2">
                <span>📸</span>
                <span className="text-sm text-purple-700 font-medium">{profile.instagram}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">Perfil no disponible</div>
        )}
      </div>
    </div>
  )
}

// ── Gift send modal ───────────────────────────────────────────────────────────

interface GiftModalProps {
  requestId: number
  onClose: () => void
  onSent: () => void
}

function GiftModal({ requestId, onClose, onSent }: GiftModalProps) {
  const [selectedGift, setSelectedGift] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)

  const handleSend = async () => {
    if (!selectedGift) return toast.error('Selecciona un regalo')
    setSending(true)
    try {
      await sendGiftOnRequest(requestId, selectedGift, message || undefined)
      toast.success('¡Regalo enviado! 🎁')
      onSent()
      onClose()
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Error al enviar el regalo')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full">
        <div className="flex items-center justify-between p-5 border-b border-indigo-100">
          <h2 className="text-lg font-bold text-gray-800">Enviar otro regalo</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-4 gap-2 max-h-52 overflow-y-auto pr-1">
            {GIFT_CATALOG.map(g => (
              <button
                key={g.key}
                onClick={() => setSelectedGift(g.key)}
                className={`flex flex-col items-center gap-1 p-3 rounded-2xl border-2 transition ${
                  selectedGift === g.key
                    ? 'border-indigo-400 bg-indigo-50'
                    : 'border-gray-100 hover:border-indigo-200 hover:bg-indigo-50'
                }`}
              >
                <span className="text-2xl">{g.emoji}</span>
                <span className="text-xs font-semibold text-gray-700">{g.label}</span>
                <span className="text-xs text-gray-400">S/ {g.price}</span>
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Mensaje (opcional)
            </label>
            <textarea
              rows={2}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Escribe algo especial..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          <button
            onClick={handleSend}
            disabled={!selectedGift || sending}
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-xl font-semibold text-sm hover:from-indigo-600 hover:to-blue-600 disabled:opacity-50 transition shadow-sm"
          >
            {sending ? 'Enviando...' : `Enviar ${selectedGift ? GIFT_CATALOG.find(g => g.key === selectedGift)?.emoji : ''}`}
          </button>
        </div>
      </div>
    </div>
  )
}

type Tab = 'pending' | 'accepted' | 'rejected'

// ── Main page ─────────────────────────────────────────────────────────────────

export default function ManSentRequestsPage() {
  const [requests, setRequests] = useState<ManRequestOut[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Tab>('pending')
  const [giftModalFor, setGiftModalFor] = useState<number | null>(null)
  const [profileModalFor, setProfileModalFor] = useState<number | null>(null)

  const load = () => {
    setLoading(true)
    getMySentRequests()
      .then(r => { setRequests(r.data); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl animate-pulse mb-3">📤</div>
          <p className="text-gray-400">Cargando solicitudes...</p>
        </div>
      </div>
    )
  }

  const pending  = requests.filter(r => r.status === 'pending')
  const accepted = requests.filter(r => r.status === 'accepted')
  const rejected = requests.filter(r => r.status === 'rejected')
  const shown = tab === 'pending' ? pending : tab === 'accepted' ? accepted : rejected

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Mis Matches</h1>
          <p className="text-gray-500 mt-1 text-sm">Solicitudes que has enviado a mujeres</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('pending')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition ${
              tab === 'pending'
                ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-amber-50 border border-gray-200'
            }`}
          >
            Pendientes
            {pending.length > 0 && (
              <span className={`w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold ${
                tab === 'pending' ? 'bg-white/30 text-white' : 'bg-amber-100 text-amber-700'
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
            Aceptados
            {accepted.length > 0 && (
              <span className={`w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold ${
                tab === 'accepted' ? 'bg-white/30 text-white' : 'bg-green-100 text-green-700'
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
            Rechazados
          </button>
        </div>

        {shown.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">
              {tab === 'pending' ? '⏳' : tab === 'accepted' ? '💘' : '😔'}
            </p>
            <p className="text-gray-400 font-medium">
              {tab === 'pending' ? 'No tienes solicitudes pendientes' :
               tab === 'accepted' ? 'Ninguna solicitud aceptada aún' :
               'No tienes solicitudes rechazadas'}
            </p>
            {requests.length === 0 && (
              <p className="text-gray-300 text-sm mt-1">Explora perfiles y envía tu primera solicitud</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {shown.map(r => {
              const initial = r.woman_name.charAt(0).toUpperCase()
              const isAccepted = r.status === 'accepted'
              const isPending  = r.status === 'pending'
              const isRejected = r.status === 'rejected'

              return (
                <div
                  key={r.request_id}
                  className={`bg-white rounded-3xl shadow-sm border overflow-hidden transition hover:shadow-md ${
                    isAccepted ? 'border-green-100' :
                    isPending  ? 'border-amber-100' :
                                 'border-gray-100 opacity-75'
                  }`}
                >
                  {/* Gift banner — initial */}
                  {r.gift_type && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-indigo-100 px-5 py-3 flex items-center gap-3">
                      <span className="text-2xl">{r.gift_emoji ?? '🎁'}</span>
                      <div>
                        <p className="text-sm font-semibold text-indigo-700">
                          Enviaste {r.gift_label ?? r.gift_type}
                          {r.gift_value && <span className="text-indigo-400 font-normal ml-1">· S/ {r.gift_value}</span>}
                        </p>
                        {r.gift_message && (
                          <p className="text-xs text-indigo-400 italic">"{r.gift_message}"</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Reply gift badge */}
                  {r.reply_gift_type && (
                    <div className="bg-gradient-to-r from-pink-50 to-rose-50 border-b border-pink-100 px-5 py-3 flex items-center gap-3">
                      <span className="text-2xl">{r.reply_gift_emoji ?? '🎀'}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-pink-700">
                            ¡Ella te envió {r.reply_gift_label ?? r.reply_gift_type}!
                          </p>
                          <span className="text-xs bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full font-semibold">
                            Nuevo 💘
                          </span>
                        </div>
                        {r.reply_gift_message && (
                          <p className="text-xs text-pink-400 italic">"{r.reply_gift_message}"</p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        {r.woman_photo ? (
                          <img
                            src={r.woman_photo}
                            alt={r.woman_name}
                            className="w-14 h-14 rounded-2xl object-cover"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center">
                            <span className="text-white text-xl font-bold">{initial}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-bold text-gray-800">{r.woman_name}</p>
                          <span className={`flex-shrink-0 text-xs px-3 py-1 rounded-full font-semibold ${
                            isAccepted ? 'bg-green-100 text-green-700' :
                            isPending  ? 'bg-amber-100 text-amber-700' :
                                         'bg-red-100 text-red-500'
                          }`}>
                            {isAccepted ? '✓ Aceptada' :
                             isPending  ? '⏳ Pendiente' :
                                          'Rechazada'}
                          </span>
                        </div>

                        {r.message && (
                          <p className="text-sm text-gray-500 mt-1.5 italic bg-gray-50 rounded-xl px-3 py-2">
                            "{r.message}"
                          </p>
                        )}

                        <p className="text-gray-400 text-xs mt-2">
                          {new Date(r.created_at).toLocaleDateString('es-PE', {
                            day: '2-digit', month: 'long', year: 'numeric',
                          })}
                        </p>

                        {r.extra_gifts_sent > 0 && (
                          <p className="text-xs text-indigo-400 mt-1">
                            +{r.extra_gifts_sent} regalo{r.extra_gifts_sent > 1 ? 's' : ''} adicional{r.extra_gifts_sent > 1 ? 'es' : ''} enviado{r.extra_gifts_sent > 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    {isAccepted && (
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => setProfileModalFor(r.woman_id)}
                          className="flex-1 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-semibold hover:bg-indigo-100 transition"
                        >
                          Ver perfil
                        </button>
                        <button
                          onClick={() => setGiftModalFor(r.request_id)}
                          className="flex-1 py-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-xl text-sm font-semibold hover:from-indigo-600 hover:to-blue-600 transition shadow-sm"
                        >
                          Enviar regalo 🎁
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Gift modal */}
      {giftModalFor !== null && (
        <GiftModal
          requestId={giftModalFor}
          onClose={() => setGiftModalFor(null)}
          onSent={load}
        />
      )}

      {/* Woman profile modal */}
      {profileModalFor !== null && (
        <WomanProfileModal
          womanId={profileModalFor}
          onClose={() => setProfileModalFor(null)}
        />
      )}
    </div>
  )
}
