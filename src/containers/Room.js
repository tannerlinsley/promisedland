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
import Unlocker from 'components/Unlocker'
import Congrats from 'components/Congrats'

const Styles = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const getRoomInitialState = () => ({
  startTime: null,
  wheel: [0, 0, 0, 0, 0, 0],
  messages: [
    {
      ts: Date.now(),
      from: 'Revelation',
      body: 'What can I help you with?',
    },
  ],
  unlocked: false,
  showCongrats: false,
})

class Home extends Component {
  state = {
    ready: false,
    readyLoading: false,
    guessingIndex: 0,
    guessingValue: '',
    guessingError: '',
    room: getRoomInitialState(),
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
            ...getRoomInitialState(),
            ...snapshot.val(),
          }
          : getRoomInitialState(),
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
  unlockRoom = () => {
    this.setRoomState(state => {
      state.unlocked = Date.now()
    })
    setTimeout(
      () =>
        this.setRoomState(state => {
          state.showCongrats = true
        }),
      300
    )
  }
  closeUnlocker = () => {
    this.setState({
      unlocking: false,
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

    const { wheel, unlocked, showCongrats, startTime, messages } = room
    const canUnlock = wheel.length === 6 && wheel.every(d => d === 2)

    return (
      <Styles>
        <Loading show={!ready || !readyLoading} />
        <LogoSlim />
        <Timer time={1000 * 60 * 40} startTime={startTime} />
        <WheelBackground
          wheel={wheel}
          onSliceClick={(piece, i) => {
            if (!wheel[i] || wheel[i] < 2) {
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
            if (!canUnlock) {
              return
            }
            this.setState({
              unlocking: true,
            })
          }}
        />
        <AskInFaith
          onClick={() =>
            this.setState({
              chatting: true,
            })}
        />
        <Congrats show={showCongrats} />
        <Unlocker
          show={!unlocked && unlocking}
          close={this.closeUnlocker}
          unlockRoom={this.unlockRoom}
        />
        <Guesser
          show={!unlocked && guessing}
          guessingIndex={guessingIndex}
          wheel={wheel}
          guessingValue={guessingValue}
          guessingError={guessingError}
          setRoomState={this.setRoomState}
          close={this.closeGuess}
          approveGuess={this.approveGuess}
          denyGuess={this.denyGuess}
          setGuessingValue={this.setGuessingValue}
        />
        <Chat
          show={!unlocked && chatting}
          messages={messages}
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
