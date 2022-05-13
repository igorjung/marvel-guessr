import type { NextPage } from 'next'
import { useState, useMemo, useEffect } from 'react'
import { Close, Info } from '@material-ui/icons'
import { TextField, Dialog } from '@material-ui/core';
import { Autocomplete, Alert } from '@material-ui/lab';
import { 
  startOfDay, 
  differenceInDays, 
  format
} from 'date-fns'
import { 
  utcToZonedTime, 
} from 'date-fns-tz'
import Head from 'next/head'
import Image from 'next/image'
import styled from 'styled-components'
import ReactLoading from 'react-loading'

import { getCharacter } from '../services/api'
import list from '../data/characters.json'

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
const Header = styled.header`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  width: 100%;
  margin-bottom: 48px;
  padding-bottom: 16px;

  border-bottom: 2px solid #2A3740;

  h1 {
    font-size: 28px;
    line-height: 32px;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.primary};
    font-family: 'Koulen', sans-serif;
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
const ImageContainer = styled.div<{guesses: number, isCorrect: boolean}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  height: 360px;
  width: 800px;
  background-color: ${({ theme }) => theme.colors.secondary};
  border-radius: 8px;

  div {
    position: relative;
    width: 360px;
    height: 360px;
    filter: ${({ isCorrect, guesses }) => isCorrect ? `blur(0px)` : `blur(${(5 - guesses) * 5}px)`};
  }

  @media only screen and (max-width: 820px) {
    width: 100%;
    background-color: none;

    img {
      border-radius: 8px;
    }
  }

  @media only screen and (max-width: 500px) {
    div {
      width: 250px;
      height: 2500px;
    }
  }
`
const Form = styled.div`
  display: grid;
  grid-template-columns: 80% 20%;

  width: 100%;
  padding: 0 64px;
  margin-top: 32px;

  @media only screen and (max-width: 820px) {
    display: block;
    text-align: center;
    padding: 0;
  }
`
const Input = styled(TextField)`
  width: 100%;
  height: 35px;
`;
const SubmitButton = styled.button`
  height: 35px;
  width: 120px;
  margin-left: auto;

  font-size: 16px;
  line-height: 24px;
  font-weight: bold;
  color: #fff;

  border-radius: 4px;
  background-color: ${({theme}) => theme.colors.primary};
  cursor: pointer;

  &:disabled {
    background-color: ${({theme}) => theme.colors.secondary};
    cursor: not-allowed;
  }

  @media only screen and (max-width: 820px) {
    margin: 16px 0 0 0;
  }
`;
const ShareSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  padding-bottom: 32px;

  button {
    height: 42px;
    width: 120px;

    font-size: 22px;
    line-height: 26px;
    font-weight: bold;
    color: #fff;

    border-radius: 4px;
    background-color: ${({theme}) => theme.colors.primary};
    cursor: pointer;

    &:disabled {
      background-color: ${({theme}) => theme.colors.secondary};
      cursor: not-allowed;
    }
  }

`;
const Text = styled.p<{isCorrect: boolean}>`
  font-size: 24px;
  color: ${({isCorrect}) => isCorrect ? '#081B2B' : '#450003'};
  font-weight: 600;
  width: 100%;
  text-align: center;
  margin-top: 16px;
`
const GuessNumber = styled.span`
  font-size: 24px;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
  width: 100%;
  text-align: center;
  margin-top: 16px;
`
const List = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;

  margin-top: 16px;
  padding-bottom: 32px;

  li {
    width: 100%;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    text-align: left;

    font-size: 18px;
    color: ${({ theme }) => theme.colors.text};
    font-weight: 400;

    svg {
      color: #450003;
      font-size: 18px;
    }

    & + li {
      margin-top: 8px;
    }
  }
`
const Footer = styled.footer`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  width: 100%;
  margin-top: auto;

  p {
    font-size: 16px;
    color: ${({ theme }) => theme.colors.text};
    font-weight: 600;

    a {
      text-decoration: none;
      color: ${({ theme }) => theme.colors.primary};
      font-weight: bold;
    }
  }
`

