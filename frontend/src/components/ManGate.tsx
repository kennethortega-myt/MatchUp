import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { getManProfile, getSubscriptionStatus } from '../api'

type Gate = 'loading' | 'needs-profile' | 'needs-subscription' | 'ok'

export default function ManGate({ children }: { children: JSX.Element }) {
  const [gate, setGate] = useState<Gate>('loading')

  useEffect(() => {
    Promise.all([getManProfile(), getSubscriptionStatus()])
      .then(([profileRes, subRes]) => {
        const profile = profileRes.data
        const profileComplete = !!(profile.first_name && profile.occupation && profile.photos?.length > 0)
        if (!profileComplete) { setGate('needs-profile'); return }
        const sub = subRes.data
        const active = sub?.status === 'active'
        setGate(active ? 'ok' : 'needs-subscription')
      })
      .catch(() => setGate('needs-profile'))
  }, [])

  if (gate === 'loading') {
    return (
      <div className="min-h-screen bg-[#070509] flex items-center justify-center">
        <svg className="w-8 h-8 text-primary/50 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    )
  }
  if (gate === 'needs-profile') return <Navigate to="/man/profile" replace />
  if (gate === 'needs-subscription') return <Navigate to="/man/subscribe" replace />
  return children
}
