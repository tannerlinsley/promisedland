import React, { Component } from 'react'
import styled from 'styled-components'
import immer from 'immer'
//
import Fire from 'utils/Fire'
import LocalStorage from 'utils/LocalStorage'

import Loading from 'components/Loading'
import LogoSlim from 'components/LogoSlim'
import WheelBackground from 'components/WheelBackground'
import Guesser from 'components/Guesser'
import Chat from 'components/Chat'
import AskInFaith from 'components/AskInFaith'
import Timer from 'components/Timer'

const Styles = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  .askinfaith {
    position: absolute;
    left: 0;
    bottom: 2rem;
  }
`

const roomInitialState = {
  startTime: Date.now(),
  wheel: [],
  messages: [
    {
      ts: Date.now(),
      from: 'Revelation',
      body: 'What can I help you with?',
    },
  ],
}

class Home extends Component {
  state = {
    ready: false,
    readyLoading: false,
    guessingIndex: 0,
    guessingValue: '',
    guessingError: '',
    room: roomInitialState,
    username: LocalStorage.get('username') || '',
    usernameInput: '',
    chatting: false,
    chatInput: '',
    unlocking: false,
  }
  async componentDidMount () {
    // Reference the room db
    this.db = Fire()
      .database()
      .ref(`rooms/${this.props.roomID}`)

    setTimeout(
      () =>
        this.setState({
          readyLoading: true,
        }),
      3000
    )

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
  closeGuess = () => {
    this.setState({
      guessing: false,
    })
  }
  closeChat = () => {
    this.setState({
      chatting: false,
    })
  }
  approveGuess = num => {
    this.setRoomState(state => {
      state.wheel[this.state.guessingIndex] = num
    })
  }
  denyGuess = () => {
    if (this.errorTimer) {
      clearTimeout(this.errorTimer)
    }
    this.setState({
      guessingError: 'Try again!',
    })
    this.errorTimer = setTimeout(() => {
      this.setState({
        guessingError: '',
      })
      this.errorTimer = false
    }, 2000)
  }
  sendMessage = message => {
    this.setRoomState(state => {
      state.messages.push(message)
    })
  }
  setChatInput = chatInput => {
    this.setState({
      chatInput,
    })
  }
  setGuessingValue = guessingValue => {
    this.setState({
      guessingValue,
    })
  }
  setRoomState = fn => {
    this.db.set(immer(this.state.room, fn))
  }
  setUsername = username => {
    this.setState({
      username: LocalStorage.set('username', username),
    })
  }
  setUsernameInput = usernameInput => {
    this.setState({
      usernameInput,
    })
  }
  render () {
    const {
      ready,
      readyLoading,
      room,
      guessing,
      guessingIndex,
      guessingValue,
      guessingError,
      chatting,
      chatInput,
      username,
      usernameInput,
      unlocking,
    } = this.state

    const canUnlock = false && room.wheel.length && room.wheel.every(d => d === 2)

    return (
      <Styles>
        <Loading show={!ready || !readyLoading} />
        <LogoSlim />
        <Timer time={1000 * 60 * 40} startTime={room.startTime} />
        <WheelBackground
          wheel={room.wheel}
          onSliceClick={(piece, i) => {
            if (!room.wheel[i] || room.wheel[i] < 2) {
              this.setState({
                guessing: true,
                guessingIndex: i,
                guessingValue: '',
                guessingError: '',
              })
            }
          }}
          canUnlock={canUnlock}
          onLockClick={() => {
            // if (!canUnlock) {
            //   return
            // }
            this.setState({
              unlocking: true,
            })
          }}
        />
        <AskInFaith
          className="askinfaith"
          onClick={() =>
            this.setState({
              chatting: true,
            })}
        />
        {/* <Unlocker show={unlocking} /> */}
        <Guesser
          show={guessing}
          guessingIndex={guessingIndex}
          room={room}
          guessingValue={guessingValue}
          guessingError={guessingError}
          setRoomState={this.setRoomState}
          close={this.closeGuess}
          approveGuess={this.approveGuess}
          denyGuess={this.denyGuess}
          setGuessingValue={this.setGuessingValue}
        />
        <Chat
          show={chatting}
          messages={room.messages}
          chatInput={chatInput}
          username={username}
          usernameInput={usernameInput}
          close={this.closeChat}
          setChatInput={this.setChatInput}
          setUsernameInput={this.setUsernameInput}
          setUsername={this.setUsername}
          sendMessage={this.sendMessage}
        />
      </Styles>
    )
  }
}

export default Home
