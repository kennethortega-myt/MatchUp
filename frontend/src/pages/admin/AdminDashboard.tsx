import { useState, FormEvent, useEffect } from 'react'
import { getAdminDashboard, getAdminWithdrawals, approveWithdrawal, rejectWithdrawal } from '../../api'
import type { WithdrawalAdminOut } from '../../types'

interface SubStat {
  total_active: number
  total_monthly: number
  total_yearly: number
  revenue_monthly_plans: number
  revenue_yearly_plans: number
  total_revenue: number
}

interface GiftStat {
  total_gifts_sent: number
  total_gift_value: number
  total_woman_earnings: number
  total_admin_earnings: number
}

interface WomanBalance {
  user_id: number
  email: string
  first_name: string
  gifts_received: number
  total_gift_value: number
  woman_earning: number
  admin_earning: number
}

interface RecentGift {
  request_id: number
  man_id: number
  woman_id: number
  gift_type: string
  gift_emoji: string
  gift_label: string
  full_value: number
  woman_gets: number
  admin_gets: number
  created_at: string
}

interface RecentSub {
  user_id: number
  email: string
  plan: string
  status: string
  started_at: string
  expires_at: string
}

interface Dashboard {
  generated_at: string
  subscriptions: SubStat
  gifts: GiftStat
  women_balances: WomanBalance[]
  recent_gifts: RecentGift[]
  recent_subscriptions: RecentSub[]
  pending_withdrawals_count: number
}

