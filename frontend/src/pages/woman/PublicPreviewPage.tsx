import { useState, useEffect } from 'react'
import { getProfilePreview, getCardPreview } from '../../api'
import type { FullProfile } from '../../types'

type ViewMode = 'card' | 'full'

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

  if (loading) return <div className="flex justify-center mt-20 text-gray-400">Cargando preview...</div>

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Vista Pública de tu Perfil</h1>
        <span className="bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full font-medium">Preview</span>
      </div>
      <p className="text-gray-500 text-sm mb-6">
        Así ven tu perfil los hombres con suscripción activa.
      </p>

      {/* Toggle */}
      <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-8 w-fit">
        <button
          onClick={() => setView('card')}
          className={`px-5 py-2 text-sm font-medium transition ${view === 'card' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
          Tarjeta (explorar)
        </button>
        <button
          onClick={() => { setView('full'); setPhotoIdx(0) }}
          className={`px-5 py-2 text-sm font-medium transition ${view === 'full' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
          Perfil completo (tras match)
        </button>
      </div>

      {/* ── Card view ─────────────────────────────── */}
      {view === 'card' && (
        <div className="flex flex-col items-center">
          <p className="text-xs text-gray-400 mb-4 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 text-center">
            🔍 Así apareces en la galería. Solo se ve tu foto y nombre.
          </p>
          <div className="relative w-48 rounded-2xl overflow-hidden shadow-lg">
            <div className="aspect-[3/4] bg-gray-100">
              {card?.primary_photo_url ? (
                <img src={card.primary_photo_url} alt="" className="w-full h-full object-contain" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl text-gray-300">👤</div>
              )}
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
              <p className="text-white font-semibold">{card?.first_name || '(sin nombre)'}</p>
            </div>
          </div>
          <p className="text-gray-400 text-xs mt-4 text-center">El resto de tu información está oculta hasta que aceptes una solicitud.</p>
        </div>
      )}

      {/* ── Full profile view ──────────────────────── */}
      {view === 'full' && profile && (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <p className="text-xs text-gray-400 bg-green-50 border-b border-green-100 px-4 py-2 text-center">
            💘 Así ve tu perfil un hombre después de que lo aceptas.
          </p>

          {/* Photo carousel */}
          {profile.photos.length > 0 ? (
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
              <img
                src={profile.photos[photoIdx]?.photo_url}
                alt=""
                className="w-full h-full object-contain"
              />
              {profile.photos.length > 1 && (
                <>
                  <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                    {profile.photos.map((_, i) => (
                      <button key={i} onClick={() => setPhotoIdx(i)}
                        className={`w-2 h-2 rounded-full transition ${i === photoIdx ? 'bg-white' : 'bg-white/50'}`} />
                    ))}
                  </div>
                  {photoIdx > 0 && (
                    <button onClick={() => setPhotoIdx(i => i - 1)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full w-8 h-8 flex items-center justify-center">‹</button>
                  )}
                  {photoIdx < profile.photos.length - 1 && (
                    <button onClick={() => setPhotoIdx(i => i + 1)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full w-8 h-8 flex items-center justify-center">›</button>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-6xl text-gray-300">👤</div>
          )}

          <div className="p-6 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">{profile.first_name || '(sin nombre)'}, {profile.age}</h2>
              <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">Match! 💘</span>
            </div>
            {profile.location   && <div className="flex gap-2 text-gray-600"><span>📍</span><span>{profile.location}</span></div>}
            {profile.occupation && <div className="flex gap-2 text-gray-600"><span>💼</span><span>{profile.occupation}</span></div>}
            {profile.bio        && <div className="flex gap-2 text-gray-600"><span>📝</span><span>{profile.bio}</span></div>}
            {profile.phone      && <div className="flex gap-2"><span>📞</span><span className="text-primary font-medium">{profile.phone}</span></div>}
            {profile.instagram  && <div className="flex gap-2"><span>📷</span><span className="text-purple-600 font-medium">{profile.instagram}</span></div>}

            {!profile.location && !profile.occupation && !profile.bio && !profile.phone && !profile.instagram && (
              <p className="text-gray-400 text-center py-4">Tu perfil está incompleto. <a href="/woman/profile" className="text-primary underline">Edítalo aquí →</a></p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
