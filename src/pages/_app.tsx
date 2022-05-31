import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { ThemeProvider } from 'styled-components'


import * as ga from '../services/ga'
import GlobalStyle from '../styles/global'
import { light, dark } from '../styles/themes'
import ITheme from '../interfaces/theme'

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [theme, setTheme] = useState<ITheme>(light)

  useEffect(() => {
    const isDarkModeOn = localStorage.getItem('darkMode') === 'true'
    const newTheme = isDarkModeOn ? dark : light 
    setTheme(newTheme)
  }, [])

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      ga.pageview(url)
    }
    
    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
      <GlobalStyle/>
    </ThemeProvider>
  )
}

export default MyApp
