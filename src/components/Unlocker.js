import React from 'react'
import styled, { css, keyframes } from 'styled-components'
import ReactShow from 'react-show'
//

import Wheel from 'utils/Wheel'

import Lock from 'components/Lock'

const wiggle = keyframes`
  0%, 100% {
    transform: translateX(0);
  }
  20%, 60% {
    transform: translateX(20px);
  }
  40%, 80% {
    transform: translateX(-20px);
  }
`

const Styles = styled.div`
  height: 100%;
  width: 100%;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  .back {
    background: rgb(57, 57, 57);
    color: white;
    appearance: none;
    align-self: stretch;
    padding: 1rem;
    font-size: 1.2rem;
    border: 0;
    flex: 0 0 auto;
  }

  > form {
    flex: 1 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;

    .lock {
      position: relative;
      left: initial;
      top: initial;
      transform: none;
      width: 100px;
      margin-bottom: 2rem;
      path {
        fill: ${props => (props.hasError ? 'rgb(237, 87, 87)' : 'rgb(23, 194, 121)')};
      }
      ${props =>
    props.hasError &&
        css`
          animation: ${wiggle} 0.6s;
        `};
    }

    .inputs {
      display: flex;
      flex-direction: column;
      width: 100%;
      margin-bottom: 2rem;
      input {
        appearance: none;
        border: 2px solid rgba(0, 0, 0, 0.1);
        border-radius: 0.5rem;
        font-size: 1.2rem;
        padding: 1rem;
        text-align: left;
        margin: 0.5rem 1rem 0;
        align-self: stretch;
        outline: none;
        transition: all 0.2s ease-out;

        :focus {
          border: 2px solid rgba(0, 0, 0, 0.2);
        }
      }

      > div {
        box-sizing: border-box;
        position: absolute;
        top: 0;
        width: 50px;
        height: 100%;
        border: solid 4px rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        pointer-events: none;

        &:nth-child(2) {
          left: 49px;
        }

        &:nth-child(3) {
          left: 103px;
        }

        &:nth-child(4) {
          left: 157px;
        }
      }
    }

    button {
      appearance: none;
      background: ${props => (props.hasValue ? 'rgb(23, 194, 121)' : 'rgb(191, 191, 191)')};
      color: white;
      font-size: 1.5rem;
      border: 0;
      padding: 1rem 2rem;
      margin: 0.5rem 0 2rem;
      border-radius: 0.5rem;
      transition: all 0.2s ease-out;
      outline: 0;

      :active {
        background: rgb(0, 145, 83);
      }
    }
  }
`

export default class Chat extends React.Component {
  state = {
    guesses: Wheel.unlock.answers.map(() => ''),
    error: false,
  }
  render () {
    const { show, close, unlockRoom } = this.props
    const { guesses, error } = this.state
    return (
      <ReactShow
        show={show}
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          overflow: 'hidden',
        }}
        styleShow={{
          borderRadius: '0px',
          transform: 'scale(1)',
        }}
        styleHide={{
          borderRadius: '800px',
          transform: 'scale(0)',
        }}
        duration={200}
      >
        <Styles hasError={error} hasValue={guesses.every(d => d)}>
          <button
            type="button"
            className="back"
            onClick={() => {
              this.setState({
                value: '',
              })
              close()
            }}
          >
            Cancel
          </button>
          <form
            onSubmit={e => {
              e.preventDefault()

              if (
                Wheel.unlock.answers.every(answer =>
                  guesses.find(
                    guess =>
                      answer ===
                      guess
                        .split('')
                        .map(d => d.toLowerCase())
                        .join('')
                  )
                )
              ) {
                unlockRoom()
              } else {
                this.setState({
                  error: true,
                })
                setTimeout(
                  () =>
                    this.setState({
                      error: false,
                    }),
                  1000
                )
              }
            }}
          >
            <Lock className="lock" />
            <div className="inputs">
              {Wheel.unlock.answers.map((answer, i) => (
                <input
                  key={answer}
                  value={guesses[i]}
                  placeholder={`Keyword ${i + 1}`}
                  onChange={e => {
                    const value = e.target.value
                    this.setState({
                      guesses: [...guesses.slice(0, i), value, ...guesses.slice(i + 1)],
                    })
                  }}
                />
              ))}
            </div>
            <button type="submit">Unlock Room</button>
          </form>
        </Styles>
      </ReactShow>
    )
  }
}
