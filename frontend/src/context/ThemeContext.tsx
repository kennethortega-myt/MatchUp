import { createContext, useContext, useEffect, useState } from 'react'

export type Theme = 'dark' | 'pink' | 'white'

interface ThemeCtx {
  theme: Theme
  setTheme: (t: Theme) => void
}

const ThemeContext = createContext<ThemeCtx>({ theme: 'dark', setTheme: () => {} })

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    return (localStorage.getItem('agara-theme') as Theme) || 'dark'
  })

  const setTheme = (t: Theme) => {
    setThemeState(t)
    localStorage.setItem('agara-theme', t)
  }

  useEffect(() => {
    const html = document.documentElement
    html.removeAttribute('data-theme')
    if (theme !== 'dark') html.setAttribute('data-theme', theme)
  }, [theme])

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
