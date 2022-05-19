import type { NextPage } from 'next'
import Head from 'next/head'
import Router from 'next/router'
import { useEffect } from 'react'
import styled from 'styled-components'

import Loading from '../components/Loading'

const Wrapper = styled.main`
  display: flex;
  align-items: flex-start;
  justify-content: center;

  width: 100%;
  height: 100%;
  min-height: 100vh;
  padding-top: 64px;

  background-color: ${({ theme }) => theme.background.primary};
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
      <Wrapper>
        <Loading />
      </Wrapper>
    </>
  )
}

export default Home
