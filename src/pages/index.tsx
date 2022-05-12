import type { NextPage } from 'next'
import { useState, useMemo } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styled from 'styled-components'
import { Help, Info } from '@material-ui/icons'
import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import ReactLoading from 'react-loading'

import { getCharacter } from '../services/api'
import list from '../data/characters.json'

const Container = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100vw;
  max-width: 800px;
  height: 100%;

  padding: 32px;
`
const Header = styled.header`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  width: 100%;
  height: 60px;
`
const Content = styled.div`
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 496px;
  height: 224px;
  margin-bottom: 32px;
`
const ImageContainer = styled.div`
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 496px;
  height: 224px;
  margin-bottom: 32px;
`
const Form = styled.div`
  display: grid;
  grid-template-columns: 70% 30%;
  width: 100%;
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
  background-color: red;
`;
const Text = styled.p`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`
const List = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  li {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
`
const Footer = styled.footer`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  width: 100%;
  height: 60px;
  margin-top: auto;
`

interface IHome {
  data: {
    id: number,
    name: string,
    thumbnail: {
      path: string,
      extension: string,
    },
  }
}

const Home: NextPage = ({ data } : IHome) => {
  const [isCorrect, setIsCorrect] = useState(false);
  const [guesses, setGuesses] = useState([]);

  const HandleGuessing = () => {
    const guess = (document.getElementById('guessing-input') as HTMLInputElement).value
    if(guess === answer) {
      setIsCorrect(true)
    } else {
      const guessesList = [...guesses, guess]
      setGuesses(guessesList)
    }
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

  return (
    <>
      <Head>
        <title>Marvels - The daily marvel hero guessing game</title>
        <meta name="description" content="The daily marvel hero guessing game" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <Header>
          Marvels
          <div>
            <Info />
            <Help />
          </div>
        </Header>
        <Content>
          {data ? (
            <>
              <ImageContainer>
                <Image 
                  alt='image'
                  layout='fill'
                  objectFit='cover'
                  src={thumbnail}   
                />
              </ImageContainer>
              {isCorrect ||
              (guesses && guesses.length > 5) ? (
                <Text>
                  {isCorrect ? 'You got it!' : 'You missed!'}
                </Text>
              ) : (
                <Form>
                  <Autocomplete
                    freeSolo
                    id="guessing-input"
                    disableClearable
                    options={list.characters.map((option) => option.name)}
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
                    onClick={HandleGuessing}
                  >SUBMIT</SubmitButton>
                </Form>
              )}
              <List>
                {guesses && guesses.map((item) => (
                  <li key={item}>
                    <span>X</span>
                    {item}
                  </li>
                ))}
              </List>
            </>
          ): (
            <ReactLoading 
              type={'spin'} 
              color={'#000'} 
              height={667} 
              width={375} 
            />
          )}
        </Content>
        <Footer>
          Next Hero: 13:14:01
          These icons and more are from material-icons
          These images are from marvel-api
        </Footer>
      </Container>
    </>
  )
}

export const getStaticProps = async () => {
  const [data] = await getCharacter(list.characters[0].id)

  return {
    revalidate: 300,
    props: {
      data
    }
  };
};

export default Home
