import ReactLoading from 'react-loading'
import { light } from '../styles/themes'

const Loading = () => {
  return (
    <ReactLoading 
      type={'bubbles'} 
      color={light.text.secondary} 
      height={90} 
      width={90} 
    />
  )
}
export default Loading