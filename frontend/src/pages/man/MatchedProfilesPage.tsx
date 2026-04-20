import { useState, useEffect } from 'react'
import { getAcceptedMatches } from '../../api'
import type { FullProfile } from '../../types'

export default function MatchedProfilesPage() {
  const [matches, setMatches] = useState<FullProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<FullProfile | null>(null)
  const [photoIdx, setPhotoIdx] = useState(0)

  useEffect(() => {
    getAcceptedMatches().then(r => { setMatches(r.data); setLoading(false) })
  }, [])

  if (loading) return <div className="flex justify-center mt-20 text-gray-400">Cargando...</div>

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Mis Matches 💘 ({matches.length})</h1>

      {matches.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">💘</p>
          <p>Aún no tienes matches aceptados</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {matches.map(m => {
            const primary = m.photos.find(p => p.is_primary) || m.photos[0]
            return (
              <div key={m.user_id} onClick={() => { setSelected(m); setPhotoIdx(0) }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer group">
                <div className="aspect-[3/4] bg-gray-100 overflow-hidden">
                  {primary ? (
                    <img src={primary.photo_url} alt={m.first_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl text-gray-300">👤</div>
                  )}
                </div>
                <div className="p-3">
                  <p className="font-semibold text-gray-800">{m.first_name}, {m.age}</p>
                  {m.location && <p className="text-gray-400 text-xs">📍 {m.location}</p>}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Full profile modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4 py-8 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            {/* Photo carousel */}
            {selected.photos.length > 0 && (
              <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
                <img src={selected.photos[photoIdx]?.photo_url} alt="" className="w-full h-full object-cover" />
                {selected.photos.length > 1 && (
                  <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                    {selected.photos.map((_, i) => (
                      <button key={i} onClick={() => setPhotoIdx(i)}
                        className={`w-2 h-2 rounded-full transition ${i === photoIdx ? 'bg-white' : 'bg-white/50'}`} />
                    ))}
                  </div>
                )}
                {photoIdx > 0 && (
                  <button onClick={() => setPhotoIdx(i => i - 1)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full w-8 h-8 flex items-center justify-center">‹</button>
                )}
                {photoIdx < selected.photos.length - 1 && (
                  <button onClick={() => setPhotoIdx(i => i + 1)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full w-8 h-8 flex items-center justify-center">›</button>
                )}
              </div>
            )}

            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{selected.first_name}, {selected.age}</h2>
                <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">Match! 💘</span>
              </div>

              <div className="space-y-3 text-sm">
                {selected.location && <div className="flex gap-2"><span className="text-gray-400">📍</span><span>{selected.location}</span></div>}
                {selected.occupation && <div className="flex gap-2"><span className="text-gray-400">💼</span><span>{selected.occupation}</span></div>}
                {selected.bio && <div className="flex gap-2"><span className="text-gray-400">📝</span><span className="text-gray-600">{selected.bio}</span></div>}
                {selected.phone && (
                  <div className="flex gap-2"><span className="text-gray-400">📞</span>
                    <a href={`tel:${selected.phone}`} className="text-primary font-medium hover:underline">{selected.phone}</a>
                  </div>
                )}
                {selected.instagram && (
                  <div className="flex gap-2"><span className="text-gray-400">📷</span>
                    <span className="text-purple-600 font-medium">{selected.instagram}</span>
                  </div>
                )}
              </div>

              <button onClick={() => setSelected(null)}
                className="mt-6 w-full bg-gray-100 text-gray-600 py-2 rounded-xl text-sm font-medium hover:bg-gray-200 transition">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
