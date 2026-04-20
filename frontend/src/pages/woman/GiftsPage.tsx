import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getReceivedGifts, replyToGift, getBalance, requestWithdrawal } from '../../api'
import type { GiftSummary, GiftReceived, BalanceOut, WithdrawalRequest } from '../../types'

/* ─── Gift catalog ─────────────────────────────────────────── */
const GIFT_CATALOG = [
  { type: 'kiss',       emoji: '💋', label: 'Beso'        },
  { type: 'balloon',    emoji: '🎈', label: 'Globos'      },
  { type: 'chocolates', emoji: '🍫', label: 'Chocolates'  },
  { type: 'star',       emoji: '⭐', label: 'Estrella'    },
  { type: 'flowers',    emoji: '💐', label: 'Flores'      },
  { type: 'teddy',      emoji: '🧸', label: 'Osito'       },
  { type: 'wine',       emoji: '🍷', label: 'Vino'        },
  { type: 'cake',       emoji: '🎂', label: 'Torta'       },
  { type: 'perfume',    emoji: '🌹', label: 'Perfume'     },
  { type: 'ring',       emoji: '💍', label: 'Anillo'      },
  { type: 'diamond',    emoji: '💎', label: 'Diamante'    },
  { type: 'crown',      emoji: '👑', label: 'Corona'      },
  { type: 'trip',       emoji: '✈️', label: 'Viaje'       },
  { type: 'yacht',      emoji: '🛥️', label: 'Yate'        },
]

/* ─── Animation keyframes ──────────────────────────────────── */
const ANIM_CSS = `
  @keyframes bearWalkIn {
    0%   { transform: translateX(-110vw) scaleX(1); }
    78%  { transform: translateX(6px)   scaleX(1); }
    88%  { transform: translateX(-4px)  scaleX(1); }
    100% { transform: translateX(0)     scaleX(1); }
  }
  @keyframes bodyBob {
    0%, 100% { transform: translateY(0px) rotate(0deg);   }
    25%      { transform: translateY(-6px) rotate(-1.5deg); }
    75%      { transform: translateY(-6px) rotate(1.5deg);  }
  }
  @keyframes legSwingL {
    0%, 100% { transform: rotate(30deg);  }
    50%      { transform: rotate(-30deg); }
  }
  @keyframes legSwingR {
    0%, 100% { transform: rotate(-30deg); }
    50%      { transform: rotate(30deg);  }
  }
  @keyframes armSwingL {
    0%, 100% { transform: rotate(-20deg); }
    50%      { transform: rotate(20deg);  }
  }
  @keyframes armSwingR {
    0%, 100% { transform: rotate(20deg);  }
    50%      { transform: rotate(-20deg); }
  }
  @keyframes giftPop {
    0%   { transform: scale(0) translateY(10px); opacity: 0; }
    60%  { transform: scale(1.35) translateY(-10px); opacity: 1; }
    100% { transform: scale(1) translateY(0); opacity: 1; }
  }
  @keyframes labelUp {
    from { transform: translateY(20px); opacity: 0; }
    to   { transform: translateY(0);    opacity: 1; }
  }
  @keyframes sparkUp {
    0%   { transform: translateY(0) scale(0.3) rotate(0deg);   opacity: 0; }
    35%  { opacity: 1; transform: translateY(-18px) scale(1) rotate(60deg); }
    100% { transform: translateY(-52px) scale(0.1) rotate(120deg); opacity: 0; }
  }
  @keyframes confettiFall {
    0%   { transform: translateY(-30px) rotate(0deg);    opacity: 1; }
    100% { transform: translateY(100vh) rotate(600deg);  opacity: 0; }
  }
  @keyframes sceneIn  { from { opacity: 0; } to { opacity: 1; } }
  @keyframes sceneOut {
    0%, 62% { opacity: 1; }
    100%    { opacity: 0; }
  }
`

