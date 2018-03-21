import React from 'react'
import styled from 'styled-components'

import Wheel from 'utils/Wheel'

import Lock from 'components/Lock'

import WheelSlice from './WheelSlice'

const Styles = styled.div`
  position: relative;
  width: 275px;
  height: 275px;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  margin: 1rem auto;
  display: block;
  border-radius: 1000px;
  overflow: hidden;
`

export default ({ wheel, onSliceClick, onLockClick, canUnlock, ...rest }) => (
  <Styles {...rest}>
    {Wheel.slices.map((piece, i) => (
      <WheelSlice
        className="slice"
        key={piece.secret}
        rotation={360 / Wheel.slices.length * i}
        color={piece.color}
        onClick={() => onSliceClick(piece, i)}
        stage={wheel[i]}
        index={i}
      />
    ))}
    <Lock canUnlock={canUnlock} onClick={onLockClick} />
  </Styles>
)
