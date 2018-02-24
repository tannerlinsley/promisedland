import React from 'react'
import styled, { css, keyframes } from 'styled-components'

const upDown = keyframes`
  0%, 100% {
    transform: translateY(0)
  }
  70% {
    transform: translateY(5px)
  }
`

const Styles = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  opacity: 0;
  transition: all 0.3s ease-out;
  pointer-events: none;

  ${props =>
    props.show &&
    css`
      opacity: 1;
      pointer-events: all;
    `};

  img {
    width: 80%;
    max-width: 400px;
    margin-bottom: 5rem;
  }

  h1 {
    font-size: 2rem;
    margin-bottom: 20vh;
    animation: 1s infinite ${upDown} ease-out;
  }
`

export default ({ show }) => (
  <Styles show={show}>
    <img alt="" src="/img/logo.svg" />
    <h1>Pondering...</h1>
  </Styles>
)
