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
    const timeLeft = Math.max(this.props.time - (Date.now() - this.props.startTime), 0)
    return <Styles>{format(timeLeft, 'mm:ss:SS')}</Styles>
  }
}
