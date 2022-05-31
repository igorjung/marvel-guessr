import styled from 'styled-components'
import ITexts from '../interfaces/texts'

const MessageContainer = styled.span<{isCorrect: boolean}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  width: 100%;
  margin-top: 16px;
  text-align: center;

  font-size: 20px;
  font-weight: 600;
  color: ${({theme, isCorrect}) => 
    isCorrect ? 
    theme.text.tertiary : 
    theme.text.secondary
  } !important;
  text-transform: uppercase;
`

interface IMessage {
  isCorrect: boolean
  texts: ITexts
}
const Message = ({ texts, isCorrect }: IMessage) => {
  return (
    <MessageContainer isCorrect={isCorrect}>
      {isCorrect ? (
        <>🎊🎉 {texts.correct_answer} 🎉🎊</>
      ): (
        <>😔😭 {texts.wrong_answer} 😭😔</>
      )}
    </MessageContainer>
  )
}
export default Message