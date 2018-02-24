import React from 'react'
import styled, { keyframes } from 'styled-components'

import Slice from 'components/Slice'
import PowerIcon from 'components/PowerIcon'

const offOpacity = 0.3

const swirls = [1, 2, 3, 4, 5, 6].map(
  d => keyframes`
  ${(0 + 2 * d) % 100}%, ${(10 + 2 * d) % 100}% {
    opacity: ${offOpacity}
  }
  ${(5 + 2 * d) % 100}% {
    opacity: 0.6
  }
  ${(13 + 2 * d) % 100}%, ${(23 + 2 * d) % 100}% {
    opacity: ${offOpacity}
  }
  ${(18 + 2 * d) % 100}% {
    opacity: 0.6
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
  opacity: ${props => (props.stage === 2 ? 1 : offOpacity)};
  animation: ${props => (props.stage !== 2 ? swirls[props.index] : 'none')} infinite 5s linear;

  > .-slice {
    width: 150px;
    height: 100px;
  }

  path {
    pointer-events: all;
    cursor: pointer;
  }

  .power {
    width: 38px;
    position: absolute;
    top: 20px;
    left: 50%;
    z-index: 1;
    transform: translateX(-50%) rotate(${props => -60 * props.index}deg);
    pointer-events: none;

    path {
      fill: ${props => (props.stage === 2 ? 'white' : 'rgba(0,0,0,.5)')};
    }
  }
`

export default ({ onClick, color, ...rest }) => (
  <Styles {...rest}>
    <Slice class="-slice" color={color} onClick={onClick} />
    <PowerIcon className="power" />
  </Styles>
)
