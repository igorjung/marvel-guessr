import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Router from 'next/router'
import { useState, useMemo, useEffect } from 'react'
import styled from 'styled-components'

import json from '../../data/index.json'
import Header from '../../components/Header'
import Thumb from '../../components/Thumb'
import Form from '../../components/Form'
import List from '../../components/List'
import Loading from '../../components/Loading'
import Footer from '../../components/Footer'
import Modal from '../../components/Modal'
import IOption from '../../interfaces/option'
import ITexts from '../../interfaces/texts'
import { getCharacter } from '../../services/api'
import { getDates } from '../../services/date'

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
  const [infoModal, setInfoModal] = useState(false);
  const [languageModal, setLanguageModal] = useState(false);

  const resetGame = () => {
    const dayNumber = parseInt(localStorage.getItem('days') || '0') 
    if(days !== dayNumber) {
      localStorage.setItem('guesses', JSON.stringify([]))
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
      localStorage.setItem('guesses', JSON.stringify(guessesList))
    }

    setGuess(null)
  }

  let options = useMemo(() => {
    const list = [...characters]
    return list.sort((a, b) => a.id - b.id)
  }, [characters])

  useEffect(() => {
    resetGame()

    const guessesList = localStorage.getItem('guesses')
    const status = localStorage.getItem('isCorrect')

    setGuesses(JSON.parse(guessesList) || [])
    setIsCorrect(status === 'true')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Head>
        <title>AmINerdola - {texts.head_title}</title>
        <meta name="description" content={texts.head_title} />
      </Head>
      <Container>
        <Header onOpenModal={(name) =>
          name === 'about' ?
          setInfoModal(true) :
          setLanguageModal(true)
        }/>
        <Content>
          {data ? (
            <>
              <Thumb
                options={options}
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
                  options={options}
                  guesses={guesses}
                  guess={guess}
                  text={texts.submit_button}
                  onInsert={(value) => setGuess(value)}
                  onConfirm={handleGuessing}
                />
              )}
              <List 
                guesses={guesses} 
                options={options}
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
      <Modal        
        open={infoModal} 
        title={texts.info[0]}
        onClose={() => setInfoModal(false)}
      >
        <p>{texts.info[1]} <a href="https://www.nytimes.com/games/wordle/index.html" target="blank">Wordle</a>, <a href="https://term.ooo/" target="blank">Termoo</a>, <a href="https://www.gabtoschi.com/letreco/" target="blank">Letreco</a> {texts.info[2]} <a href="https://framed.wtf/" target="blank">Framed</a></p>
        <p>{texts.info[3]} <a href="https://developer.marvel.com/" target="blank">{texts.info[4]}</a>.</p>
        <p>{texts.info[5]}</p>
        <p>{texts.info[6]}</p>
      </Modal>
      <Modal        
        open={languageModal} 
        title={texts.language[0]}
        onClose={(value) => { 
          setLanguageModal(false);
          if(value) Router.push(`/${value}`)
        }}
      >
        <li>
          <div>
            <Image 
              src={'https://flagcdn.com/h20/us.png'}
              alt="USA flag"
              layout="fill"
              objectFit="cover"
            />
          </div>
          <button type="button" onClick={() => {
            setLanguageModal(false);
            Router.push('/en')
          }}>
            <span>{texts.language[1]}</span>
          </button>
        </li>
        <li>
          <div>
            <Image 
              src={'https://flagcdn.com/h20/br.png'}
              alt="Brazil flag"
              layout="fill"
              objectFit="cover"
            />
          </div>
          <button type="button" onClick={() => {
            setLanguageModal(false);
            Router.push('/pt')
          }}>
            <span>{texts.language[2]}</span>
          </button>
        </li>
      </Modal>
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
  };
};

export async function getStaticPaths() {
  const languages = ['pt', 'en'];
  const paths = languages.map((language) => ({ params: { language } }))

  return {
    paths,
    fallback: false,
  };
}

export default Home
