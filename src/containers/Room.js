import React, { Component } from 'react'
import immer from 'immer'
//
import Fire from 'utils/Fire'
import Wheel from 'utils/Wheel'
import LocalStorage from 'utils/LocalStorage'
import Loading from 'components/Loading'

const roomInitialState = {
  wheel: [],
  messages: [],
}

class Home extends Component {
  state = {
    ready: false,
    guessingIndex: -1,
    guessingValue: '',
    guessingError: '',
    room: roomInitialState,
    username: LocalStorage.get('username') || '',
    usernameInput: '',
    chatting: false,
    chatInput: '',
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
        room: snapshot.val()
          ? {
            ...roomInitialState,
            ...snapshot.val(),
          }
          : roomInitialState,
      })
    })
  }
  setRoomState = fn => {
    this.db.set(immer(this.state.room, fn))
  }
  render () {
    const {
      ready,
      room,
      guessingIndex,
      guessingValue,
      guessingError,
      chatting,
      chatInput,
      username,
      usernameInput,
    } = this.state
    return !ready ? (
      <Loading />
    ) : (
      <div>
        <h1>Promised Land Control Center</h1>
        <br />
        <div>
          {Wheel.slices.map((piece, i) => (
            <div key={piece.secret}>
              Piece {i + 1} :{' '}
              <button
                onClick={() => {
                  if (!room.wheel[i] || room.wheel[i] < 2) {
                    this.setState({
                      guessingIndex: i,
                      guessingValue: '',
                      guessingError: '',
                    })
                  }
                }}
              >
                Guess
              </button>{' '}
              {room.wheel[i]}
              <br />
              <br />
            </div>
          ))}
        </div>
        {guessingIndex > -1 && (
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
            {!room.wheel[guessingIndex] ? (
              <form
                onSubmit={e => {
                  e.preventDefault()
                  if (
                    guessingValue
                      .split('')
                      .map(d => d.toLowerCase())
                      .join('') === Wheel.slices[guessingIndex].secret
                  ) {
                    this.setRoomState(state => {
                      state.wheel[guessingIndex] = 1
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
            ) : (
              <form
                onSubmit={e => {
                  e.preventDefault()
                  if (
                    guessingValue
                      .split('')
                      .map(d => d.toLowerCase())
                      .join('') === Wheel.slices[guessingIndex].answer
                  ) {
                    this.setRoomState(state => {
                      state.wheel[guessingIndex] = 2
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
                <p>{Wheel.slices[guessingIndex].question}</p>
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
            )}
            <br />
            <br />
          </div>
        )}
        <button
          onClick={() =>
            this.setState({
              chatting: !chatting,
            })}
        >
          {chatting ? 'Hide' : 'Show'} Chat
        </button>
        {chatting && (
          <div>
            {username ? (
              <div>
                Chat!
                <div>
                  {room.messages.map(message => (
                    <div key={message.ts}>
                      {message.from}: {message.body}
                    </div>
                  ))}
                </div>
                <div>
                  <form
                    onSubmit={e => {
                      e.preventDefault()
                      if (chatInput) {
                        this.setRoomState(state => {
                          state.messages.push({
                            from: username,
                            ts: Date.now(),
                            body: chatInput,
                          })
                        })
                        this.setState({
                          chatInput: '',
                        })
                      }
                    }}
                  >
                    <input
                      type="text"
                      value={chatInput}
                      onChange={e =>
                        this.setState({
                          chatInput: e.target.value,
                        })}
                    />
                    <button type="submit">Send</button>
                  </form>
                </div>
              </div>
            ) : (
              <form
                onSubmit={e => {
                  e.preventDefault()
                  if (usernameInput) {
                    this.setState({
                      username: LocalStorage.set('username', usernameInput),
                    })
                  }
                }}
              >
                What is your name?
                <input
                  type="text"
                  value={usernameInput}
                  onChange={e =>
                    this.setState({
                      usernameInput: e.target.value,
                    })}
                />
                <button type="submit">Start Chatting</button>
              </form>
            )}
          </div>
        )}
      </div>
    )
  }
}

export default Home
