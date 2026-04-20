import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { checkout } from '../../api'

const PLANS = [
  { id: 'monthly', label: 'Mensual', price: 'S/ 39.90', days: '30 días', highlight: false },
  { id: 'yearly', label: 'Anual', price: 'S/ 199.90', days: '365 días', highlight: true },
]

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
      toast.success('¡Suscripción activada! 🎉')
      navigate('/man/browse')
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Error al procesar el pago')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-8 text-center">Elige tu plan</h1>

      {/* Plan selector */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {PLANS.map(p => (
          <button key={p.id} type="button" onClick={() => setPlan(p.id as any)}
            className={`rounded-2xl p-5 border-2 text-left transition ${plan === p.id ? 'border-primary bg-pink-50' : 'border-gray-200 hover:border-pink-300'}`}>
            {p.highlight && <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full mb-2 inline-block">Popular</span>}
            <p className="font-bold text-gray-800 text-lg">{p.price}</p>
            <p className="text-gray-500 text-sm">{p.label} · {p.days}</p>
          </button>
        ))}
      </div>

      {/* Mock payment form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-700 mb-2">Datos de pago (demo)</h2>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Número de tarjeta</label>
          <input required value={card.number} onChange={e => setCard(c => ({ ...c, number: e.target.value }))}
            placeholder="4242 4242 4242 4242" maxLength={19}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Vencimiento</label>
            <input required value={card.expiry} onChange={e => setCard(c => ({ ...c, expiry: e.target.value }))}
              placeholder="MM/AA" maxLength={5}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">CVV</label>
            <input required value={card.cvv} onChange={e => setCard(c => ({ ...c, cvv: e.target.value }))}
              placeholder="123" maxLength={4}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>
        <button type="submit" disabled={loading}
          className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-pink-600 transition disabled:opacity-50">
          {loading ? 'Procesando...' : 'Activar Suscripción'}
        </button>
        <p className="text-center text-xs text-gray-400">Demo — no se realiza ningún cobro real</p>
      </form>
    </div>
  )
}
