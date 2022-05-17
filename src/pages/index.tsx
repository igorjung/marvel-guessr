import type { NextPage } from 'next'
import Head from 'next/head'
import Router from 'next/router'
import { useEffect } from 'react'
import styled from 'styled-components'

import Loading from '../components/Loading'

const Container = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 32px 32px 32px;

  height: 100vh;
`

const Home: NextPage = () => {
  const getLanguage = () => {
    if(navigator.language === 'pt-BR') {
      Router.push('/pt')
    } else {
      Router.push('/en')
    }
  }

  useEffect(() => {
    getLanguage()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Head>
        <title>MarvelGuessr - The daily marvel guessing game</title>
        <meta name="description" content="The daily marvel guessing game" />
      </Head>
      <Container>
        <Loading />
      </Container>
    </>
  )
}

export default Home
