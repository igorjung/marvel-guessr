import Image from 'next/image'
import styled from 'styled-components'
import IOption from '../interfaces/option'
import { getNameById } from '../utils'

const AnswerText = styled.span`
  color: ${({ theme }) => theme.text.primary};
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 12px;
  text-transform: uppercase;
`

const ImageContainer = styled.div<{
  guesses: number,
  chances:number,
  isCorrect: boolean
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;
  background-color: #333;
  border-radius: 8px;

  img {
    border-radius: 8px;
  }

  div {
    position: relative;
    width: 360px;
    height: 360px;
    filter: ${({ 
      isCorrect, 
      chances, 
      guesses 
    }) => isCorrect ?
    `blur(0px)` :
    `blur(${
      (chances - guesses) *
      (chances === 6 ? 5 : 10)
    }px)`
    };
  }

  .thumb-container:after {
    content: " ";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 99;
  }

  @media only screen and (max-width: 820px) {
    background: none;
  }

  @media only screen and (max-width: 500px) {
    div {
      width: 250px;
      height: 250px;
    }
  }
`

interface IThumb {
  list: IOption[]
  guesses: IOption[]
  chances: number
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
  chances,
  isCorrect,
  data,
}: IThumb) => {
  const thumbnail = `${data.thumbnail.path}.${data.thumbnail.extension}`

  return (
    <>
      <AnswerText>
        {(isCorrect || guesses.length >= chances) ?
        getNameById(list, data.id) :
        '???'
        }
      </AnswerText>
      <ImageContainer 
        guesses={guesses.length} 
        chances={chances}
        isCorrect={isCorrect}
      >
        <div className='thumb-container'>
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