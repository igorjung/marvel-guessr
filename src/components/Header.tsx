import Router from 'next/router'
import Image from 'next/image'
import { useState } from 'react'
import { Translate } from '@material-ui/icons'
import styled from 'styled-components'
import Modal from './Modal'
import ITexts from '../interfaces/texts'

const HeaderContainer = styled.header`
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
      font-size: 16px;
      color: #fff;
      font-weight: bold;
    }
  }
`

interface IHeader {
  texts: ITexts,
}
const Header = ({ texts } : IHeader) => {
  const [infoModal, setInfoModal] = useState(false);
  const [languageModal, setLanguageModal] = useState(false);

  return (
    <>
      <HeaderContainer>
        <button 
          type="button" 
          onClick={() => setLanguageModal(true)}
        >
          <Translate />
        </button>
        <h1>
          AMINERDOLA
        </h1>
        <button 
          type="button" 
          onClick={() => setInfoModal(true)}
        >
          <span>i</span>
        </button>
      </HeaderContainer>
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
export default Header