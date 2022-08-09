import Image from 'next/image'
import styled from 'styled-components'
import IOption from '../interfaces/option'
import { getNameById } from '../utils'

const AnswerText = styled.div`
  position: relative;
  width: 100%;
  text-align: center;
  margin-bottom: 12px;

  span {
    color: ${({ theme }) => theme.text.primary};
    font-size: 24px;
    font-weight: bold;
    text-transform: uppercase;
  }
`
const WinStreakText = styled.div`
  position: absolute;
  top: 0;
  right: 4px;
  font-size: 22px;

  span {
    color: ${({ theme }) => theme.text.primary};
    font-size: 20px;
    line-height: 22px;
    font-weight: bold;
    margin-left: 4px;
  }

  @media only screen and (max-width: 820px) {
    top: 0;
    right: -14px;

    span {
      font-size: 14px;
      line-height: 16px;
      margin-left: 2px;
    }
  }
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

    img {
      border-radius: 8px;
    }
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
  winStreak: number
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
  winStreak,
  data,
}: IThumb) => {
  const thumbnail = `${data.thumbnail.path}.${data.thumbnail.extension}`

  return (
    <>
      <AnswerText>
        <span>
          {(isCorrect || guesses.length >= chances) ?
          getNameById(list, data.id) :
          '???'
          }
        </span>

        {winStreak > 1 && (
          <WinStreakText>
            🔥
            <span>
              {winStreak}
            </span>
          </WinStreakText>
        )}
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