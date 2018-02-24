import React from 'react'
import styled from 'styled-components'
import ReactShow from 'react-show'
//

const Styles = styled.div`
  height: 100%;
  width: 100%;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  .back {
    background: rgb(57, 57, 57);
    color: white;
    appearance: none;
    align-self: stretch;
    padding: 1rem;
    font-size: 1.2rem;
    border: 0;
    flex: 0 0 auto;
  }

  > div {
    flex: 1 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;

    .chat {
      flex: 1 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;

      .messages {
        flex: 1 0 auto;
        border: 2px solid rgba(0, 0, 0, 0.1);
        border-radius: 0.5rem;
        padding: 1rem;
        text-align: left;
        margin: 0.5rem 0.5rem 0;
        align-self: stretch;
        font-size: 1.2rem;
        line-height: 1.3;
        position: relative;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;

        > div {
          position: absolute;
        }
      }

      .message {
        margin: 0 0 1rem;

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
        border-radius: 0.5rem;
        font-size: 1.2rem;
        padding: 1rem;
        text-align: left;
        margin: 0.5rem 0.5rem 0;
        align-self: stretch;
        outline: none;
        transition: all 0.2s ease-out;

        :focus {
          border: 2px solid rgba(0, 0, 0, 0.2);
        }
      }

      button {
        appearance: none;
        background: ${props => (props.hasChat ? 'rgb(23, 194, 121)' : 'rgb(191, 191, 191)')};
        color: white;
        font-size: 1.5rem;
        border: 0;
        padding: 1rem 0.5rem;
        margin: 0.5rem;
        align-self: stretch;
        border-radius: 0.5rem;
        transition: all 0.2s ease-out;
        outline: 0;

        :active {
          background: rgb(0, 145, 83);
        }
      }
    }

    .signup {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;

      p {
        font-size: 1.8rem;
        margin-bottom: 1rem;
      }

      input {
        appearance: none;
        border: 2px solid rgba(0, 0, 0, 0.1);
        border-radius: 0.5rem;
        font-size: 2rem;
        padding: 0.5rem;
        text-align: center;
        margin: 0.5rem;
        align-self: stretch;
        outline: none;
        transition: all 0.2s ease-out;

        :focus {
          border: 2px solid rgba(0, 0, 0, 0.2);
        }
      }

      button {
        appearance: none;
        background: ${props => (props.hasUsername ? 'rgb(23, 194, 121)' : 'rgb(191, 191, 191)')};
        color: white;
        font-size: 1.5rem;
        border: 0;
        padding: 1rem 0.5rem;
        margin: 0.5rem;
        align-self: stretch;
        border-radius: 0.5rem;
        transition: all 0.2s ease-out;
        outline: 0;

        :active {
          background: rgb(0, 145, 83);
        }
      }
    }
  }
`

export default class Chat extends React.Component {
  componentWillUpdate (nextProps) {
    if (
      this.messagesRef &&
      this.props.messages.length !== nextProps.messages.length &&
      this.messagesRef.scrollTop - 15 <=
        this.messagesRef.scrollHeight - this.messagesRef.offsetHeight
    ) {
      this.shouldScroll = true
    }
  }
  componentDidUpdate (prevProps) {
    if (
      this.messagesRef &&
      this.props.messages.length !== prevProps.messages.length &&
      this.shouldScroll
    ) {
      this.shouldScroll = false
      this.messagesRef.scrollTop = 99999
    }
  }
  render () {
    const {
      close,
      show,
      username,
      chatInput,
      usernameInput,
      messages,
      setChatInput,
      setUsernameInput,
      setUsername,
      sendMessage,
    } = this.props
    return (
      <ReactShow
        show={show}
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }}
        styleShow={{
          transform: 'translateY(0)',
        }}
        styleHide={{
          transform: 'translateY(-100%)',
        }}
      >
        <Styles hasUsername={usernameInput} hasChat={chatInput}>
          <button type="button" className="back" onClick={close}>
            Cancel
          </button>
          <div>
            {username ? (
              <div className="chat">
                <div
                  className="messages"
                  ref={el => {
                    this.messagesRef = el
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
                    if (chatInput) {
                      sendMessage({
                        from: username,
                        ts: Date.now(),
                        body: chatInput,
                      })
                      setChatInput('')
                    }
                  }}
                >
                  <input
                    type="text"
                    placeholder="Your message..."
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                  />
                  <button type="submit">Send</button>
                </form>
              </div>
            ) : (
              <form
                className="signup"
                onSubmit={e => {
                  e.preventDefault()
                  if (usernameInput) {
                    setUsername(usernameInput)
                  }
                }}
              >
                <p>What is your name?</p>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={e => setUsernameInput(e.target.value)}
                />
                <button type="submit">Continue</button>
              </form>
            )}
          </div>
        </Styles>
      </ReactShow>
    )
  }
}
