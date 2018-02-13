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
                  <div>
                    Oh no! We can't find your room number. Did you enter your URL correctly?
                  </div>
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
