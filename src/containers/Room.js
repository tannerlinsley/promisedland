import React, { Component } from 'react'
import immer from 'immer'
//
import Fire from 'utils/Fire'
import Wheel from 'utils/Wheel'
import Loading from 'components/Loading'

const initialState = {
  wheel: [],
}

class Home extends Component {
  state = {
    ready: false,
    guessingIndex: -1,
    guessingValue: '',
    guessingError: '',
    server: initialState,
  }
  async componentDidMount () {
    // Reference the room db
    this.db = Fire()
      .database()
      .ref(`rooms/${this.props.roomID}`)

    // Subscribe
    this.db.on('value', snapshot => {
      // Update the local state
      this.setState({
        ready: true,
        server: snapshot.val() || initialState,
      })
    })
  }
  setRoomState = fn => {
    this.db.set(immer(this.state.server, fn))
  }
  render () {
    const { ready, server, guessingIndex, guessingValue, guessingError } = this.state
    return !ready ? (
      <Loading />
    ) : (
      <div>
        <h1>Promised Land Control Center</h1>
        <br />
        {guessingIndex > -1 ? (
          <div>
            <button
              type="button"
              onClick={() =>
                this.setState({
                  guessingIndex: -1,
                })}
            >
              Go back
            </button>
            <br />
            <br />
            <div>Guessing Piece {guessingIndex}:</div>
            <form
              onSubmit={e => {
                e.preventDefault()
                if (
                  guessingValue
                    .split('')
                    .map(d => d.toLowerCase())
                    .join('') === Wheel.all[guessingIndex].secret
                ) {
                  this.setRoomState(state => {
                    state.wheel[guessingIndex] = true
                  })
                  this.setState({
                    guessingIndex: -1,
                  })
                } else {
                  this.setState({
                    guessingError: 'Nope! Try again!',
                  })
                }
              }}
            >
              <input
                type="text"
                value={guessingValue}
                onChange={e =>
                  this.setState({
                    guessingValue: e.target.value,
                  })}
              />
              <button type="submit">Guess</button>
              <br />
              <br />
              {guessingError ? `${guessingError}` : ''}
            </form>
          </div>
        ) : (
          <div>
            {Wheel.all.map((piece, i) => (
              <div key={piece.answer}>
                Piece {i + 1} :{' '}
                {server.wheel[i] ? (
                  piece.answer
                ) : (
                  <button
                    onClick={() =>
                      this.setState({
                        guessingIndex: i,
                        guessingValue: '',
                        guessingError: '',
                      })}
                  >
                    Guess
                  </button>
                )}
                <br />
                <br />
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
}

export default Home
