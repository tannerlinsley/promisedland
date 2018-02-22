import React, { Component } from 'react'
// import Fire from 'utils/Fire'

class Home extends Component {
  state = {
    authed: false,
    password: '',
  }
  componentDidMount () {
    this.setState({
      authed: window.localStorage.authed,
    })
  }
  render () {
    const { password, authed } = this.state
    if (authed) {
      return <div>Welcome to the admin interface!</div>
    }
    return (
      <form
        onSubmit={e => {
          e.preventDefault()
          if (password === '8019402259') {
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
