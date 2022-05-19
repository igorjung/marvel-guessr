import { useMemo } from 'react'
import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import styled from 'styled-components'
import IOption from '../interfaces/option'
import { getAlphabeticalList } from '../utils'

const FormContainer = styled.div`
  display: grid;
  grid-template-columns: 80% 20%;

  width: 100%;
  padding: 0 64px;
  margin-top: 30px;

  @media only screen and (max-width: 820px) {
    display: block;
    text-align: center;
    padding: 0;
  }
`
const Input = styled(TextField)`
  width: 100%;
  height: 35px;

  button {
    display: none;
  }

  input {
    color: ${({ theme }) => theme.text.primary};
  }

  ::-webkit-input-placeholder { /* Edge */
    color: ${({ theme }) => theme.text.tertiary};
  }

  :-ms-input-placeholder { /* Internet Explorer 10-11 */
    color: ${({ theme }) => theme.text.tertiary};
  }

  ::placeholder {
    color: ${({ theme }) => theme.text.tertiary};
  }
`
const SubmitButton = styled.button`
  height: 35px;
  width: 120px;
  margin-left: auto;

  font-size: 16px;
  line-height: 24px;
  font-weight: bold;

  border-radius: 4px;
  cursor: pointer;

  @media only screen and (max-width: 820px) {
    margin: 16px 0 0 0;
  }
`
const GuessNumber = styled.span`
  font-size: 24px;
  font-weight: 600;
  width: 100%;
  text-align: center;
  margin-top: 16px;
`

interface IForm {
  list: IOption[]
  guesses: IOption[]
  guess: IOption
  chances: number
  text: string
  onInsert: (value: IOption) => void
  onConfirm: () => void
}
const Form = ({ 
  list, 
  guesses, 
  guess,
  chances,
  text,
  onInsert,
  onConfirm
} : IForm) => {

  let options = useMemo(() => {
    return getAlphabeticalList(list)
  }, [list])

  return (
    <>
      <FormContainer>
        <Autocomplete
          id="guessing-input"
          value={guess || null}
          options={options}
          getOptionLabel={(options) => options.name}
          onChange={(event: any, newValue: IOption) => {
            onInsert(newValue)
          }}
          clearOnEscape
          disableClearable
          blurOnSelect
          renderInput={(params) => (
            <Input
              {...params}
              InputProps={{
                ...params.InputProps,
                type: 'search',
                placeholder: 'Enter name character...',
              }}
            />
          )}
        />
        <SubmitButton 
          type="button"
          disabled={!guess} 
          onClick={onConfirm}
        >
          {text}
        </SubmitButton>
      </FormContainer>
      <GuessNumber>
        {guesses.length}/{chances}
      </GuessNumber>
    </>
  )
}

export default Form
