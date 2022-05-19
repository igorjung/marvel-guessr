import { Dialog } from '@material-ui/core'
import { Close } from '@material-ui/icons'
import styled from 'styled-components'

const ModalContainer = styled.div`
  background-color: ${({ theme }) => theme.background.secondary};
  color: ${({ theme }) => theme.text.primary};
  padding: 0;
`
const ModalHeader = styled.header`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  width: 100%;
  margin-bottom: 24px;
  padding: 32px 32px 0 32px;

  h2 {
    font-size: 24px;
    font-weight: bold;
  }

  button {
    cursor: pointer;

    svg {
      font-size: 22px;
      color: ${({ theme }) => theme.text.primary};
    }
  }
`
const ModalSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 0 32px 32px 32px;

  p {
    font-size: 16px;
    line-height: 22px;
    font-weight: 600;
    margin-bottom:  16px;

    a {
      color: ${({ theme }) => theme.text.secondary};
      text-decoration: none;
      font-weight: bold;
    }
  }
`

interface IModal {
  open: boolean
  title: string
  children: React.ReactNode
  onClose: (value: string | null) => void
}
const Modal = ({open, title, children, onClose}: IModal) => {
  return (
    <Dialog onClose={() => onClose(null)} open={open}>
      <ModalContainer>
      <ModalHeader>
        <h2>{title}</h2>
        <button type="button" onClick={() => onClose(null)}>
          <Close />
        </button>
      </ModalHeader>
      <ModalSection>
        {children}
      </ModalSection>
      </ModalContainer>
    </Dialog>
  )
}
export default Modal