import Router from 'next/router'
import Image from 'next/image'
import { useState } from 'react'
import { Menu, Info } from '@material-ui/icons'
import styled from 'styled-components'
import ITexts from '../interfaces/texts'
import Modal from './Modal'
import SideMenu from './SideMenu'

const HeaderContainer = styled.header`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;

  width: 100%;
  margin-bottom: 48px;
  padding-bottom: 16px;

  border-bottom: 2px solid #2A3740;

  div {
    position: relative;
    height: 30px;
    width: 223px;

    @media only screen and (max-width: 820px) {
      height: 28px;
      width: 208px;
    }
  }

  button {
    height: 24px;
    width: 24px;

    display: flex;
    align-items: center;
    justify-content: center;

    cursor: pointer;

    svg {
      font-size: 24px;
      color: #000;
    }
  }
`

interface IHeader {
  texts: ITexts,
}
const Header = ({ texts } : IHeader) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <HeaderContainer>
        <button 
          type="button" 
          onClick={() => setMenuOpen(true)}
        >
          <Menu />
        </button>
        <div>
          <Image 
            src={'/images/Logo.png'}
            alt="MarvelGuessr"
            layout="fill"
            objectFit="cover"
          />
        </div>
        <button 
          type="button" 
          onClick={() => setModalOpen(true)}
        >
          <Info />
        </button>
      </HeaderContainer>
      <Modal        
        open={modalOpen} 
        title={texts.info[0]}
        onClose={() => setModalOpen(false)}
      >
        <p>{texts.info[1]} <a href="https://www.nytimes.com/games/wordle/index.html" target="blank">Wordle</a>, <a href="https://term.ooo/" target="blank">Termoo</a>, <a href="https://www.gabtoschi.com/letreco/" target="blank">Letreco</a> {texts.info[2]} <a href="https://framed.wtf/" target="blank">Framed</a></p>
        <p>{texts.info[3]} <a href="https://developer.marvel.com/" target="blank">{texts.info[4]}</a>.</p>
        <p>{texts.info[5]}</p>
        <p>{texts.info[6]}</p>
      </Modal>
      <SideMenu 
        open={menuOpen}
        texts={texts}
        onClose={() => setMenuOpen(false)}
      />
    </>
  )
}
export default Header