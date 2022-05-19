import type { NextPage } from 'next'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import Confetti from 'react-confetti'
import styled from 'styled-components'

import json from '../../data/index.json'
import Header from '../../components/Header'
import Thumb from '../../components/Thumb'
import Message from '../../components/Message'
import Form from '../../components/Form'
import List from '../../components/List'
import Loading from '../../components/Loading'
import Footer from '../../components/Footer'
import IOption from '../../interfaces/option'
import ITexts from '../../interfaces/texts'
import { getCharacter } from '../../services/api'
import { getDates } from '../../services/date'

const Wrapper = styled.main`
  display: flex;
  align-items: flex-start;
  justify-content: center;

  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.background.primary};

  p, span, svg, h1, h2 {
    color: ${({ theme }) => theme.text.primary};
  }

  a {
    color: ${({ theme }) => theme.text.secondary};
  }

  button {
    color: ${({ theme }) => theme.text.button};
    background-color: ${({theme}) => theme.button.primary};

    &:disabled {
      color: ${({ theme }) => theme.text.disabled};
      background-color: ${({theme}) => theme.button.disabled};
      cursor: not-allowed;
    }

  }
`
const Container = styled.div`
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;
  max-width: 1120px;
  height: 100%;
  min-height: 100vh;

  padding: 16px 0;

  @media only screen and (max-width: 820px) {
    padding: 16px 32px;
  }
`
const Content = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;
  max-width: 800px;
`
interface IHome {
  data: {
    id: number
    name: string
    thumbnail: {
      path: string
      extension: string
    }
  }
  days: number
  texts: ITexts
  characters: IOption[]
}
const Home: NextPage = ({ 
  data, 
  days, 
  texts,
  characters 
} : IHome) => {
  const [guess, setGuess] = useState<IOption | null>(null);
  const [guesses, setGuesses] = useState<IOption[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [chances, setChances] = useState(6);


  const resetGame = () => {
    const dayNumber = parseInt(localStorage.getItem('days') || '0') 
    if(days !== dayNumber) {
      localStorage.setItem('list', JSON.stringify([]))
      localStorage.setItem('isCorrect', 'false')
    }
    
    localStorage.setItem('days', `${days}`)
  }
  const handleGuessing = () => {
    if(guess.id === data.id) {
      setIsCorrect(true)
      localStorage.setItem('isCorrect', 'true')

      setShowConfetti(true)
      window.setTimeout(() => {
        setShowConfetti(false)
      }, 10000);
    }

    const guessesList = [...guesses, guess]
    setGuesses(guessesList)
    localStorage.setItem('list', JSON.stringify(guessesList))
    setGuess(null)
  }
  const handleHardMode = () => {
    const isHardModeOn = localStorage.getItem('hardMode')
    setChances(isHardModeOn === 'true' ? 3 : 6)
  }

  useEffect(() => {
    setLoading(true)
    resetGame()
    handleHardMode()

    const guessesList = localStorage.getItem('list')
    const status = localStorage.getItem('isCorrect')

    setGuesses(JSON.parse(guessesList) || [])
    setIsCorrect(status === 'true')
    setLoading(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Head>
        <title>MarvelGuessr - {texts.head_title}</title>
        <meta name="description" content={texts.head_title} />
      </Head>
      <Wrapper>
        {showConfetti && <Confetti/>}
        <Container>
          <Header 
            texts={texts} 
            onChangeState={handleHardMode}
          />
          <Content>
            {!loading ? (
              <>
                <Thumb
                  list={characters}
                  guesses={guesses}
                  chances={chances}
                  isCorrect={isCorrect}
                  data={data}
                />
                {(isCorrect || guesses.length >= chances) ? (
                  <Message isCorrect={isCorrect} texts={texts} />
                ) : (
                  <Form 
                    list={characters}
                    guesses={guesses}
                    guess={guess}
                    chances={chances}
                    text={texts.submit_button}
                    onInsert={(value) => setGuess(value)}
                    onConfirm={handleGuessing}
                  />
                )}
                <List 
                  guesses={guesses} 
                  chances={chances}
                  list={characters}
                  isCorrect={isCorrect}
                  texts={texts.share}
                  days={days}
                  data={data}
                />
              </>
            ): (
              <Loading />
            )}
          </Content>
          <Footer texts={texts.footer} />
        </Container>
      </Wrapper>
    </>
  )
}

export const getStaticProps = async (context: {params: {language: string}}) => {
  const days = getDates()
  const [data] = await getCharacter(json.en.characters[days].id)
  const language = context.params.language

  return {
    revalidate: 1000,
    props: {
      data,
      days,
      texts: json[language].texts,
      characters: json[language].characters
    }
  }
}

export async function getStaticPaths() {
  const languages = ['pt', 'en'];
  const paths = languages.map((language) => ({ params: { language } }))

  return {
    paths,
    fallback: false,
  }
}

export default Home
