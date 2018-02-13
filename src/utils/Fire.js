import React from 'react'
//
import Loading from 'components/Loading'

let Fire = {} // eslint-disable-line

export default () => Fire

export class FirebaseProvider extends React.Component {
  state = {
    ready: false,
  }
  componentDidMount () {
    const config = {
      apiKey: 'AIzaSyC2aRouo5yfF6BqjykTU02KaQlIGIp40-o',
      authDomain: 'promised-land-1.firebaseapp.com',
      databaseURL: 'https://promised-land-1.firebaseio.com',
      projectId: 'promised-land-1',
      storageBucket: '',
      messagingSenderId: '950738308197',
    }
    window.firebase.initializeApp(config)
    Fire = window.firebase
    setTimeout(this.ready, 2000)
  }
  ready = () =>
    this.setState({
      ready: true,
    })
  render () {
    if (!this.state.ready) {
      return <Loading />
    }
    return this.props.children
  }
}
