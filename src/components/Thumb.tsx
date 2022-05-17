import Image from 'next/image'
import styled from 'styled-components'
import IOption from '../interfaces/option'
import { getNameById } from '../utils'

const ImageContainer = styled.div<{guesses: number, isCorrect: boolean}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  height: 360px;
  width: 800px;
  background-color: ${({ theme }) => theme.colors.secondary};
  border-radius: 8px;

  div {
    position: relative;
    width: 360px;
    height: 360px;
    filter: ${({ isCorrect, guesses }) => isCorrect ? `blur(0px)` : `blur(${(5 - guesses) * 5}px)`};
  }

  @media only screen and (max-width: 820px) {
    width: 100%;
    background-color: none;

    img {
      border-radius: 8px;
    }
  }

  @media only screen and (max-width: 500px) {
    div {
      width: 250px;
      height: 2500px;
    }
  }
`

interface IThumb {
  list: IOption[]
  guesses: IOption[]
  isCorrect: boolean
  data: {
    id: number
    name: string
    thumbnail: {
      path: string
      extension: string
    }
  }
}
const Thumb = ({
  list, 
  guesses, 
  isCorrect,
  data,
}: IThumb) => {
  const thumbnail = `${data.thumbnail.path}.${data.thumbnail.extension}`

  return (
    <>
      <span className="answer">
        {(isCorrect || guesses.length >= 5) ?
        getNameById(list, data.id) :
        '???'
        }
      </span>
      <ImageContainer guesses={guesses.length} isCorrect={isCorrect}>
        <div>
          <Image 
            alt='image'
            layout='fill'
            objectFit='cover'
            priority
            src={thumbnail}   
          />
        </div>
      </ImageContainer>
    </>
  )
}
export default Thumb