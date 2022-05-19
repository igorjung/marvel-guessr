import { useState } from 'react'
import { Alert } from '@material-ui/lab';
import { Close, Check } from '@material-ui/icons'
import styled from 'styled-components'
import IOption from '../interfaces/option'
import { getNameById } from '../utils'

const ListContainer = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 32px 0 64px 0;

  ul {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
  }

  li {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;

    font-size: 18px;
    font-weight: 400;

    color: ${({ theme }) => theme.text.primary};

    svg {
      color: ${({ theme }) => theme.text.secondary};
      font-size: 18px;
      margin-right: 4px;

      &.correct {
        color: ${({ theme }) => theme.text.tertiary};
      }
    }

    & + li {
      margin-top: 8px;
    }
  }
`
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

    border-radius: 4px;
    cursor: pointer;
  }

`;
const SharedAlert = styled(Alert)`
  position: fixed;
  top: 60px;
  left: 10%;
  width: 80%;

  svg {
    color: #fff !important;
  }

  button {
    background: none;
  }
`

interface IList {
  guesses: IOption[]
  chances: number
  list: IOption[]
  isCorrect: boolean
  texts: string[]
  days: number
  data:  IOption
}
const List = ({ 
  guesses,
  chances,
  list,
  isCorrect,
  texts,
  days,
  data
} : IList) => {
  const [showAlert, setShowAlert] = useState(false);

  const handleShare = async (evt: { preventDefault: () => void; }) => {
    let guessesText = ''
    for (let index = 1; index <= chances; index++) {
      if(guesses[index - 1]) {
        guessesText += guesses[index - 1].id !== data.id ? '🟥' :'🟩'
      } else {
        guessesText += '⬛'
      }
    }

    if (navigator.share) { 
      const shareData = {
        title: 'MarvelGuessr',
        text: `${window.location.href} #${days}\n\n${guessesText}`,
        url: `${window.location.href}`,
      }

      await navigator.share(shareData);
    } else {
      evt.preventDefault(); 
      navigator.clipboard.writeText(
      `${window.location.href} #${days}\n\n${guessesText}`
      )
    }
    setShowAlert(true)
  }

  return (
    <>
    <ListContainer>
      <ul>
        {guesses && guesses.map((item, index) => (
          <li key={`${item.id}-${index}`}>
            {data.id === item.id ?
              <Check className='correct' /> :
              <Close /> 
            }
            {getNameById(list, item.id)}
          </li>
        ))} 
      </ul>  
    </ListContainer>
    {(isCorrect || guesses.length >= chances) && (
      <ShareSection >
        <button type="button" onClick={handleShare}>
          {texts[0]}
        </button>
      </ShareSection>
    )}
    {showAlert && (
      <SharedAlert 
        onClose={() => setShowAlert(false)}
        variant="filled" 
        severity="success"
      >
        {texts[1]}
      </SharedAlert>
    )}
  </>
  )
}
export default List