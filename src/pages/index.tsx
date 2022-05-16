import type { NextPage } from 'next'
import { useState, useMemo, useEffect } from 'react'
import { 
  Close, 
  Translate
} from '@material-ui/icons'
import { TextField, Dialog } from '@material-ui/core';
import { 
  Autocomplete, 
  Alert, 
} from '@material-ui/lab';
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
import labels from '../data/index.json'

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
  align-items: flex-start;
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

  button {
    height: 28px;
    width: 28px;
    background-color: #000;
    border-radius: 50%;

    display: flex;
    align-items: center;
    justify-content: center;

    cursor: pointer;

    svg {
      font-size: 18px;
      color: #fff;
    }

    span {
      font-size: 18px;
      color: #fff;
      font-weight: bold;
    }
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
    padding: 0 15px;

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
  padding: 32px 32px 0 32px;

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
  padding: 0 32px 32px 32px;

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

  li {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;

    & + li {
      margin-top: 18px;
    }

    div {
      position: relative;
      height: 20px;
      width: 30px;
    }

    span {
      font-size: 20px;
      line-height: 24px;
      color: ${({ theme }) => theme.colors.text};
      font-weight: 600;
      margin-left: 12px;

      &:hover {
        color: ${({ theme }) => theme.colors.primary}; 
      }
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
  language: string,
  onClose: () => void;
}

const AboutModal = ({open, language, onClose}: IAbout) => {
  return (
    <Dialog onClose={onClose} open={open}>
      <ModalHeader>
        <h2>{labels[language].texts.modal_title}</h2>
        <button type="button" onClick={onClose}>
          <Close />
        </button>
      </ModalHeader>
      <ModalSection>
        <p>{labels[language].texts.modal_texts[0]} <a href="https://www.nytimes.com/games/wordle/index.html" target="blank">Wordle</a>, <a href="https://term.ooo/" target="blank">Termoo</a>, <a href="https://www.gabtoschi.com/letreco/" target="blank">Letreco</a> {labels[language].texts.modal_texts[1]} <a href="https://framed.wtf/" target="blank">Framed</a></p>
        <p>{labels[language].texts.modal_texts[2]} <a href="https://developer.marvel.com/" target="blank">{labels[language].texts.modal_texts[3]}</a>.</p>
        <p>{labels[language].texts.modal_texts[4]}</p>
        <p>{labels[language].texts.modal_texts[5]}</p>
      </ModalSection>
    </Dialog>
  )
}

export interface ILanguage {
  open: boolean;
  language: string,
  onClose: (value: string | null) => void;
}

const LanguageModal = ({open, language, onClose}: ILanguage) => {
  return (
    <Dialog onClose={() => onClose(null)} open={open}>
      <ModalHeader>
        <h2>{labels[language].texts.languages_texts[0]}</h2>
        <button type="button" onClick={() => onClose(null)}>
          <Close />
        </button>
      </ModalHeader>
      <ModalSection>
        <li>
          <div>
            <Image 
              src={'https://flagcdn.com/h20/us.png'}
              alt="Brazil flag"
              layout="fill"
              objectFit="cover"
            />
          </div>
          <button type="button" onClick={() => onClose('en')}>
            <span>{labels[language].texts.languages_texts[1]}</span>
          </button>
        </li>
        <li>
          <div>
            <Image 
              src={'https://flagcdn.com/h20/br.png'}
              alt="USA flag"
              layout="fill"
              objectFit="cover"
            />
          </div>
          <button type="button" onClick={() => onClose('pt')}>
            <span>{labels[language].texts.languages_texts[2]}</span>
          </button>
        </li>
      </ModalSection>
    </Dialog>
  )
}

interface IOption {
  id: number,
  name: string,
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
}

const Home: NextPage = ({ data, days } : IHome) => {
  const [language, setLanguage] = useState('en')
  const [guess, setGuess] = useState<IOption | null>(null);
  const [guesses, setGuesses] = useState<IOption[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [aboutModalopen, setAboutModalOpen] = useState(false);
  const [LanguageModalopen, setLanguageModalOpen] = useState(false);

  const setLocalStorage = (key: string, value: string) => {
    localStorage.setItem(key, value)
  }

  const getLocalStorage = (key: string) => {
    return localStorage.getItem(key);
  }

  const getLanguage = () => {
    const storeLanguage = getLocalStorage('language')

    if(storeLanguage) {
      setLanguage(storeLanguage)
      setLocalStorage('language', storeLanguage)
    } else if (navigator.language) {
      setLanguage(navigator.language === 'pt-BR' ? 'pt' : 'en')
      setLocalStorage('language', navigator.language === 'pt-BR' ? 'pt' : 'en')
    } else {
      setLanguage('en')
      setLocalStorage('language', 'en')
    }
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
    if(guess.id === answer) {
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

    setGuess(null)
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
        data.id,
        `${data.thumbnail.path}.${data.thumbnail.extension}`,
      ]
    }

    return ['', '']
  }, [data])

  let options = useMemo(() => {
    const list = labels[language].characters
    return list.sort((a: IOption, b: IOption) => a.id - b.id)
  }, [language])

  useEffect(() => {
    getLanguage()
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
        <title>AmINerdola - {labels[language].texts.title_label}</title>
        <meta name="description" content={labels[language].texts.title_label} />
        <link rel="icon" href="/icon.png" />
      </Head>
      <Container>
        <Header>
          <button type="button" onClick={() => setLanguageModalOpen(true)}>
            <Translate />
          </button>
          <h1>
            AMINERDOLA
          </h1>
          <button type="button" onClick={() => setAboutModalOpen(true)}>
            <span>i</span>
          </button>
        </Header>
        <Content>
          {thumbnail ? (
            <>
              <span className="answer">
                {(isCorrect || guesses.length >= 5) ?
                 options[options.map((x: IOption) => x.id).indexOf(answer)].name :
                 '???'
                }
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
                  {isCorrect ? labels[language].texts.correct_text_label : labels[language].texts.wrong_text_label}
                </Text>
              ) : (
                <>
                  <Form>
                    <Autocomplete
                      id="guessing-input"
                      value={guess || null}
                      options={options}
                      getOptionLabel={(options) => options.name}
                      onChange={(event: any, newValue: IOption) => {
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
                      {labels[language].texts.submitButton_label}
                    </SubmitButton>
                  </Form>
                  <GuessNumber>
                    {guesses.length}/5
                  </GuessNumber>
                </>
              )}
              <List>
                {guesses && guesses.map((item, index) => (
                  <li key={`${item.id}-${index}`}>
                    <Close />
                    {options[options.map((x: IOption) => x.id).indexOf(item.id)].name}
                  </li>
                ))}
              </List>
              {(isCorrect || guesses.length >= 5) && (
                <ShareSection >
                  <button type="button" onClick={handleShare}>
                    {labels[language].texts.shareButton_label}
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
            {labels[language].texts.footer_texts[0]} <a href="https://developer.marvel.com/" target="blank">{labels[language].texts.footer_texts[1]}</a> {labels[language].texts.footer_texts[2]} <a href="https://mui.com/" target="blank">{labels[language].texts.footer_texts[3]}</a>
          </p>
        </Footer>
        {showAlert && (
          <SharedAlert 
            onClose={() => setShowAlert(false)}
            variant="filled" 
            severity="success"
          >
            {labels[language].texts.shareButton_alert}
          </SharedAlert>
        )}
      </Container>
      <AboutModal 
        open={aboutModalopen} 
        language={language} 
        onClose={() => setAboutModalOpen(false)}
      />
      <LanguageModal 
        open={LanguageModalopen} 
        language={language} 
        onClose={(value) => { 
          setLanguage(value || language);
          setLocalStorage('language', value || language)
          setLanguageModalOpen(false)
        }}
      />
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
  const [data] = await getCharacter(labels.en.characters[days].id)

  return {
    revalidate: 1000,
    props: { data, days }
  };
};

export default Home
