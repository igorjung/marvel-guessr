import type { AppProps } from 'next/app'
import { useMemo } from 'react'
import { ThemeProvider } from 'styled-components'

import GlobalStyle from '../styles/global'
import { light, dark } from '../styles/themes'

function MyApp({ Component, pageProps }: AppProps) {
  const theme = useMemo(() => {
    if(typeof window !== 'undefined') {
      const isDarkModeOn = localStorage.getItem('darkMode') === 'true'
      return isDarkModeOn ? light : dark
    }
    return light
  }, []) 

  return (
    <ThemeProvider 
      theme={light}>
      <Component {...pageProps} />
      <GlobalStyle/>
    </ThemeProvider>
  )
}

export default MyApp
