import React from 'react'
import styled, { keyframes } from 'styled-components'
import ReactShow from 'react-show'
//

const upDown = keyframes`
  0%, 100% {
    transform: translateY(0)
  }
  80% {
    transform: translateY(10px)
  }
`

const upDown2 = keyframes`
  0%, 100% {
    transform: translateY(0)
  }
  50% {
    transform: translateY(10px)
  }
`

const Styles = styled.div`
  height: 100%;
  width: 100%;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  img {
    max-width: 80%;
    width: 400px;
    margin-bottom: 3rem;
    animation: 3s infinite ${upDown2} linear;
  }

  h1 {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 2rem;
    color: rgb(222, 193, 0);
    animation: 1s infinite ${upDown} ease-out;
  }

  p {
    max-width: 80%;
    font-size: 1.2rem;
    margin-bottom: 5rem;
    text-align: center;
    line-height: 1.5;
  }
`

export default class Chat extends React.Component {
  state = {
    value: '',
    error: false,
  }
  render () {
    const { show } = this.props
    const { value, error } = this.state
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
          transform: 'translateY(0)',
        }}
        styleHide={{
          transform: 'translateY(100%)',
        }}
        duration={200}
      >
        <Styles hasError={error} hasValue={value && value.length === 3}>
          <img alt="" src="/img/logo.svg" />
          <h1>Power Restored!</h1>
          <p>The room is now unlocked and you may now exit!</p>
        </Styles>
      </ReactShow>
    )
  }
}
