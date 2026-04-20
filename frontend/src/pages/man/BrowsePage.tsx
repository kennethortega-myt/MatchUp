import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { browseWomen, sendRequest } from '../../api'
import type { WomanCard, LookingFor } from '../../types'
import { COUNTRIES, getCitiesForCountry } from '../../data/locations'

const GIFTS = [
  { id: 'kiss',       emoji: '💋', label: 'Beso',       price: 'S/. 5'   },
  { id: 'balloon',    emoji: '🎈', label: 'Globos',     price: 'S/. 10'  },
  { id: 'chocolates', emoji: '🍫', label: 'Chocolates', price: 'S/. 15'  },
  { id: 'star',       emoji: '⭐', label: 'Estrella',   price: 'S/. 20'  },
  { id: 'flowers',    emoji: '💐', label: 'Flores',     price: 'S/. 25'  },
  { id: 'teddy',      emoji: '🧸', label: 'Osito',      price: 'S/. 35'  },
  { id: 'wine',       emoji: '🍷', label: 'Vino',       price: 'S/. 45'  },
  { id: 'cake',       emoji: '🎂', label: 'Torta',      price: 'S/. 55'  },
  { id: 'perfume',    emoji: '🌹', label: 'Perfume',    price: 'S/. 65'  },
  { id: 'ring',       emoji: '💍', label: 'Anillo',     price: 'S/. 99'  },
  { id: 'diamond',    emoji: '💎', label: 'Diamante',   price: 'S/. 150' },
  { id: 'crown',      emoji: '👑', label: 'Corona',     price: 'S/. 200' },
  { id: 'trip',       emoji: '✈️', label: 'Viaje',      price: 'S/. 350' },
  { id: 'yacht',      emoji: '🛥️', label: 'Yate',       price: 'S/. 500' },
]

const LOOKING_FOR_LABELS: Record<LookingFor, { label: string; emoji: string; color: string }> = {
  relationship: { label: 'Relación seria',   emoji: '💑', color: 'bg-pink-100 text-pink-700' },
  casual:       { label: 'Pasar el rato',    emoji: '😊', color: 'bg-yellow-100 text-yellow-700' },
  commitment:   { label: 'Compromiso',        emoji: '💍', color: 'bg-purple-100 text-purple-700' },
  outing:       { label: 'Salir a pasear',   emoji: '🌸', color: 'bg-green-100 text-green-700' },
  surprise:     { label: 'Sorpréndeme',       emoji: '✨', color: 'bg-blue-100 text-blue-700' },
}

interface RequestModal { userId: number; name: string }

