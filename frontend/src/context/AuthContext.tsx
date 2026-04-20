import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { User } from '../types'
import { refreshToken, logoutApi, getMe } from '../api'

interface AuthContextType {
  token: string | null
  user: User | null
  login: (token: string, user: User) => void
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  login: () => {},
  logout: () => {},
  loading: true,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [user, setUser] = useState<User | null>(() => {
    const u = localStorage.getItem('user')
    return u ? JSON.parse(u) : null
  })
  const [loading, setLoading] = useState(true)

  // On app load: if no token in storage, try to restore session via refresh cookie
  useEffect(() => {
    if (token) {
      setLoading(false)
      return
    }
    refreshToken()
      .then(res => {
        const newToken: string = res.data.access_token
        localStorage.setItem('token', newToken)
        setToken(newToken)
        return getMe()
      })
      .then(res => {
        const u: User = { id: res.data.id, email: res.data.email, role: res.data.role }
        localStorage.setItem('user', JSON.stringify(u))
        setUser(u)
      })
      .catch(() => {
        // No valid refresh cookie — user needs to log in
      })
      .finally(() => setLoading(false))
  }, [])

  const login = (newToken: string, newUser: User) => {
    setToken(newToken)
    setUser(newUser)
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(newUser))
  }

  const logout = () => {
    logoutApi().catch(() => {})
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
