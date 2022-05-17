import type { NextPage } from 'next'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import styled from 'styled-components'

import json from '../../data/index.json'
import Header from '../../components/Header'
import Thumb from '../../components/Thumb'
import Form from '../../components/Form'
import List from '../../components/List'
import Loading from '../../components/Loading'
import Footer from '../../components/Footer'
import IOption from '../../interfaces/option'
import ITexts from '../../interfaces/texts'
import { getCharacter } from '../../services/api'
import { getDates } from '../../services/date'
import { ContactsOutlined } from '@material-ui/icons'

const Container = styled.main`
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100vw;
  max-width: 800px;
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

  span.answer {
    color: ${({ theme }) => theme.colors.text};
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 12px;
  }
`
const Text = styled.p<{isCorrect: boolean}>`
  font-size: 24px;
  color: ${({isCorrect}) => isCorrect ? '#081B2B' : '#450003'};
  font-weight: 600;
  width: 100%;
  text-align: center;
  margin-top: 16px;
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
    } else {
      const guessesList = [...guesses, guess]
      setGuesses(guessesList)
      localStorage.setItem('list', JSON.stringify(guessesList))
    }

    setGuess(null)
  }

  useEffect(() => {
    setLoading(true)
    resetGame()

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
        <title>AmINerdola - {texts.head_title}</title>
        <meta name="description" content={texts.head_title} />
      </Head>
      <Container>
        <Header texts={texts}/>
        <Content>
          {!loading ? (
            <>
              <Thumb
                list={characters}
                guesses={guesses}
                isCorrect={isCorrect}
                data={data}
              />
              {(isCorrect || guesses.length >= 5) ? (
                <Text isCorrect={isCorrect}>
                  {isCorrect ?
                    texts.correct_answer :
                    texts.wrong_answer
                  }
                </Text>
              ) : (
                <Form 
                  list={characters}
                  guesses={guesses}
                  guess={guess}
                  text={texts.submit_button}
                  onInsert={(value) => setGuess(value)}
                  onConfirm={handleGuessing}
                />
              )}
              <List 
                guesses={guesses} 
                list={characters}
                isCorrect={isCorrect}
                texts={texts.share}
                days={days}
              />
            </>
          ): (
            <Loading />
          )}
        </Content>
        <Footer texts={texts.footer} />
      </Container>
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
