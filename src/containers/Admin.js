import React, { Component } from 'react'
import immer from 'immer'
import styled from 'styled-components'
//
import Fire from 'utils/Fire'
import Rooms from 'utils/Rooms'
import Wheel from 'utils/Wheel'

import Timer from 'components/Timer'

import { getRoomInitialState } from 'containers/Room'

const initialState = {}
Rooms.all.forEach(room => {
  initialState[room] = getRoomInitialState()
})

const RoomsStyles = styled.div`
  margin: 0.5rem;
  display: flex;
  flex-wrap: wrap;

  .room {
    flex: 1 0 200px;
    background: white;
    margin: 0.5rem;
    padding: 0.5rem;

    .green,
    .red {
      font-size: 0.9rem;
      display: inline-block;
      margin: 2px;
      padding: 2px 5px;
      border-radius: 2px;
      color: white;
      font-weight: bolder;
    }

    .green {
      background-color: rgb(0, 147, 125);
    }

    .red {
      background-color: rgb(198, 194, 194);
    }

    h1 {
      font-size: 1.5rem;
      margin: 0.5rem 0;
    }

    h2 {
      font-size: 1.2rem;
      margin: 0.5rem 0;
    }

    .progress {
      margin: 1rem 0;
    }

    .timer {
      font-size: 1.2rem;
    }

    .chat {
      flex: 1 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;

      .messages {
        flex: 1 0 200px;
        border: 2px solid rgba(0, 0, 0, 0.1);
        border-bottom: 0;
        border-radius: 0.5rem 0.5rem 0 0;
        padding: 0.5rem;
        text-align: left;
        margin: 0.5rem 0 0;
        align-self: stretch;
        font-size: 0.8rem;
        line-height: 1.3;
        position: relative;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;

        > div {
          position: absolute;
        }
      }

      .message {
        margin: 0 0 0.5rem;

        .from {
          color: rgb(0, 127, 167);
          font-weight: bolder;
          margin-bottom: 0.2rem;
        }
        .message-body {
          border-left: 3px solid rgba(0, 0, 0, 0.05);
          margin-left: 0.2rem;
          padding-left: 0.5rem;
          color: rgba(0, 0, 0, 0.8);
        }
      }

      form {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
      }

      input {
        appearance: none;
        border: 2px solid rgba(0, 0, 0, 0.1);
        border-bottom: 0;
        border-radius: 0;
        font-size: 0.8rem;
        padding: 0.5rem;
        text-align: left;
        margin: 0;
        align-self: stretch;
        outline: none;
        transition: all 0.2s ease-out;

        :focus {
          border: 2px solid rgba(0, 0, 0, 0.2);
          border-bottom: 0;
        }
      }

      button {
        appearance: none;
        background: ${props => (props.hasChat ? 'rgb(23, 194, 121)' : 'rgb(191, 191, 191)')};
        color: white;
        font-size: 0.8rem;
        border: 0;
        padding: 0.3rem 0.2rem;
        margin: 0;
        align-self: stretch;
        border-radius: 0 0 0.5rem 0.5rem;
        transition: all 0.2s ease-out;
        outline: 0;

        :active {
          background: rgb(0, 145, 83);
        }
      }
    }
  }
`

