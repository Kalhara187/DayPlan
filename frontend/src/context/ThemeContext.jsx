import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()
export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    console.log('Initial theme from localStorage:', saved)
    return saved === 'dark'
  })

  useEffect(() => {
    console.log('Theme changed to:', isDark ? 'dark' : 'light')
    if (isDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDark])

  const toggleTheme = () => {
    console.log('Toggle theme clicked!')
    setIsDark(!isDark)
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)