export default function AdminDashboard() {
  const [key, setKey]         = useState('')
  const [totp, setTotp]       = useState('')
  const [data, setData]       = useState<Dashboard | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [tab, setTab]         = useState<'overview' | 'subs' | 'gifts' | 'women' | 'withdrawals'>('overview')
  const [withdrawals,    setWithdrawals]    = useState<WithdrawalAdminOut[]>([])
  const [withdrawalTab,  setWithdrawalTab]  = useState<'pending' | 'approved' | 'rejected'>('pending')
  const [actionNotes,    setActionNotes]    = useState<Record<number, string>>({})
  const [actionLoading,  setActionLoading]  = useState<number | null>(null)

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await getAdminDashboard(key, totp || undefined)
      setData(res.data)
    } catch {
      setError('Clave incorrecta, TOTP inválido o acceso denegado.')
    } finally {
      setLoading(false)
    }
  }

  const refresh = async () => {
    setLoading(true)
    try {
      const res = await getAdminDashboard(key, totp || undefined)
      setData(res.data)
    } finally {
      setLoading(false)
    }
  }

  const loadWithdrawals = async (status: 'pending' | 'approved' | 'rejected') => {
    try {
      const res = await getAdminWithdrawals(key, totp || undefined, status)
      setWithdrawals(res.data)
    } catch { /* ignore */ }
  }

  useEffect(() => {
    if (tab === 'withdrawals') loadWithdrawals(withdrawalTab)
  }, [tab, withdrawalTab])

  const handleApprove = async (id: number) => {
    setActionLoading(id)
    try {
      await approveWithdrawal(key, totp || undefined, id, actionNotes[id])
      setWithdrawals(prev => prev.filter(w => w.id !== id))
      setData(prev => prev ? { ...prev, pending_withdrawals_count: prev.pending_withdrawals_count - 1 } : prev)
    } catch { /* ignore */ }
    finally { setActionLoading(null) }
  }

  const handleReject = async (id: number) => {
    setActionLoading(id)
    try {
      await rejectWithdrawal(key, totp || undefined, id, actionNotes[id])
      setWithdrawals(prev => prev.filter(w => w.id !== id))
      setData(prev => prev ? { ...prev, pending_withdrawals_count: prev.pending_withdrawals_count - 1 } : prev)
    } catch { /* ignore */ }
    finally { setActionLoading(null) }
  }

  // ── Login gate ────────────────────────────────────────────────────────────
  if (!data) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-sm shadow-2xl border border-gray-800">
          <h1 className="text-white text-xl font-bold mb-1 text-center">Admin Panel</h1>
          <p className="text-gray-500 text-sm text-center mb-6">MatchUp — Panel de control</p>
          {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={key}
              onChange={e => setKey(e.target.value)}
              placeholder="Clave de administrador"
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <input
              type="text"
              inputMode="numeric"
              value={totp}
              onChange={e => setTotp(e.target.value)}
              placeholder="Código 2FA (dejar vacío si no está activo)"
              maxLength={6}
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <button type="submit" disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-pink-600 transition disabled:opacity-50">
              {loading ? 'Verificando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  const { subscriptions: sub, gifts, women_balances, recent_gifts, recent_subscriptions, pending_withdrawals_count } = data

  // ── Dashboard ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Top bar */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-white font-bold text-lg">MatchUp Admin</h1>
          <p className="text-gray-500 text-xs">Actualizado: {new Date(data.generated_at).toLocaleString('es-PE')}</p>
        </div>
        <button onClick={refresh} disabled={loading}
          className="bg-gray-800 text-gray-300 px-4 py-2 rounded-xl text-sm hover:bg-gray-700 transition">
          {loading ? '...' : '↻ Actualizar'}
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Suscripciones activas', value: sub.total_active,              color: 'from-pink-600 to-rose-500',    suffix: '' },
            { label: 'Revenue suscripciones', value: `S/. ${sub.total_revenue.toFixed(2)}`, color: 'from-violet-600 to-purple-500', suffix: '' },
            { label: 'Regalos enviados',      value: gifts.total_gifts_sent,         color: 'from-amber-500 to-orange-500', suffix: '' },
            { label: 'Ganancia admin (regal.)',value: `S/. ${gifts.total_admin_earnings.toFixed(2)}`, color: 'from-emerald-600 to-teal-500', suffix: '' },
          ].map(k => (
            <div key={k.label} className={`bg-gradient-to-br ${k.color} rounded-2xl p-5 shadow-lg`}>
              <p className="text-white/80 text-xs mb-1">{k.label}</p>
              <p className="text-white text-3xl font-bold">{k.value}</p>
            </div>
          ))}
        </div>

        {/* Revenue breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          {/* Subscriptions breakdown */}
          <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
            <h2 className="text-white font-semibold mb-4">Suscripciones</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Mensual ({sub.total_monthly})</span>
                <span className="text-white font-medium">S/. {sub.revenue_monthly_plans.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Anual ({sub.total_yearly})</span>
                <span className="text-white font-medium">S/. {sub.revenue_yearly_plans.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-700 pt-2 flex justify-between items-center">
                <span className="text-gray-300 text-sm font-medium">Total</span>
                <span className="text-emerald-400 font-bold text-lg">S/. {sub.total_revenue.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Gifts breakdown */}
          <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
            <h2 className="text-white font-semibold mb-4">Regalos</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Valor total cobrado</span>
                <span className="text-white font-medium">S/. {gifts.total_gift_value.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Pago a mujeres (30%)</span>
                <span className="text-pink-400 font-medium">S/. {gifts.total_woman_earnings.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-700 pt-2 flex justify-between items-center">
                <span className="text-gray-300 text-sm font-medium">Ganancia admin (70%)</span>
                <span className="text-emerald-400 font-bold text-lg">S/. {gifts.total_admin_earnings.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-800 pb-2">
          {([
            { id: 'overview',     label: 'Resumen' },
            { id: 'subs',         label: `Suscripciones (${recent_subscriptions.length})` },
            { id: 'gifts',        label: `Regalos (${recent_gifts.length})` },
            { id: 'women',        label: `Mujeres (${women_balances.length})` },
            { id: 'withdrawals',  label: `Retiros${pending_withdrawals_count > 0 ? ` 🔴${pending_withdrawals_count}` : ''}` },
          ] as const).map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                tab === t.id ? 'bg-primary text-white' : 'text-gray-400 hover:text-gray-200'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'overview' && (
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <h3 className="text-white font-semibold mb-4">Últimos 5 regalos enviados</h3>
            {recent_gifts.slice(0, 5).length === 0 ? (
              <p className="text-gray-500 text-sm">Sin regalos aún.</p>
            ) : (
              <div className="space-y-2">
                {recent_gifts.slice(0, 5).map(g => (
                  <div key={g.request_id} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                    <span className="text-xl mr-2">{g.gift_emoji}</span>
                    <span className="text-gray-300 text-sm flex-1">{g.gift_label} — Hombre #{g.man_id} → Mujer #{g.woman_id}</span>
                    <span className="text-white font-medium text-sm">S/. {g.full_value.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'subs' && (
          <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-800">
                <tr>
                  {['Email','Plan','Estado','Inicio','Vence'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-gray-400 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent_subscriptions.map((s, i) => (
                  <tr key={i} className="border-t border-gray-800 hover:bg-gray-800/50">
                    <td className="px-4 py-3 text-gray-300">{s.email}</td>
                    <td className="px-4 py-3">
                      <span className="bg-purple-900/50 text-purple-300 text-xs px-2 py-0.5 rounded-full">{s.plan}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${s.status === 'active' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>{s.status}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{new Date(s.started_at).toLocaleDateString('es-PE')}</td>
                    <td className="px-4 py-3 text-gray-400">{new Date(s.expires_at).toLocaleDateString('es-PE')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'gifts' && (
          <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-800">
                <tr>
                  {['Regalo','De → Para','Valor total','Mujer (30%)','Admin (70%)','Fecha'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-gray-400 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent_gifts.map(g => (
                  <tr key={g.request_id} className="border-t border-gray-800 hover:bg-gray-800/50">
                    <td className="px-4 py-3">{g.gift_emoji} {g.gift_label}</td>
                    <td className="px-4 py-3 text-gray-400">#{g.man_id} → #{g.woman_id}</td>
                    <td className="px-4 py-3 text-white font-medium">S/. {g.full_value.toFixed(2)}</td>
                    <td className="px-4 py-3 text-pink-400">S/. {g.woman_gets.toFixed(2)}</td>
                    <td className="px-4 py-3 text-emerald-400">S/. {g.admin_gets.toFixed(2)}</td>
                    <td className="px-4 py-3 text-gray-400">{new Date(g.created_at).toLocaleDateString('es-PE')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'women' && (
          <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-800">
                <tr>
                  {['Nombre','Email','Regalos','Valor total','Le pagamos (30%)','Admin (70%)'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-gray-400 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {women_balances.map(w => (
                  <tr key={w.user_id} className="border-t border-gray-800 hover:bg-gray-800/50">
                    <td className="px-4 py-3 text-white font-medium">{w.first_name || '—'}</td>
                    <td className="px-4 py-3 text-gray-400">{w.email}</td>
                    <td className="px-4 py-3 text-gray-300">{w.gifts_received}</td>
                    <td className="px-4 py-3 text-white">S/. {w.total_gift_value.toFixed(2)}</td>
                    <td className="px-4 py-3 text-pink-400 font-medium">S/. {w.woman_earning.toFixed(2)}</td>
                    <td className="px-4 py-3 text-emerald-400 font-medium">S/. {w.admin_earning.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'withdrawals' && (
          <div className="space-y-4">
            {/* Sub-tabs */}
            <div className="flex gap-2">
              {(['pending', 'approved', 'rejected'] as const).map(s => (
                <button key={s} onClick={() => setWithdrawalTab(s)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                    withdrawalTab === s ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-gray-200'
                  }`}>
                  {s === 'pending' ? '⏳ Pendientes' : s === 'approved' ? '✅ Aprobados' : '❌ Rechazados'}
                </button>
              ))}
            </div>

            {withdrawals.length === 0 ? (
              <div className="bg-gray-900 rounded-2xl p-10 text-center text-gray-500 border border-gray-800">
                No hay solicitudes {withdrawalTab === 'pending' ? 'pendientes' : withdrawalTab === 'approved' ? 'aprobadas' : 'rechazadas'}
              </div>
            ) : (
              <div className="space-y-3">
                {withdrawals.map(w => (
                  <div key={w.id} className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <p className="text-white font-semibold">{w.woman_name || 'Sin nombre'}</p>
                        <p className="text-gray-400 text-sm">{w.woman_email}</p>
                        <div className="flex items-center gap-3 mt-2 text-sm">
                          <span className="text-emerald-400 font-bold text-lg">S/. {w.amount.toFixed(2)}</span>
                          <span className="text-gray-400">·</span>
                          <span className="text-gray-300">
                            {w.method === 'yape' ? '💜 Yape' : w.method === 'plin' ? '🟢 Plin' : '🏦 Transferencia'}
                          </span>
                          <span className="text-gray-400">·</span>
                          <span className="text-gray-300">{w.account_info}</span>
                        </div>
                        <p className="text-gray-500 text-xs mt-1">{new Date(w.created_at).toLocaleString('es-PE')}</p>
                        {w.admin_notes && (
                          <p className="text-gray-400 text-xs mt-1 italic">Nota: "{w.admin_notes}"</p>
                        )}
                      </div>

                      {withdrawalTab === 'pending' && (
                        <div className="flex flex-col gap-2 min-w-[200px]">
                          <input
                            type="text"
                            placeholder="Nota opcional..."
                            value={actionNotes[w.id] ?? ''}
                            onChange={e => setActionNotes(prev => ({ ...prev, [w.id]: e.target.value }))}
                            className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-1.5 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(w.id)}
                              disabled={actionLoading === w.id}
                              className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold disabled:opacity-50 transition"
                            >
                              {actionLoading === w.id ? '...' : '✅ Aprobar'}
                            </button>
                            <button
                              onClick={() => handleReject(w.id)}
                              disabled={actionLoading === w.id}
                              className="flex-1 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white text-sm font-semibold disabled:opacity-50 transition"
                            >
                              {actionLoading === w.id ? '...' : '❌ Rechazar'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
