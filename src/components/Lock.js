import React from 'react'
import styled, { css, keyframes } from 'styled-components'

export const SVG = props => (
  <svg viewBox="0 0 110 153" version="1.1" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g transform="matrix(1,0,0,1,-607.666,-1177.25)">
      <g transform="matrix(4.16667,0,0,4.16667,0,0)">
        <path d="M150.197,294.96L150.197,291.226C150.197,286.448 154.106,282.54 158.883,282.54C163.66,282.54 167.569,286.448 167.569,291.226L167.569,294.96L164.187,294.96L164.187,291.226C164.187,288.301 161.807,285.922 158.883,285.922C155.959,285.922 153.579,288.301 153.579,291.226L153.579,294.96L150.197,294.96ZM160.451,306.688L160.451,309.921C160.451,310.751 159.772,311.43 158.942,311.43C158.112,311.43 157.432,310.751 157.432,309.921L157.432,306.688C156.782,306.218 156.358,305.457 156.358,304.594C156.358,303.168 157.515,302.011 158.942,302.011C160.368,302.011 161.525,303.168 161.525,304.594C161.525,305.457 161.101,306.218 160.451,306.688M167.65,295.792L150.118,295.792C147.755,295.792 145.84,297.707 145.84,300.07L145.84,305.929C145.84,313.185 151.721,319.067 158.978,319.067C166.194,319.067 172.044,313.217 172.044,306.001L172.044,300.186C172.044,297.759 170.077,295.792 167.65,295.792" />
      </g>
    </g>
  </svg>
)

const bounce = keyframes`
  0%, 100% {
    transform: translate(-50%, -50%) scale(0.95);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.05);
  }
`

const Styles = styled.div`
  width: 40px;
  position: absolute;
  padding: 0.5rem 1rem;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  ${props => props.canUnlock && css`animation: ${bounce} 1s infinite linear;`};

  path {
    fill: ${props => (props.canUnlock ? 'rgb(94, 191, 150)' : 'rgba(0, 0, 0, 0.2)')};
    transition: all 0.3s ease-out;
  }
`

export default props => (
  <Styles {...props}>
    <SVG />
  </Styles>
)
