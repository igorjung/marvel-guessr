import styled from 'styled-components'

const FooterContainer = styled.footer`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  width: 100%;
  margin-top: auto;

  p {
    font-size: 16px;
    font-weight: 600;

    a {
      text-decoration: none;
      font-weight: bold;
    }
  }
`
interface IFooter {
  texts: string[]
}
const Footer = ({ texts }: IFooter) => {
  return (
    <FooterContainer>
      <p>
        {texts[0]} <a href="https://developer.marvel.com/" target="blank">{texts[1]}</a> {texts[2]} <a href="https://mui.com/" target="blank">{texts[3]}</a>
      </p>
  </FooterContainer>
  )
}
export default Footer