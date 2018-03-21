import React from 'react'
import styled, { keyframes } from 'styled-components'

import Wheel from 'utils/Wheel'

import Slice from 'components/Slice'
import QuestionIcon from 'components/QuestionIcon'

const swirls = [1, 2, 3, 4, 5, 6].map(
  d => keyframes`
  ${(0 + 2 * d) % 100}%, ${(10 + 2 * d) % 100}% {
    opacity: 0.3;
  }
  ${(5 + 2 * d) % 100}% {
    opacity: 0.6;
  }
  ${(13 + 2 * d) % 100}%, ${(23 + 2 * d) % 100}% {
    opacity: 0.3;
  }
  ${(18 + 2 * d) % 100}% {
    opacity: 0.6;
  }
`
)

const doneSwirls = [1, 2, 3, 4, 5, 6].map(
  d => keyframes`
  ${(0 + 2 * d) % 100}%, ${(10 + 2 * d) % 100}% {
    opacity: 1;
  }
  ${(5 + 2 * d) % 100}% {
    opacity: 0.8;
  }
  ${(13 + 2 * d) % 100}%, ${(23 + 2 * d) % 100}% {
    opacity: 1;
  }
  ${(18 + 2 * d) % 100}% {
    opacity: 0.8;
  }
`
)

const Styles = styled.div`
  position: absolute;
  width: 120px;
  height: 75px;
  top: 10px;
  left: 50%;
  transform: translateX(-50%) rotate(${props => props.rotation}deg);
  padding: 0 100px 180px 100px;
  pointer-events: none;
  opacity: ${props => (props.stage ? 1 : 0.3)};
  animation: ${props => (!props.stage ? swirls[props.index] : doneSwirls[props.index])} infinite 5s
    linear;

  > .-slice {
    path {
      pointer-events: all;
      cursor: pointer;
    }
  }

  .icon {
    width: 38px;
    position: absolute;
    top: 20px;
    left: 50%;
    z-index: 1;
    transform: translateX(-50%) rotate(${props => -60 * props.index}deg);
    pointer-events: none;

    path {
      fill: rgba(0, 0, 0, 0.5);
    }
  }

  .reward {
    width: 38px;
    font-family: 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial,
      'Lucida Grande', sans-serif;
    position: absolute;
    top: 20px;
    text-align: center;
    font-size: 2.5rem;
    font-weight: 700;
    left: 50%;
    z-index: 1;
    transform: translateX(-50%) rotate(${props => -60 * props.index}deg);
    pointer-events: none;
    color: white;
  }
`

export default ({ index, stage, onClick, color, ...rest }) => (
  <Styles index={index} stage={stage} {...rest}>
    <Slice className="-slice" color={color} onClick={onClick} />
    {!stage ? (
      <QuestionIcon className="icon" />
    ) : (
      <div className="reward">{Wheel.slices[index].reward}</div>
    )}
  </Styles>
)
