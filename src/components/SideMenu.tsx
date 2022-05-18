import Image from 'next/image'
import Router from 'next/router'
import { useState, useEffect } from 'react'
import { Switch } from '@material-ui/core';
import { 
  Brightness2, 
  Brightness7,
  Close, 
  ArrowBackIos,
  ArrowForwardIos,
  Extension
} from '@material-ui/icons'
import styled from 'styled-components'
import ITexts from '../interfaces/texts'

const SideMenuContainer = styled.div<{open: boolean}>`
  position: fixed;
  top: 0;
  left: 0;

  display: ${({ open }) => open ? 'flex' : 'none'};
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  width: 320px;
  height: 100%;
  padding: 32px 24px 8px 24px;
  border-radius: 0 8px 8px 0;

  background-color: ${({ theme }) => theme.colors.secondary};
  z-index: 1;
`
const MenuHeader = styled.header`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;

  width: 100%;
  padding-bottom: 16px;
  margin-bottom: 32px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondary};

  h1 {
    font-family: 'Koulen', cursive;
    font-size: 40px;
    line-height: 44px;
    color: ${({ theme }) => theme.colors.primary};
  }

  svg {
    font-size: 20px;
    color: ${({ theme }) => theme.colors.text};
  }

  button {
    cursor: pointer;
  }
`
const MenuFooter = styled.footer`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;

  width: 100%;
  padding-top: 16px;
  margin-top: auto;
  border-top: 1px solid ${({ theme }) => theme.colors.secondary};

  span {
    font-size: 16px;
    line-height: 22px;
    color: ${({ theme }) => theme.colors.text};
    font-weight: 600;
    margin-bottom:  16px;

    a {
      text-decoration: none;
      color: ${({ theme }) => theme.colors.primary};
      font-weight: bold;
      margin-left: 4px;
    }
  }
`
const MenuBody = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  width: 100%;
  overflow-y: auto; 
`
const MenuItem = styled.li`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 16px;

  div {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    span.text {
      margin-left: 8px;
    }
  }

  span {
    font-size: 20px;
    line-height: 22px;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.text};
  }

  button {
    cursor: pointer;
  }

  svg {
    font-size: 22px;
    color: ${({ theme }) => theme.colors.text};

    &.arrow-right {
      font-size: 18px;
      color: ${({ theme }) => theme.colors.text};
    }
  }

  & + li {
    padding-top: 16px;

    &.border-top {
      margin-top: 32px;
      border-top: 1px solid ${({ theme }) => theme.colors.secondary};
    }
  }
`
const SubSection = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 0 32px 32px 32px;

  li {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    cursor: pointer;

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
      margin-left: 16px;

      &:hover {
        color: ${({ theme }) => theme.colors.primary}; 
      }
    }
  }
`

interface ISideMenu {
  open: boolean
  texts: ITexts
  onClose: () => void
}
const SideMenu = ({ 
  open,
  texts,
  onClose 
} : ISideMenu) => {
  const [darkMode, setDarkMode] = useState(false)
  const [hardMode, setHardMode] = useState(false)
  const [subSection, setSubSection] = useState(false)

  const handleChangeDarkMode = (value: boolean) => {
    setDarkMode(value)
    localStorage.setItem('darkMode', `${value}`)
  }

  const handleChangeHardMode = (value: boolean) => {
    setHardMode(value)
    localStorage.setItem('hardMode', `${value}`)
  }

  useEffect(() => {
    const isDarkModeOn = localStorage.getItem('darkMode')
    const isHardModeOn = localStorage.getItem('hardMode')

    setDarkMode(isDarkModeOn === 'true')
    setDarkMode(isHardModeOn === 'true')
  }, [])

  return (
    <SideMenuContainer open={open}>
      {subSection ? (
        <>
          <MenuHeader>
            <button type="button" onClick={() => setSubSection(false)}>
              <ArrowBackIos />
            </button>
            <h2>{texts.menu[0]}</h2>
            <div />
          </MenuHeader>
          <SubSection>
            <li>
              <div>
                <Image 
                  src={'https://flagcdn.com/h20/us.png'}
                  alt="USA flag"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <button type="button" onClick={() =>  Router.push('/en')}>
                <span>{texts.menu[3]}</span>
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
              <button type="button" onClick={() => Router.push('/pt')}>
                <span>{texts.menu[4]}</span>
              </button>
            </li>
          </SubSection>
        </>
      ) : (
        <>
          <MenuHeader>
            <div />
            <h1>MG</h1>
            <button type="button" onClick={onClose}>
              <Close />
            </button>
          </MenuHeader>
          <MenuBody>
            <MenuItem >
              <span>{texts.menu[0]}</span>
              <button
                type="button" 
                onClick={() => setSubSection(true)}
              >
                <ArrowForwardIos className="arrow-right"/>
              </button>
            </MenuItem>
            <MenuItem className="border-top">
              <span className='text'>{texts.menu[1]}</span>
              <div>
                <Brightness2 />
                <Switch 
                  value={darkMode} 
                  defaultChecked={darkMode}
                  onChange={() => handleChangeDarkMode(!darkMode)} 
                />
                <Brightness7 />
              </div>
            </MenuItem>
            <MenuItem>
              <span className='text'>{texts.menu[2]}</span>
              <div>
                <Extension />
                <Switch             
                  value={hardMode} 
                  defaultChecked={hardMode}
                  onChange={() => handleChangeHardMode(!hardMode)}  
                />
                <Extension />
              </div>
            </MenuItem>
          </MenuBody>
        </>
      )}
      <MenuFooter>
        <span>{texts.menu[5]}<a href="https://github.com/igorjung" target="blank">@igorjung</a></span>
      </MenuFooter>
    </SideMenuContainer>
  )
}
export default SideMenu