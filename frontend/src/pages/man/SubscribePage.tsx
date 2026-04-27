import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { checkout } from '../../api'

const PLANS = [
  { id: 'monthly', label: 'Mensual', price: 'S/ 39.90', sub: '30 días de acceso', popular: false },
  { id: 'yearly',  label: 'Anual',   price: 'S/ 199.90', sub: '365 días · Ahorra 58%', popular: true },
]

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[10px] font-bold text-[#F5F0E8]/30 uppercase tracking-[0.18em] mb-2">
      {children}
    </label>
  )
}

export default function SubscribePage() {
  const [plan, setPlan] = useState<'monthly' | 'yearly'>('monthly')
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await checkout(plan, card.number, card.expiry, card.cvv)
      toast.success('¡Membresía activada!')
      navigate('/man/browse')
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Error al procesar el pago')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#070509] text-[#F5F0E8]">
      {/* Onboarding notice */}
      <div className="border-b border-primary/[0.1] bg-primary/[0.05]">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
          <p className="text-sm text-[#F5F0E8]/60">
            <span className="text-[#F5F0E8]/80 font-semibold">Último paso</span> — Activa tu membresía para explorar perfiles y enviar solicitudes.
          </p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-10 space-y-6">
        {/* Header */}
        <div className="mb-2">
          <p className="text-[11px] text-primary tracking-[0.22em] uppercase font-bold mb-2">Membresía</p>
          <h1 className="text-3xl font-black tracking-tight">Elige tu plan</h1>
          <p className="text-[#F5F0E8]/30 text-sm mt-1">Acceso ilimitado a todos los perfiles</p>
        </div>

        {/* Plan selector */}
        <div className="grid grid-cols-2 gap-3">
          {PLANS.map(p => (
            <button key={p.id} type="button" onClick={() => setPlan(p.id as 'monthly' | 'yearly')}
              className={`relative rounded-2xl p-5 border text-left transition-all ${
                plan === p.id
                  ? 'border-primary/60 bg-primary/[0.08] shadow-[0_0_20px_rgba(212,175,55,0.08)]'
                  : 'border-white/[0.06] bg-[#0F0C18] hover:border-white/[0.12]'
              }`}>
              {p.popular && (
                <span className="absolute -top-2.5 left-4 text-[10px] font-bold tracking-wider uppercase bg-primary text-[#070509] px-2.5 py-0.5 rounded-full">
                  Popular
                </span>
              )}
              <p className={`text-xl font-black mb-1 ${plan === p.id ? 'text-primary' : 'text-[#F5F0E8]'}`}>
                {p.price}
              </p>
              <p className="text-[11px] font-bold text-[#F5F0E8]/80">{p.label}</p>
              <p className="text-[11px] text-[#F5F0E8]/35 mt-0.5">{p.sub}</p>
              {plan === p.id && (
                <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-[#070509]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Payment form */}
        <form onSubmit={handleSubmit} className="bg-[#0F0C18] border border-white/[0.06] rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4 text-primary/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
            </svg>
            <span className="text-[11px] font-bold text-[#F5F0E8]/40 uppercase tracking-[0.15em]">Datos de pago (demo)</span>
          </div>

          <div>
            <FieldLabel>Número de tarjeta</FieldLabel>
            <input required value={card.number}
              onChange={e => setCard(c => ({ ...c, number: e.target.value }))}
              placeholder="4242 4242 4242 4242" maxLength={19}
              className="input-agara" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Vencimiento</FieldLabel>
              <input required value={card.expiry}
                onChange={e => setCard(c => ({ ...c, expiry: e.target.value }))}
                placeholder="MM/AA" maxLength={5}
                className="input-agara" />
            </div>
            <div>
              <FieldLabel>CVV</FieldLabel>
              <input required value={card.cvv}
                onChange={e => setCard(c => ({ ...c, cvv: e.target.value }))}
                placeholder="123" maxLength={4}
                className="input-agara" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-gold">
            {loading ? 'Procesando...' : 'Activar Membresía'}
          </button>

          <p className="text-center text-[10px] text-[#F5F0E8]/20 tracking-wide">
            Demo — no se realiza ningún cobro real
          </p>
        </form>
      </div>
    </div>
  )
}
