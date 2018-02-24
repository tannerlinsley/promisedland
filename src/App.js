import { hot } from 'react-hot-loader'
import React, { Component } from 'react'
import reset from 'styled-reset'
import { injectGlobal } from 'styled-components'
import { Router, Route, Switch } from 'react-static'

//
import Rooms from 'utils/Rooms'
import { FirebaseProvider } from 'utils/Fire'

import Admin from 'containers/Admin'
import Room from 'containers/Room'

injectGlobal`
  ${reset};

  html, body {
    font-family: 'Montserrat', sans-serif;
    background: radial-gradient(rgb(221, 226, 230) 70%, rgb(162, 179, 184)), #f2f2f2;
    font-size: 16px;
    min-height: 100vh;
  }

  body {
    overflow-x: hidden;
  }

  * {
    font-family: 'Montserrat', sans-serif;
    outline: none;
    -webkit-tap-highlight-color: transparent;
  }
`

class App extends Component {
  render () {
    return (
      <Router>
        <FirebaseProvider>
          <Switch>
            <Route path="/admin" component={Admin} />
            {Rooms.all.map(room => (
              <Route key={room} path={`/${room}`} render={() => <Room roomID={room} />} />
            ))}
            <Route
              render={() => (
                <div>
                  <div>Oh no! Make sure you entered the URL exactly as you see it!</div>
                </div>
              )}
            />
          </Switch>
        </FirebaseProvider>
      </Router>
    )
  }
}

export default hot(module)(App)
