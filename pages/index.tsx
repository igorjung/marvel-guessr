import type { NextPage } from 'next'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styled from 'styled-components'
import { Help, Info } from '@material-ui/icons';

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
const Form = styled.form`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  width: 100%;

  button {
    display: flex;
    align-items: center;
    justify-content: center;

    height: 60px;
    width: 120px;
    border-radius: 8px;
    color: #fff;
    background: #000;
  }
`
const TextField = styled.input`
  height: 60px;
  border-radius: 8px;
  border: 1px solid #000;
`
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

const Home: NextPage = () => {
  const [isCorrect, setIsCorrect] = useState(false);
  const [guess, setGuess] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [answer, setAnswer] = useState('teste');

  const HandleGuessing = () => {
    if(guess === answer) {
      setIsCorrect(true)
    } else {
      const guessesList = [...guesses, guess]
      setGuesses(guessesList)
    }
  }

  useEffect(() => {
    
  }, [])

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
        <ImageContainer>
          <Image src="/images/download.png" alt="image" layout="fill" objectFit='cover'/>
        </ImageContainer>
        {isCorrect ||
         (guesses && guesses.length > 5) ? (
          <Text>
            {isCorrect ? 'You got it!' : 'You missed!'}
          </Text>
        ) : (
          <Form>
            <TextField type="text" onChange={(e) => setGuess(e.target.value)}/>
            <button type="button" onClick={HandleGuessing}>Submit</button>
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
  const api = `http://gateway.marvel.com/v1/public/comics?ts=1&apikey=${process.env.NEXT_PUBLIC_KEY}&hash=${process.env.NEXT_PUBLIC_HASH}`
  const request = await fetch(api)
  console.log('########', request.json())

  return {
    revalidate: 300,
  };
};

export default Home
