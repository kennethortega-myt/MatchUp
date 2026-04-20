import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getSentGifts } from '../../api'
import type { GiftSentSummary, GiftSent } from '../../types'

function SentGiftCard({ gift }: { gift: GiftSent }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
      <div className="h-1 bg-gradient-to-r from-blue-400 to-indigo-500" />
      <div className="p-5">
        {/* Recipient */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative shrink-0">
            {gift.woman_photo ? (
              <img
                src={gift.woman_photo}
                alt={gift.woman_name}
                className="w-11 h-11 rounded-full object-cover ring-2 ring-blue-100"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white font-bold text-lg">
                {gift.woman_name[0].toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-800 text-sm truncate">Para: {gift.woman_name}</p>
            <p className="text-xs text-gray-400">
              {new Date(gift.created_at).toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-sm font-bold text-gray-700">S/ {gift.gift_value.toFixed(2)}</p>
          </div>
        </div>

        {/* Gift info */}
        <div className="bg-blue-50 rounded-2xl p-4 flex items-center gap-3">
          <span className="text-4xl">{gift.gift_emoji}</span>
          <div>
            <p className="font-semibold text-gray-800">{gift.gift_label}</p>
            {gift.gift_message && (
              <p className="text-xs text-gray-500 italic mt-0.5">"{gift.gift_message}"</p>
            )}
          </div>
        </div>

        {/* Reply received */}
        {gift.reply_received && (
          <div className="mt-3 flex items-center gap-2 bg-pink-50 rounded-xl px-3 py-2.5">
            <span className="text-lg">{gift.reply_gift_emoji || '💝'}</span>
            <div>
              <p className="text-xs font-semibold text-pink-600">¡Respondió con {gift.reply_gift_label}!</p>
              {gift.reply_gift_message && (
                <p className="text-xs text-gray-500 mt-0.5">"{gift.reply_gift_message}"</p>
              )}
            </div>
          </div>
        )}

        {!gift.reply_received && !gift.is_transaction && (
          <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-400">
            <span>⏳</span>
            <span>Esperando respuesta...</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ManGiftsPage() {
  const [summary, setSummary] = useState<GiftSentSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSentGifts()
      .then(res => setSummary(res.data))
      .catch(() => toast.error('Error al cargar los regalos'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl animate-bounce mb-3">🎁</div>
          <p className="text-gray-500 font-medium">Cargando regalos enviados...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-50">
      <div className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Regalos Enviados 🎁</h1>
            <p className="text-xs text-gray-400">Historial de regalos que has enviado</p>
          </div>
          <Link to="/man" className="text-sm text-blue-500 font-medium hover:text-blue-600">← Volver</Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white rounded-2xl shadow-sm p-4 border border-blue-100">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">🎁</span>
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Enviados</span>
            </div>
            <p className="text-3xl font-bold text-gray-800">{summary?.total_sent ?? 0}</p>
            <p className="text-xs text-gray-400 mt-0.5">regalos</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-4 border border-indigo-100">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">💸</span>
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Invertido</span>
            </div>
            <p className="text-3xl font-bold text-indigo-600">S/ {(summary?.total_spent ?? 0).toFixed(2)}</p>
            <p className="text-xs text-gray-400 mt-0.5">en detalles</p>
          </div>
        </div>

        {!summary?.gifts.length ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎀</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Aún no has enviado regalos</h3>
            <p className="text-sm text-gray-400">Sorprende a alguien especial con un detalle</p>
            <Link to="/man/browse" className="inline-block mt-4 px-5 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-semibold hover:bg-blue-600 transition">
              Explorar perfiles
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {summary.gifts.map(gift => (
              <SentGiftCard key={gift.is_transaction ? `tx-${gift.request_id}` : `req-${gift.request_id}`} gift={gift} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
