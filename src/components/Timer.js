import React from 'react'
import styled from 'styled-components'
import { format } from 'date-fns'
import RAF from 'raf'

const Styles = styled.div`
  font-family: monospace, sans-serif;
  font-size: 1.7rem;
  color: rgb(235, 90, 90);
`

export default class Timer extends React.Component {
  componentDidMount () {
    const update = () => {
      this.forceUpdate()
      if (this.stop) {
        return
      }
      RAF(update)
    }
    RAF(update)
  }
  componentWillUnmount () {
    this.stop = true
  }
  render () {
    const { startTime, time, short, finished, ...rest } = this.props
    const timeLeft = Math.max(time - (Date.now() - startTime), 0)
    return (
      <Styles {...rest}>
        {finished ? (
          <span>Finished in {format(finished - startTime, 'mm:ss:SS')}</span>
        ) : (
          <span>
            <span>{format(timeLeft, short ? 'mm:ss' : 'mm:ss:SS')}</span>
            {short && <span> - {Math.round(timeLeft / time * 100)}% Left</span>}
          </span>
        )}
      </Styles>
    )
  }
}
