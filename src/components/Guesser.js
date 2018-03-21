import React from 'react'
import styled from 'styled-components'
import ReactShow from 'react-show'

import Wheel from 'utils/Wheel'

import Slice from 'components/Slice'
import QuestionIcon from 'components/QuestionIcon'

const Styles = styled.div`
  height: 100%;
  width: 100%;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  form {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;

    > div {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;

      .slice-wrapper {
        position: relative;
      }

      .slice {
        width: 200px;
        height: 200px;
        margin-bottom: 2rem;
      }

      .icon {
        position: absolute;
        top: 70px;
        left: 50%;
        width: 50px;
        transform: translateX(-50%) scale(${props => (!props.wheelValue ? '0.9' : '1.3')});
        transition: all 0.5s ease-out;
        path {
          fill: white;
          transition: all 0.5s ease-out;
        }
      }

      .question {
        font-size: 1.8rem;
        padding: 1rem;
        text-align: center;
      }

      input {
        appearance: none;
        border: 2px solid rgba(0, 0, 0, 0.1);
        border-radius: 0.5rem;
        font-size: 2rem;
        padding: 0.5rem;
        text-align: center;
        margin: 0.5rem 1rem;
        align-self: stretch;
        outline: none;
        transition: all 0.2s ease-out;

        :focus {
          border: 2px solid rgba(0, 0, 0, 0.2);
        }
      }

      button {
        appearance: none;
        background: ${props => (props.hasValue ? 'rgb(23, 194, 121)' : 'rgb(191, 191, 191)')};
        color: white;
        font-size: 1.5rem;
        border: 0;
        padding: 1rem 0.5rem;
        margin: 0.5rem 1rem;
        align-self: stretch;
        border-radius: 0.5rem;
        transition: all 0.2s ease-out;
        outline: 0;

        :active {
          background: rgb(0, 145, 83);
        }
      }

      .error {
        font-size: 1.5rem;
        padding: 1rem;
        font-weight: bold;
        color: rgb(240, 81, 81);
      }
    }
  }

  .back {
    background: rgb(57, 57, 57);
    color: white;
    appearance: none;
    align-self: stretch;
    padding: 1rem;
    font-size: 1.2rem;
    border: 0;
  }
`

export default ({
  guessingIndex,
  wheel,
  guessingValue,
  guessingError,
  close,
  approveGuess,
  denyGuess,
  setGuessingValue,
  show,
}) => {
  const piece = Wheel.slices[guessingIndex]
  return (
    <ReactShow
      show={show}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        overflow: 'hidden',
      }}
      duration={400}
      styleShow={{
        opacity: 1,
        transform: 'scale(1)',
        // filter: 'blur(0)',
        borderRadius: '0',
      }}
      styleHide={{
        opacity: 0,
        transform: 'scale(0.9)',
        // filter: 'blur(10px)',
        borderRadius: '100px',
      }}
    >
      <Styles hasValue={guessingValue} wheelValue={wheel[guessingIndex]}>
        <form
          onSubmit={e => {
            e.preventDefault()
            if (
              piece.secret.find(
                secret =>
                  secret
                    .split('')
                    .map(d => d.toLowerCase())
                    .join('') ===
                  guessingValue
                    .split('')
                    .map(d => d.toLowerCase())
                    .join('')
              )
            ) {
              if (!wheel[guessingIndex]) {
                approveGuess(1)
                close()
              }
            } else {
              setGuessingValue('')
              denyGuess()
            }
          }}
        >
          <div>
            <div className="slice-wrapper">
              <Slice className="slice" color={piece.color} />
              <QuestionIcon className="icon" />
            </div>
            <input
              type="text"
              value={guessingValue}
              onChange={e => setGuessingValue(e.target.value)}
            />
            <button type="submit">Submit</button>
            <ReactShow show={guessingError}>
              <div className="error">{guessingError}</div>
            </ReactShow>
          </div>
        </form>
        <button
          type="button"
          className="back"
          onClick={() => {
            if (wheel[guessingIndex]) {
              approveGuess(0)
            }
            close()
          }}
        >
          Cancel
        </button>
      </Styles>
    </ReactShow>
  )
}
