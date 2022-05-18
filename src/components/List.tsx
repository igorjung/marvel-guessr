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
  justify-content: flex-start;
  width: 100%;

  margin-top: 32px;
  padding-bottom: 32px;

  li {
    width: 100%;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    text-align: left;

    font-size: 18px;
    font-weight: 400;

    svg {
      color: ${({ theme }) => theme.text.secondary};
      font-size: 18px;

      &.correct {
        color: ${({ theme }) => theme.text.alert};
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
    color: ${({theme}) => theme.text.primary};

    border-radius: 4px;
    background-color: ${({theme}) => theme.button.secondary};
    cursor: pointer;
  }

`;
const SharedAlert = styled(Alert)`
  position: absolute;
  top: 80px;
  left: 10%;
  width: 80%;
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
    if (navigator.share) { 
      const shareData = {
        title: 'MarvelGuessr',
        text: `${guesses.length}/${chances} #${days}\n\n${window.location.href}`,
        url: `${window.location.href}`,
      }

      await navigator.share(shareData);
    } else {
      evt.preventDefault(); 
      navigator.clipboard.writeText(
      `${guesses.length}/${chances} #${days}\n\n${window.location.href}`
      )
    }
    setShowAlert(true)
  }

  return (
    <>
    <ListContainer>
      {guesses && guesses.map((item, index) => (
        <li key={`${item.id}-${index}`}>
          {data.id === item.id ?
            <Check className='correct' /> :
            <Close /> 
          }
          {getNameById(list, item.id)}
        </li>
      ))}      
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