import { useState } from 'react'
import { Alert } from '@material-ui/lab';
import { Close } from '@material-ui/icons'
import styled from 'styled-components'
import IOption from '../interfaces/option'

const ListContainer = styled.ul`
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
const SharedAlert = styled(Alert)`
  position: absolute;
  top: 80px;
  left: 10%;
  width: 80%;
`

interface IList {
  guesses: IOption[]
  options: IOption[]
  isCorrect: boolean
  texts: string[]
  days: number
}
const List = ({ 
  guesses,
  options,
  isCorrect,
  texts,
  days
} : IList) => {
  const [showAlert, setShowAlert] = useState(false);

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

  return (
    <>
    <ListContainer>
      {guesses && guesses.map((item, index) => (
        <li key={`${item.id}-${index}`}>
          <Close />
          {options[options.map((x: IOption) => x.id).indexOf(item.id)].name}
        </li>
      ))}      
    </ListContainer>
    {(isCorrect || guesses.length >= 5) && (
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