class Home extends Component {
  state = {
    authed: false,
    password: '',
    ready: false,
    rooms: {},
    chatInput: {},
    timerChange: {},
    startChange: {},
  }
  async componentDidMount () {
    this.setState({
      authed: window.localStorage.authed,
    })

    this.db = {}

    Rooms.all.forEach(roomName => {
      this.db[roomName] = Fire()
        .database()
        .ref(`rooms/${roomName}`)

      setTimeout(
        () =>
          this.setState({
            ready: true,
          }),
        3000
      )

      // Subscribe
      this.db[roomName].on('value', snapshot => {
        // Update the local state
        this.setState({
          [roomName]: snapshot.val()
            ? {
              ...getRoomInitialState(),
              ...snapshot.val(),
            }
            : getRoomInitialState(),
        })
      })
    })
  }
  componentWillUpdate (nextProps, nextState) {
    Rooms.all.forEach(roomName => {
      if (
        this.messagesRefs &&
        this.messagesRefs[roomName] &&
        this.state[roomName].messages.length !== nextState[roomName].messages.length &&
        this.messagesRefs[roomName].scrollTop - 15 <=
          this.messagesRefs[roomName].scrollHeight - this.messagesRefs[roomName].offsetHeight
      ) {
        this.messagesRefs[roomName].shouldScroll = true
      }
    })
  }
  componentDidUpdate (prevProps, prevState) {
    Rooms.all.forEach(roomName => {
      if (
        this.messagesRefs &&
        this.messagesRefs[roomName] &&
        this.state[roomName].messages.length !== prevState[roomName].messages.length &&
        this.messagesRefs[roomName].shouldScroll
      ) {
        this.messagesRefs[roomName].shouldScroll = false
        this.messagesRefs[roomName].scrollTop = 99999
      }
    })
  }
  addTimeToRoom = (roomName, amount) => {
    if (!window.confirm('Are you sure?')) {
      return
    }
    if (!amount) {
      return
    }
    this.setRoomState(roomName, state => {
      state.goalTime += 1000 * 60 * Number(amount)
    })
  }
  addTimeToStartTime = (roomName, amount) => {
    if (!window.confirm('Are you sure?')) {
      return
    }
    if (!amount) {
      return
    }
    this.setRoomState(roomName, state => {
      state.startTime += 1000 * 60 * Number(amount)
    })
  }
  setRoomState = (roomName, fn) => {
    this.db[roomName].set(immer(this.state[roomName], fn))
  }
  setEachRoomState = fn => {
    Rooms.all.forEach(roomName => {
      this.setRoomState(roomName, fn)
    })
  }
  resetAllRooms = () => {
    this.setEachRoomState(state => {
      const newState = getRoomInitialState()
      Object.keys(newState).forEach(key => {
        state[key] = newState[key]
      })
    })
  }
  setChatInput = (roomName, val) => {
    this.setState({
      chatInput: {
        ...this.state.chatInput,
        [roomName]: val,
      },
    })
  }
  setTimerChangeInput = (roomName, val) => {
    this.setState({
      timerChange: {
        ...this.state.timerChange,
        [roomName]: val,
      },
    })
  }
  setStartChangeInput = (roomName, val) => {
    this.setState({
      startChange: {
        ...this.state.startChange,
        [roomName]: val,
      },
    })
  }
  sendMessage = (roomName, message) => {
    this.setRoomState(roomName, state => {
      state.messages.push(message)
    })
  }
  startRoom = roomName => {
    this.setRoomState(roomName, state => {
      state.startTime = Date.now()
    })
  }
  resetRoom = roomName => {
    if (!window.confirm('Are you sure?')) {
      return
    }

    this.setRoomState(roomName, state => {
      const newState = getRoomInitialState()
      Object.keys(newState).forEach(key => {
        state[key] = newState[key]
      })
    })
  }
  render () {
    const { password, authed, ready, chatInput, timerChange, startChange } = this.state

    if (authed) {
      if (ready) {
        return (
          <div>
            <button
              onClick={() => {
                if (confirm('Are you sure?')) {
                  this.resetAllRooms()
                }
              }}
            >
              Reset All Rooms
            </button>
            <RoomsStyles>
              {Rooms.all.map(roomName => {
                const room = this.state[roomName]
                const { messages, startTime, goalTime, unlocked } = room
                return (
                  <div key={roomName} className="room">
                    <h1>{roomName}</h1>
                    {!startTime ? (
                      <button onClick={() => this.startRoom(roomName)}>Start Room</button>
                    ) : (
                      <div>
                        {unlocked ? (
                          <div className="green">Unlocked</div>
                        ) : (
                          <div className="red">Locked</div>
                        )}
                        <div className="progress">
                          {room.wheel.map((val, i) => (
                            <span key={i} className={val ? 'green' : 'red'}>
                              {Wheel.slices[i].label}{' '}
                            </span>
                          ))}
                        </div>
                        <Timer
                          className="timer"
                          time={goalTime}
                          startTime={startTime}
                          short
                          finished={unlocked}
                        />
                        <br />
                        <form
                          onSubmit={e => {
                            e.preventDefault()
                            this.addTimeToRoom(roomName, timerChange[roomName])
                          }}
                        >
                          <input
                            type="number"
                            style={{ width: '60px' }}
                            value={timerChange[roomName]}
                            placeholder="Minutes"
                            onChange={e => this.setTimerChangeInput(roomName, e.target.value)}
                          />
                          <button type="submit">Add Minutes</button>
                        </form>
                        <form
                          onSubmit={e => {
                            e.preventDefault()
                            this.addTimeToStartTime(roomName, startChange[roomName])
                          }}
                        >
                          <input
                            type="number"
                            style={{ width: '60px' }}
                            value={startChange[roomName]}
                            placeholder="Minutes"
                            onChange={e => this.setStartChangeInput(roomName, e.target.value)}
                          />
                          <button type="submit">Adjust Start Time</button>
                        </form>
                        <br />
                        <button type="button" onClick={() => this.resetRoom(roomName)}>
                          Reset Room
                        </button>
                        <div className="chat">
                          <div
                            className="messages"
                            ref={el => {
                              this.messagesRefs = this.messagesRefs || {}
                              this.messagesRefs[roomName] = el
                            }}
                          >
                            <div className="inner">
                              {messages.map(message => (
                                <div key={message.ts} className="message">
                                  <div className="from">{message.from}</div>
                                  <div className="message-body">{message.body}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <form
                            onSubmit={e => {
                              e.preventDefault()
                              if (chatInput[roomName]) {
                                this.sendMessage(roomName, {
                                  from: 'Revelation',
                                  ts: Date.now(),
                                  body: chatInput[roomName],
                                })
                                this.setChatInput(roomName, '')
                              }
                            }}
                          >
                            <input
                              type="text"
                              placeholder="Your message..."
                              value={chatInput[roomName]}
                              onChange={e => this.setChatInput(roomName, e.target.value)}
                            />
                            <button type="submit">Send</button>
                          </form>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </RoomsStyles>
          </div>
        )
      }
      return <div>Loading...</div>
    }
    return (
      <form
        onSubmit={e => {
          e.preventDefault()
          if (password === 'supersecret') {
            window.localStorage.authed = true
            this.setState({
              authed: true,
            })
          }
        }}
      >
        <input
          type="text"
          value={password}
          onChange={e => this.setState({ password: e.target.value })}
        />
        <button type="submit">Login</button>
      </form>
    )
  }
}

export default Home
