import { Translate } from '@material-ui/icons'
import styled from 'styled-components'

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
      font-size: 18px;
      color: #fff;
      font-weight: bold;
    }
  }
`

interface IHeader {
  onOpenModal: (name: string) => void
}
const Header = ({onOpenModal } : IHeader) => {
  return (
    <HeaderContainer>
      <button 
        type="button" 
        onClick={() => onOpenModal('translate')}
      >
        <Translate />
      </button>
      <h1>
        AMINERDOLA
      </h1>
      <button 
        type="button" 
        onClick={() => onOpenModal('about')}
      >
        <span>i</span>
      </button>
    </HeaderContainer>
  )
}
export default Header