/* ─── Bear SVG ─────────────────────────────────────────────── */
function BearSVG({
  walking,
  armRaised,
}: { walking: boolean; armRaised: boolean }) {
  const legLStyle: React.CSSProperties = walking
    ? { transformOrigin: '52px 194px', animation: 'legSwingL 0.38s ease-in-out infinite' }
    : { transformOrigin: '52px 194px', transform: 'rotate(0deg)' }

  const legRStyle: React.CSSProperties = walking
    ? { transformOrigin: '100px 194px', animation: 'legSwingR 0.38s ease-in-out infinite' }
    : { transformOrigin: '100px 194px', transform: 'rotate(0deg)' }

  const armLStyle: React.CSSProperties = walking
    ? { transformOrigin: '44px 116px', animation: 'armSwingL 0.38s ease-in-out infinite' }
    : { transformOrigin: '44px 116px', transform: 'rotate(-12deg)' }

  const armRStyle: React.CSSProperties = armRaised
    ? { transformOrigin: '110px 116px', transform: 'rotate(-115deg)', transition: 'transform 0.7s cubic-bezier(.34,1.56,.64,1)' }
    : walking
    ? { transformOrigin: '110px 116px', animation: 'armSwingR 0.38s ease-in-out infinite' }
    : { transformOrigin: '110px 116px', transform: 'rotate(12deg)', transition: 'transform 0.4s ease' }

  return (
    <svg
      width="154"
      height="234"
      viewBox="0 0 154 234"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ── Ears ── */}
      <circle cx="42" cy="42" r="20" fill="#7B4F2E" />
      <circle cx="112" cy="42" r="20" fill="#7B4F2E" />
      <circle cx="42" cy="42" r="11" fill="#C47E52" />
      <circle cx="112" cy="42" r="11" fill="#C47E52" />

      {/* ── Head ── */}
      <circle cx="77" cy="76" r="46" fill="#9B6339" />

      {/* ── Eyes ── */}
      <circle cx="59" cy="66" r="9" fill="#1C0A00" />
      <circle cx="95" cy="66" r="9" fill="#1C0A00" />
      <circle cx="62" cy="63" r="3.5" fill="white" />
      <circle cx="98" cy="63" r="3.5" fill="white" />
      <circle cx="64" cy="64.5" r="1.5" fill="#1C0A00" />
      <circle cx="100" cy="64.5" r="1.5" fill="#1C0A00" />

      {/* ── Muzzle ── */}
      <ellipse cx="77" cy="96" rx="24" ry="17" fill="#C47E52" />
      <ellipse cx="77" cy="87" rx="9" ry="7" fill="#1C0A00" />
      <circle cx="74" cy="86" r="2" fill="#3a1500" />
      <circle cx="80" cy="86" r="2" fill="#3a1500" />
      {/* Smile */}
      <path d="M 64 101 Q 77 114 90 101" stroke="#1C0A00" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* ── Cheek blush ── */}
      <ellipse cx="48" cy="88" rx="11" ry="7" fill="#e8836a" opacity="0.4" />
      <ellipse cx="106" cy="88" rx="11" ry="7" fill="#e8836a" opacity="0.4" />

      {/* ── Left arm ── */}
      <g style={armLStyle}>
        <rect x="31" y="114" width="26" height="58" rx="13" fill="#9B6339" />
        <ellipse cx="44" cy="175" rx="16" ry="10" fill="#7B4F2E" />
      </g>

      {/* ── Body ── */}
      <ellipse cx="77" cy="158" rx="44" ry="56" fill="#9B6339" />
      {/* Belly */}
      <ellipse cx="77" cy="164" rx="29" ry="38" fill="#C47E52" />

      {/* ── Right arm (gift arm) ── */}
      <g style={armRStyle}>
        <rect x="97" y="114" width="26" height="58" rx="13" fill="#9B6339" />
        <ellipse cx="110" cy="175" rx="16" ry="10" fill="#7B4F2E" />
      </g>

      {/* ── Left leg ── */}
      <g style={legLStyle}>
        <rect x="36" y="192" width="32" height="44" rx="16" fill="#9B6339" />
        <ellipse cx="52" cy="237" rx="20" ry="12" fill="#7B4F2E" />
      </g>

      {/* ── Right leg ── */}
      <g style={legRStyle}>
        <rect x="86" y="192" width="32" height="44" rx="16" fill="#9B6339" />
        <ellipse cx="102" cy="237" rx="20" ry="12" fill="#7B4F2E" />
      </g>
    </svg>
  )
}

