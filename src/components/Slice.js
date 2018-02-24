import React from 'react'
import styled from 'styled-components'

const Styles = styled.svg`
  path {
    fill: ${props => props.color};
  }
`

export default function Slice ({ onClick, ...rest }) {
  return (
    <Styles
      viewBox="0 0 370 273"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
      {...rest}
    >
      <g transform="matrix(1,0,0,1,-1463.1,-208.704)">
        <g transform="matrix(4.16667,0,0,4.16667,0,0)">
          <path
            onClick={onClick}
            d="M409.456,115.047L439.721,60.692C426.475,53.749 411.691,50.089 396.814,50.089C380.807,50.089 365.069,54.231 351.143,62.087L383.112,115.447C387.228,113.458 391.846,112.342 396.724,112.342C401.259,112.342 405.565,113.313 409.456,115.047"
          />
        </g>
      </g>
    </Styles>
  )
}