export default function BrowsePage() {
  const [women, setWomen]               = useState<WomanCard[]>([])
  const [loading, setLoading]           = useState(true)
  const [page, setPage]                 = useState(1)
  const [countryFilter, setCountryFilter] = useState('')
  const [cityFilter, setCityFilter]     = useState('')
  const [modal, setModal]               = useState<RequestModal | null>(null)
  const [message, setMessage]           = useState('')
  const [selectedGift, setSelectedGift] = useState<string | null>(null)
  const [giftMessage, setGiftMessage]   = useState('')
  const [sending, setSending]           = useState(false)
  const navigate = useNavigate()

  const load = (p = 1, country?: string, city?: string) => {
    setLoading(true)
    browseWomen(p, country || undefined, city || undefined)
      .then(r => { setWomen(r.data); setLoading(false) })
      .catch(err => {
        if (err.response?.status === 402) navigate('/man/subscribe')
        setLoading(false)
      })
  }

  useEffect(() => { load(page, countryFilter, cityFilter) }, [page])

  const handleSearch = () => {
    setPage(1)
    load(1, countryFilter, cityFilter)
  }

  const openModal = (userId: number, name: string) => {
    setModal({ userId, name })
    setMessage('')
    setSelectedGift(null)
    setGiftMessage('')
  }

  const closeModal = () => {
    setModal(null)
    setMessage('')
    setSelectedGift(null)
    setGiftMessage('')
  }

  const handleSend = async () => {
    if (!modal) return
    setSending(true)
    try {
      await sendRequest(modal.userId, message || undefined, selectedGift || undefined, giftMessage || undefined)
      toast.success('¡Solicitud enviada! 💌')
      closeModal()
      load(page, countryFilter, cityFilter)
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Error al enviar')
    } finally {
      setSending(false)
    }
  }

  const statusBadge = (status?: string | null) => {
    if (!status) return null
    const cfg: Record<string, { label: string; cls: string }> = {
      pending:  { label: 'Enviado ⏳',  cls: 'bg-yellow-100 text-yellow-700' },
      accepted: { label: 'Match! 💘',   cls: 'bg-green-100 text-green-700'  },
      rejected: { label: 'Rechazado',   cls: 'bg-red-100 text-red-600'      },
    }
    const c = cfg[status]
    return c ? <span className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-medium ${c.cls}`}>{c.label}</span> : null
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Explorar 🔍</h1>
        <p className="text-sm text-gray-400">Encuentra a alguien especial</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Filtrar por ubicación</p>
        <div className="flex flex-wrap gap-2">
          <select
            value={countryFilter}
            onChange={e => { setCountryFilter(e.target.value); setCityFilter('') }}
            className="flex-1 min-w-[140px] border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white"
          >
            <option value="">🌎 Todos los países</option>
            {COUNTRIES.map(c => (
              <option key={c.code} value={c.name}>{c.name}</option>
            ))}
          </select>
          <select
            value={cityFilter}
            onChange={e => setCityFilter(e.target.value)}
            disabled={!countryFilter}
            className="flex-1 min-w-[140px] border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white disabled:opacity-50"
          >
            <option value="">🏙 Todas las ciudades</option>
            {getCitiesForCountry(countryFilter).map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-pink-500 text-white rounded-xl text-sm font-medium hover:bg-pink-600 transition"
          >
            Buscar
          </button>
          {(countryFilter || cityFilter) && (
            <button
              onClick={() => { setCountryFilter(''); setCityFilter(''); setPage(1); load(1) }}
              className="px-3 py-2 border border-gray-200 text-gray-500 rounded-xl text-sm hover:bg-gray-50 transition"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="text-5xl animate-pulse mb-3">🌸</div>
          <p className="text-gray-400">Buscando perfiles...</p>
        </div>
      ) : women.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">🌸</p>
          <p>No hay perfiles disponibles{(countryFilter || cityFilter) ? ' con esos filtros' : ' aún'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {women.map(w => (
            <div key={w.user_id} className="relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 group cursor-pointer">
              <div className="aspect-[3/4] bg-gray-100 overflow-hidden">
                {w.primary_photo_url ? (
                  <img
                    src={w.primary_photo_url}
                    alt={w.first_name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl text-gray-300">👤</div>
                )}
              </div>

              {/* Gradient overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3 pt-8">
                <p className="text-white font-bold text-sm leading-tight">
                  {w.first_name}{w.age ? `, ${w.age}` : ''}
                </p>
                {(w.city || w.country) && (
                  <p className="text-white/70 text-xs mt-0.5">
                    📍 {[w.city, w.country].filter(Boolean).join(', ')}
                  </p>
                )}
                {w.looking_for && (
                  <div className={`inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${LOOKING_FOR_LABELS[w.looking_for].color}`}>
                    <span>{LOOKING_FOR_LABELS[w.looking_for].emoji}</span>
                    <span>{LOOKING_FOR_LABELS[w.looking_for].label}</span>
                  </div>
                )}
              </div>

              {statusBadge(w.request_status)}

              {!w.request_status && (
                <button
                  onClick={() => openModal(w.user_id, w.first_name)}
                  className="absolute inset-0 bg-transparent hover:bg-black/10 transition flex items-center justify-center opacity-0 group-hover:opacity-100"
                >
                  <span className="bg-pink-500 text-white text-xs px-4 py-2 rounded-full font-semibold shadow-lg">
                    Enviar solicitud 💌
                  </span>
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-8">
        {page > 1 && (
          <button onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm transition">← Anterior</button>
        )}
        {women.length === 12 && (
          <button onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm transition">Siguiente →</button>
        )}
      </div>

      {/* Request modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-8 overflow-y-auto" onClick={closeModal}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md my-auto" onClick={e => e.stopPropagation()}>
            <div className="h-1.5 bg-gradient-to-r from-pink-400 to-rose-400 rounded-t-3xl" />
            <div className="p-6">
              <h2 className="font-bold text-gray-800 text-lg mb-1">Enviar a {modal.name} 💌</h2>
              <p className="text-gray-400 text-sm mb-5">Tu información solo se revela si ella acepta.</p>

              <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje (opcional)</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={2}
                placeholder="Hola, me gustaría conocerte..."
                className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none mb-5 text-sm"
              />

              <p className="text-sm font-medium text-gray-700 mb-2">¿Añadir un regalo? (opcional)</p>
              <div className="grid grid-cols-4 gap-1.5 mb-3 max-h-56 overflow-y-auto pr-1">
                <button
                  type="button"
                  onClick={() => setSelectedGift(null)}
                  className={`flex flex-col items-center py-2 rounded-xl border-2 text-xs transition ${
                    selectedGift === null ? 'border-gray-400 bg-gray-50' : 'border-gray-100 hover:border-gray-300'
                  }`}
                >
                  <span className="text-xl mb-0.5">🚫</span>
                  <span className="text-gray-400">Ninguno</span>
                </button>
                {GIFTS.map(g => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setSelectedGift(g.id)}
                    className={`flex flex-col items-center py-2 rounded-xl border-2 text-xs transition ${
                      selectedGift === g.id ? 'border-pink-400 bg-pink-50' : 'border-gray-100 hover:border-pink-200'
                    }`}
                  >
                    <span className="text-xl mb-0.5">{g.emoji}</span>
                    <span className="font-medium text-gray-700 leading-tight">{g.label}</span>
                    <span className="text-gray-400">{g.price}</span>
                  </button>
                ))}
              </div>

              {selectedGift && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nota del regalo</label>
                  <input
                    value={giftMessage}
                    onChange={e => setGiftMessage(e.target.value)}
                    placeholder="Con cariño 💕"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm"
                  />
                </div>
              )}

              <div className="flex gap-3 mt-2">
                <button onClick={closeModal}
                  className="flex-1 bg-gray-100 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-200 transition">
                  Cancelar
                </button>
                <button
                  onClick={handleSend}
                  disabled={sending}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:from-pink-600 hover:to-rose-600 transition disabled:opacity-50"
                >
                  {sending ? 'Enviando...' : selectedGift ? `Enviar con ${GIFTS.find(g => g.id === selectedGift)?.emoji}` : 'Enviar 💌'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
