import type { AppProps } from 'next/app'
import { useEffect, useState } from 'react'
import { ThemeProvider } from 'styled-components'

import GlobalStyle from '../styles/global'
import { light, dark } from '../styles/themes'
import ITheme from '../interfaces/theme'

function MyApp({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState<ITheme>(light)

  useEffect(() => {
    const isDarkModeOn = localStorage.getItem('darkMode') === 'true'
    const newTheme = isDarkModeOn ? dark : light 
    setTheme(newTheme)
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
      <GlobalStyle/>
    </ThemeProvider>
  )
}

export default MyApp