/* ─── Full-screen gift reveal animation ────────────────────── */
function GiftRevealAnimation({
  giftEmoji, giftLabel, onDone,
}: { giftEmoji: string; giftLabel: string; onDone: () => void }) {
  const [phase, setPhase] = useState<'walk' | 'present' | 'out'>('walk')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('present'), 1050)
    const t2 = setTimeout(() => setPhase('out'),    4200)
    const t3 = setTimeout(onDone,                   4800)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onDone])

  const confetti = useMemo(() =>
    Array.from({ length: 18 }, (_, i) => ({
      left: `${3 + i * 5.3}%`,
      color: ['#ff6b6b','#ffd93d','#6bcb77','#4d96ff','#ff6b9d','#c77dff'][i % 6],
      delay: `${(i * 0.11) % 1.8}s`,
      dur:   `${2.4 + (i * 0.09) % 1.2}s`,
      width:  `${6 + (i * 3) % 8}px`,
      height: `${10 + (i * 2) % 8}px`,
    })), [])

  const sparks = useMemo(() =>
    ['✨','🌟','💫','✨','🌟','💫','✨','🌟'].map((s, i) => ({
      s, i,
      left: `${8 + i * 11}%`,
      top:  `${15 + (i % 3) * 22}%`,
      delay: `${i * 0.14}s`,
    })), [])

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
      style={{ animation: phase === 'out' ? 'sceneOut 0.6s forwards' : 'sceneIn 0.3s forwards' }}
    >
      <style>{ANIM_CSS}</style>

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/75 via-rose-400/75 to-purple-500/75 backdrop-blur-md" />

      {/* Confetti */}
      {confetti.map((c, i) => (
        <div
          key={i}
          className="absolute rounded-sm pointer-events-none"
          style={{
            left: c.left, top: '-20px',
            width: c.width, height: c.height,
            backgroundColor: c.color,
            animation: `confettiFall ${c.dur} ${c.delay} linear forwards`,
          }}
        />
      ))}

      {/* Sparkles (only during present phase) */}
      {phase !== 'walk' && sparks.map(({ s, i, left, top, delay }) => (
        <span
          key={i}
          className="absolute pointer-events-none select-none"
          style={{
            left, top,
            fontSize: '1.4rem',
            animation: `sparkUp 1.1s ${delay} ease-out infinite`,
          }}
        >
          {s}
        </span>
      ))}

      {/* Main panel */}
      <div className="relative z-10 flex flex-col items-center gap-5">

        {/* Bear + gift container */}
        <div className="relative">
          {/* Bear walks in */}
          <div
            style={{
              animation: phase === 'walk'
                ? 'bearWalkIn 1.05s cubic-bezier(.17,.67,.38,1.1) forwards'
                : 'none',
            }}
          >
            <div
              style={{
                animation: phase === 'walk' ? 'bodyBob 0.38s ease-in-out infinite' : 'none',
              }}
            >
              <BearSVG walking={phase === 'walk'} armRaised={phase !== 'walk'} />
            </div>
          </div>

          {/* Gift emoji — floats above raised paw */}
          {phase !== 'walk' && (
            <div
              className="absolute pointer-events-none select-none"
              style={{
                top: '-10px',
                right: '-22px',
                animation: 'giftPop 0.65s cubic-bezier(.34,1.56,.64,1) forwards',
              }}
            >
              <span style={{ fontSize: '4.5rem', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }}>
                {giftEmoji}
              </span>
            </div>
          )}
        </div>

        {/* Label card */}
        {phase !== 'walk' && (
          <div
            className="bg-white/95 backdrop-blur-sm rounded-3xl px-8 py-4 shadow-2xl text-center"
            style={{ animation: 'labelUp 0.45s 0.2s ease-out both' }}
          >
            <p className="text-2xl font-extrabold text-pink-600">¡{giftLabel}!</p>
            <p className="text-sm text-gray-500 mt-0.5">El oso te trae un regalo 🐻💝</p>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── GiftCard ─────────────────────────────────────────────── */
function GiftCard({ gift, onReply }: { gift: GiftReceived; onReply: (gift: GiftReceived) => void }) {
  const [opened, setOpened] = useState(false)
  const [animating, setAnimating] = useState(false)
  const [bearShowing, setBearShowing] = useState(false)

  const handleOpen = () => {
    if (opened) return
    setAnimating(true)
    setTimeout(() => {
      setOpened(true)
      setAnimating(false)
      setBearShowing(true)
    }, 700)
  }

  return (
    <>
      {bearShowing && (
        <GiftRevealAnimation
          giftEmoji={gift.gift_emoji}
          giftLabel={gift.gift_label}
          onDone={() => setBearShowing(false)}
        />
      )}

      <div className={`relative bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-pink-100 ${opened ? 'ring-2 ring-pink-300' : ''}`}>
        <div className="h-1.5 bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500" />

        <div className="p-5">
          {/* Sender */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative shrink-0">
              {gift.man_info?.photo_url ? (
                <img
                  src={gift.man_info.photo_url}
                  alt={gift.man_info.first_name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-pink-200"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                  {(gift.man_info?.first_name || 'A')[0].toUpperCase()}
                </div>
              )}
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 text-sm truncate">
                {gift.man_info?.first_name || 'Anónimo'}
                {gift.man_info?.age ? <span className="text-gray-400 font-normal ml-1">{gift.man_info.age} años</span> : null}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {[gift.man_info?.city, gift.man_info?.country].filter(Boolean).join(', ') || 'Ubicación desconocida'}
              </p>
            </div>
            <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">
              {new Date(gift.created_at).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })}
            </span>
          </div>

          {/* Gift box */}
          {!opened ? (
            <button
              onClick={handleOpen}
              className={`w-full flex flex-col items-center justify-center gap-2 py-8 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 border-2 border-dashed border-pink-200 hover:border-pink-400 hover:from-pink-100 hover:to-rose-100 transition-all group ${animating ? 'animate-pulse' : ''}`}
            >
              <span className={`text-5xl transition-transform duration-700 ${animating ? 'scale-125 rotate-12' : 'group-hover:scale-110'}`}>
                🎁
              </span>
              <span className="text-sm font-medium text-pink-500 group-hover:text-pink-600">
                {animating ? '✨ Abriendo...' : 'Toca para abrir tu regalo'}
              </span>
            </button>
          ) : (
            <div className="rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 p-5 text-center">
              <div className="text-6xl mb-3">{gift.gift_emoji}</div>
              <p className="font-bold text-gray-800 text-lg mb-1">{gift.gift_label}</p>
              {gift.gift_message && (
                <p className="text-sm text-gray-500 italic mb-3">"{gift.gift_message}"</p>
              )}
              <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full text-sm font-semibold">
                <span>💰</span>
                <span>+S/ {gift.woman_earning.toFixed(2)} ganados</span>
              </div>
            </div>
          )}

          {/* Reply section */}
          {opened && !gift.is_transaction && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              {gift.reply_gift_type ? (
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-purple-50 rounded-xl px-3 py-2.5">
                  <span className="text-lg">{gift.reply_gift_emoji}</span>
                  <div>
                    <span className="font-medium text-purple-700">Respondiste con {gift.reply_gift_label}</span>
                    {gift.reply_gift_message && (
                      <p className="text-xs text-gray-500 mt-0.5">"{gift.reply_gift_message}"</p>
                    )}
                  </div>
                </div>
              ) : gift.request_status === 'accepted' ? (
                <button
                  onClick={() => onReply(gift)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-sm hover:shadow-md"
                >
                  <span>💝</span>
                  <span>Responder con un regalo</span>
                </button>
              ) : gift.request_status === 'rejected' ? (
                <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 bg-gray-50 rounded-xl px-3 py-2">
                  <span>🚫</span>
                  <span>Solicitud rechazada — no se puede responder</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-1.5 text-xs text-amber-600 bg-amber-50 rounded-xl px-3 py-2">
                  <span>⏳</span>
                  <span>Acepta la solicitud para poder responder</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

/* ─── ReplyModal ───────────────────────────────────────────── */
function ReplyModal({ gift, onClose, onSent }: { gift: GiftReceived; onClose: () => void; onSent: () => void }) {
  const [selectedGift, setSelectedGift] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!selectedGift) { toast.error('Selecciona un regalo'); return }
    setLoading(true)
    try {
      await replyToGift(gift.request_id, selectedGift, message || undefined)
      toast.success('¡Regalo enviado! 💝')
      onSent()
      onClose()
    } catch {
      toast.error('Error al enviar el regalo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="text-center mb-5">
          <div className="text-4xl mb-2">💝</div>
          <h2 className="text-xl font-bold text-gray-800">Responder a {gift.man_info?.first_name || 'él'}</h2>
          <p className="text-sm text-gray-500 mt-1">Envía un regalo de vuelta</p>
        </div>
        <div className="grid grid-cols-4 gap-2 mb-4">
          {GIFT_CATALOG.map(g => (
            <button
              key={g.type}
              onClick={() => setSelectedGift(g.type)}
              className={`flex flex-col items-center gap-1 py-2.5 rounded-2xl border-2 transition-all ${
                selectedGift === g.type
                  ? 'border-pink-400 bg-pink-50 shadow-sm'
                  : 'border-gray-100 hover:border-pink-200 hover:bg-pink-50'
              }`}
            >
              <span className="text-xl">{g.emoji}</span>
              <span className="text-xs text-gray-600 font-medium leading-tight text-center">{g.label}</span>
            </button>
          ))}
        </div>
        <textarea
          rows={2}
          placeholder="Mensaje opcional..."
          value={message}
          onChange={e => setMessage(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-pink-300 mb-4"
        />
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition">
            Cancelar
          </button>
          <button
            onClick={handleSend}
            disabled={loading || !selectedGift}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-semibold hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 transition"
          >
            {loading ? 'Enviando...' : 'Enviar 💝'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Withdraw Modal ───────────────────────────────────────── */
const METHOD_LABELS: Record<string, string> = {
  yape: 'Yape', plin: 'Plin', transfer: 'Transferencia bancaria',
}

function WithdrawModal({ available, onClose, onSent }: {
  available: number; onClose: () => void; onSent: () => void
}) {
  const [amount, setAmount]   = useState('')
  const [method, setMethod]   = useState('')
  const [account, setAccount] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    const amt = parseFloat(amount)
    if (!amt || amt < 10) { toast.error('Mínimo S/. 10.00'); return }
    if (amt > available)  { toast.error('Saldo insuficiente'); return }
    if (!method)          { toast.error('Selecciona un método'); return }
    if (!account.trim())  { toast.error('Ingresa los datos de tu cuenta'); return }
    setLoading(true)
    try {
      await requestWithdrawal(amt, method, account)
      toast.success('¡Solicitud enviada! El equipo la procesará pronto.')
      onSent()
      onClose()
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Error al solicitar retiro')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
        <div className="text-center mb-5">
          <div className="text-4xl mb-2">💸</div>
          <h2 className="text-xl font-bold text-gray-800">Retirar ganancias</h2>
          <p className="text-sm text-gray-500 mt-1">
            Disponible: <span className="font-bold text-emerald-600">S/. {available.toFixed(2)}</span>
          </p>
        </div>

        {/* Amount */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">Monto a retirar (mín. S/. 10)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">S/.</span>
            <input
              type="number" min="10" step="0.01"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full border border-gray-200 rounded-xl pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
          </div>
          <button
            onClick={() => setAmount(available.toFixed(2))}
            className="mt-1 text-xs text-emerald-600 hover:underline"
          >
            Retirar todo
          </button>
        </div>

        {/* Method */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">Método de pago</label>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(METHOD_LABELS).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setMethod(key)}
                className={`py-2.5 rounded-xl border-2 text-xs font-semibold transition ${
                  method === key
                    ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                    : 'border-gray-100 text-gray-600 hover:border-emerald-200'
                }`}
              >
                {key === 'yape' ? '💜' : key === 'plin' ? '🟢' : '🏦'} {label}
              </button>
            ))}
          </div>
        </div>

        {/* Account info */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">
            {method === 'transfer' ? 'N° de cuenta / CCI' : 'N° de celular'}
          </label>
          <input
            type="text"
            value={account}
            onChange={e => setAccount(e.target.value)}
            placeholder={method === 'transfer' ? 'Ej: 00219300012345678901' : 'Ej: 987654321'}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
          />
        </div>

        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition">
            Cancelar
          </button>
          <button
            onClick={handleSend}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-semibold hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 transition"
          >
            {loading ? 'Enviando...' : 'Solicitar retiro'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Withdrawal history row ───────────────────────────────── */
function WithdrawalRow({ w }: { w: WithdrawalRequest }) {
  const statusCfg = {
    pending:  { label: 'En proceso',  cls: 'bg-amber-100 text-amber-700' },
    approved: { label: 'Pagado ✓',    cls: 'bg-emerald-100 text-emerald-700' },
    rejected: { label: 'Rechazado',   cls: 'bg-red-100 text-red-600' },
  }[w.status] ?? { label: w.status, cls: 'bg-gray-100 text-gray-600' }

  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
      <div className="flex items-center gap-2.5">
        <span className="text-lg">{w.method === 'yape' ? '💜' : w.method === 'plin' ? '🟢' : '🏦'}</span>
        <div>
          <p className="text-sm font-medium text-gray-800">S/. {w.amount.toFixed(2)}</p>
          <p className="text-xs text-gray-400">{METHOD_LABELS[w.method]} · {w.account_info}</p>
          {w.admin_notes && <p className="text-xs text-gray-400 italic mt-0.5">"{w.admin_notes}"</p>}
        </div>
      </div>
      <div className="text-right shrink-0 ml-3">
        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusCfg.cls}`}>{statusCfg.label}</span>
        <p className="text-xs text-gray-300 mt-0.5">{new Date(w.created_at).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })}</p>
      </div>
    </div>
  )
}

/* ─── Page ─────────────────────────────────────────────────── */
export default function GiftsPage() {
  const [summary,   setSummary]   = useState<GiftSummary | null>(null)
  const [balance,   setBalance]   = useState<BalanceOut | null>(null)
  const [loading,   setLoading]   = useState(true)
  const [replyTarget,   setReplyTarget]   = useState<GiftReceived | null>(null)
  const [showWithdraw, setShowWithdraw] = useState(false)

  const load = async () => {
    try {
      const [giftsRes, balanceRes] = await Promise.all([getReceivedGifts(), getBalance()])
      setSummary(giftsRes.data)
      setBalance(balanceRes.data)
    } catch {
      toast.error('Error al cargar los regalos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl animate-bounce mb-3">🎁</div>
          <p className="text-gray-500 font-medium">Cargando tus regalos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50">
      <div className="bg-white/80 backdrop-blur-md border-b border-pink-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Mis Regalos 🎁</h1>
            <p className="text-xs text-gray-400">Regalos recibidos de admiradores</p>
          </div>
          <Link to="/woman" className="text-sm text-pink-500 font-medium hover:text-pink-600">← Volver</Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white rounded-2xl shadow-sm p-4 border border-pink-100">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">🎁</span>
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Regalos</span>
            </div>
            <p className="text-3xl font-bold text-gray-800">{summary?.total_gifts ?? 0}</p>
            <p className="text-xs text-gray-400 mt-0.5">recibidos</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-4 border border-emerald-100">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">💰</span>
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Ganancias</span>
            </div>
            <p className="text-3xl font-bold text-emerald-600">S/ {(summary?.total_earning ?? 0).toFixed(2)}</p>
            <p className="text-xs text-gray-400 mt-0.5">acumuladas</p>
          </div>
        </div>

        {/* Balance & Withdrawal */}
        {balance && (
          <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-bold text-gray-800">Mis ganancias</h2>
                <p className="text-xs text-gray-400 mt-0.5">30% de cada regalo recibido</p>
              </div>
              <button
                onClick={() => setShowWithdraw(true)}
                disabled={balance.available < 10}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-semibold hover:from-emerald-600 hover:to-teal-600 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"
              >
                💸 Retirar
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center">
                <p className="text-xs text-gray-400 mb-0.5">Total ganado</p>
                <p className="font-bold text-gray-800">S/. {balance.total_earned.toFixed(2)}</p>
              </div>
              <div className="text-center border-x border-gray-100">
                <p className="text-xs text-gray-400 mb-0.5">Retirado</p>
                <p className="font-bold text-gray-500">S/. {balance.total_withdrawn.toFixed(2)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400 mb-0.5">Disponible</p>
                <p className="font-bold text-emerald-600 text-lg">S/. {balance.available.toFixed(2)}</p>
              </div>
            </div>

            {balance.pending_held > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 rounded-xl px-3 py-2 mb-3">
                <span>⏳</span>
                <span>S/. {balance.pending_held.toFixed(2)} en proceso de pago</span>
              </div>
            )}

            {balance.available < 10 && balance.total_earned > 0 && (
              <p className="text-xs text-gray-400 text-center">Necesitas al menos S/. 10.00 disponibles para retirar</p>
            )}

            {/* Withdrawal history */}
            {balance.withdrawals.length > 0 && (
              <div className="border-t border-gray-100 pt-3 mt-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Historial de retiros</p>
                {balance.withdrawals.map(w => <WithdrawalRow key={w.id} w={w} />)}
              </div>
            )}
          </div>
        )}

        {!summary?.gifts.length ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎀</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Aún no tienes regalos</h3>
            <p className="text-sm text-gray-400">Completa tu perfil para aparecer en las búsquedas</p>
            <Link to="/woman/profile" className="inline-block mt-4 px-5 py-2.5 bg-pink-500 text-white rounded-xl text-sm font-semibold hover:bg-pink-600 transition">
              Completar perfil
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {summary.gifts.map(gift => (
              <GiftCard
                key={gift.is_transaction ? `tx-${gift.request_id}` : `req-${gift.request_id}`}
                gift={gift}
                onReply={setReplyTarget}
              />
            ))}
          </div>
        )}
      </div>

      {replyTarget && (
        <ReplyModal gift={replyTarget} onClose={() => setReplyTarget(null)} onSent={load} />
      )}

      {showWithdraw && balance && (
        <WithdrawModal
          available={balance.available}
          onClose={() => setShowWithdraw(false)}
          onSent={load}
        />
      )}
    </div>
  )
}