const ModalHeader = styled.header`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  width: 100%;
  margin-bottom: 24px;
  padding: 16px 32px 0 32px;

  h2 {
    color: ${({ theme }) => theme.colors.text};
    font-size: 24px;
    font-weight: bold;
  }

  button {
    cursor: pointer;

    svg {
      color: #000;
      font-size: 22px;
    }
  }
`
const ModalSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 0 32px 16px 32px;

  p {
    font-size: 16px;
    line-height: 22px;
    color: ${({ theme }) => theme.colors.text};
    font-weight: 600;
    margin-bottom:  16px;

    a {
      text-decoration: none;
      color: ${({ theme }) => theme.colors.primary};
      font-weight: bold;
    }
  }
`
const SharedAlert = styled(Alert)`
  position: absolute;
  top: 80px;
  left: 10%;
  width: 80%;
`
export interface IAbout {
  open: boolean;
  onClose: () => void;
}

const AboutModal = ({open, onClose}: IAbout) => {
  return (
    <Dialog onClose={onClose} open={open}>
      <ModalHeader>
        <h2>ABOUT</h2>
        <button type="button" onClick={onClose}>
          <Close />
        </button>
      </ModalHeader>
      <ModalSection>
        <p>This is a game for Marvel fans! Inspired by <a href="https://www.nytimes.com/games/wordle/index.html" target="blank">Wordle</a>, <a href="https://term.ooo/" target="blank">Termoo</a>, <a href="https://www.gabtoschi.com/letreco/" target="blank">Letreco</a> and <a href="https://framed.wtf/" target="blank">Framed</a></p>
        <p>Each day a new character is picked from <a href="https://developer.marvel.com/" target="blank">{"Marvel's API"}</a>.</p>
        <p>It is quite simple to play it. Guess the character name using just the blurred picture. If you guess it wrong, the picture becomes clearer.</p>
        <p>All rights go to the rightful owners - no copyright infringement intended.</p>
      </ModalSection>
    </Dialog>
  )
}

interface IHome {
  data: {
    id: number,
    name: string,
    thumbnail: {
      path: string,
      extension: string,
    },
  },
  days: number,
  options: [{
    id: number,
    name: string,
  }]
}

const Home: NextPage = ({ 
  data, 
  days,
  options
} : IHome) => {
  const [isCorrect, setIsCorrect] = useState(false);
  const [guesses, setGuesses] = useState([]);
  const [guess, setGuess] = useState('');
  const [open, setOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const setLocalStorage = (key: string, value: string) => {
    localStorage.setItem(key, value)
  }

  const getLocalStorage = (key: string) => {
    return localStorage.getItem(key);
  }

  const resetGame = () => {
    const dayNumber = parseInt(getLocalStorage('days') || '0')

    if(days !== dayNumber) {
      setLocalStorage('guesses', JSON.stringify([]))
      setLocalStorage('isCorrect', 'false')
    }
    
    setLocalStorage('days', `${days}`)
  }

  const handleGuessing = () => {
    if(guess === answer) {
      setIsCorrect(true)
      setLocalStorage(
        'isCorrect',
        'true'
      )
    } else {
      const guessesList = [...guesses, guess]
      setGuesses(guessesList)
      setLocalStorage(
        'guesses',
        JSON.stringify(guessesList)
      )
    }

    setGuess('')
  }

  const handleShare = async (evt: { preventDefault: () => void; }) => {
    if (navigator.share) { 
      const shareData = {
        title: 'AmINerdola',
        text: `Am I Nerdola? ${isCorrect ? 'Yes' : 'No'} #${days}`,
        url: `${window.location.href}`,
      };    

      await navigator.share(shareData);
    } else {
      evt.preventDefault(); 
      navigator.clipboard.writeText(
      `Am I Nerdola? ${isCorrect ? 'Yes' : 'No'} #${days}\n\n${window.location.href}`
      )
    }
    setShowAlert(true)
  }

  const [answer, thumbnail] = useMemo(() => {
    if(data && data.name && data.thumbnail) {
      return [
        data.name,
        `${data.thumbnail.path}.${data.thumbnail.extension}`,
      ]
    }

    return ['', '']
  }, [data])

  useEffect(() => {
    resetGame()

    const guessesList = getLocalStorage('guesses')
    const status = getLocalStorage('isCorrect')

    setGuesses(JSON.parse(guessesList) || [])
    setIsCorrect(status === 'true')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Head>
        <title>AmINerdola - The daily marvel character guessing game</title>
        <meta name="description" content="The daily marvel character guessing game" />
        <link rel="icon" href="/icon.png" />
      </Head>
      <Container>
        <Header>
          <div style={{ width:'24px', height:'24px' }}/>
          <h1>
            AMINERDOLA
          </h1>
          <div>
            <button type="button" onClick={() => setOpen(true)}>
              <Info />
            </button>
          </div>
        </Header>
        <Content>
          {thumbnail ? (
            <>
              <span className="answer">
                {(isCorrect || guesses.length >= 5) ? answer : '???'}
              </span>
              <ImageContainer guesses={guesses.length} isCorrect={isCorrect}>
                <div>
                  <Image 
                    alt='image'
                    layout='fill'
                    objectFit='cover'
                    priority
                    src={thumbnail}   
                  />
                </div>
              </ImageContainer>
              {(isCorrect || guesses.length >= 5) ? (
                <Text isCorrect={isCorrect}>
                  {isCorrect ? 'You got it!' : 'You missed!'}
                </Text>
              ) : (
                <>
                  <Form>
                    <Autocomplete
                      id="guessing-input"
                      value={guess || null}
                      options={options.map((option) => option.name)}
                      onChange={(event: any, newValue: string | null) => {
                        setGuess(newValue)
                      }}
                      clearOnEscape
                      disableClearable
                      blurOnSelect
                      renderInput={(params) => (
                        <Input
                          {...params}
                          InputProps={{
                            ...params.InputProps,
                            type: 'search',
                            placeholder: 'Enter name character...',
                          }}
                        />
                      )}
                    />
                    <SubmitButton 
                      type="button"
                      disabled={!guess} 
                      onClick={handleGuessing}
                    >
                      SUBMIT
                    </SubmitButton>
                  </Form>
                  <GuessNumber>
                    {guesses.length}/5
                  </GuessNumber>
                </>
              )}
              <List>
                {guesses && guesses.map((item, index) => (
                  <li key={`${item}-${index}`}>
                    <Close />
                    {item}
                  </li>
                ))}
              </List>
              {(isCorrect || guesses.length >= 5) && (
                <ShareSection >
                  <button type="button" onClick={handleShare}>
                    SHARE
                  </button>
                </ShareSection>
              )}
            </>
          ): (
            <ReactLoading 
              type={'spin'} 
              color={'#2A3740'} 
              height={200} 
              width={200} 
            />
          )}
        </Content>
        <Footer>
          <p>
            This site uses <a href="https://developer.marvel.com/" target="blank">{"Marvel's API"}</a> and icons from <a href="https://mui.com/" target="blank">Material UI</a>
          </p>
        </Footer>
        {showAlert && (
          <SharedAlert 
            onClose={() => setShowAlert(false)}
            variant="filled" 
            severity="success"
          >
            Copied link to clipboard
          </SharedAlert>
        )}
      </Container>
      <AboutModal open={open} onClose={() => setOpen(false)}/>
    </>
  )
}

const getDates = () => {
  const timeZone = 'America/Sao_Paulo'
  const type =`yyyy-MM-dd'T'HH:mm:ss.SSSxxx`

  const firstDay = utcToZonedTime(
    format(startOfDay(new Date(`${process.env.NEXT_PUBLIC_DATE}T00:00:00Z`)), type),
    timeZone
  )
  const date = utcToZonedTime(
    format(new Date(), type),
    timeZone
  )

  let days = differenceInDays(date, firstDay)
  days = days > 0 ? days -1 : days 

  return days
}

export const getStaticProps = async () => {
  const days = getDates()
  const [data] = await getCharacter(list.characters[days].id)

  const options = [...list.characters]
  options.sort((a, b) => a.id - b.id )

  return {
    revalidate: 80000,
    props: { 
      data, 
      days,
      options
    }
  };
};

export default Home
