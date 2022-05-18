import ReactLoading from 'react-loading'
import { light } from '../styles/themes'

const Loading = () => {
  return (
    <ReactLoading 
      type={'bubbles'} 
      color={light.text.primary} 
      height={90} 
      width={90} 
    />
  )
}
export default Loading