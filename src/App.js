import React, { Component } from 'react';
import choose from './choose';
import firebase from './firebase';
import Hello from './Hello';
import GetReady from './GetReady';

import logo from './logo.svg';
import './App.css';

const SPOTIFY_ID = '6bf00353d7a34fb2b6c500fcc4969604';
const SPOTIFY_AUTH = 'https://accounts.spotify.com/authorize';
const SPOTIFY_SCOPES = [
  'user-modify-playback-state',
  'user-read-currently-playing',
  'user-read-playback-state',
];

const authStates = {
  ANON: () => ({ type: 'ANON' }),
  AUTH_ERR: reason => ({ type: 'AUTH_ERR', reason }),
  AUTH_OK: access => ({ type: 'AUTH_OK', access }),
};

window.firebase = firebase;

class App extends Component {
  constructor(props) {
    super(props);
    let authState;
    const params = new URLSearchParams(window.location.hash.slice(1));
    if ('state' in localStorage && params.has('access_token')) {
      if (params.get('state') === localStorage.getItem('state')) {
        const access = params.get('access_token');
        authState = authStates.AUTH_OK(access);
        firebase.auth().signInAnonymously();
      } else {
        authState = authStates.AUTH_ERR('Bad auth flow: states did not match.');
      }
    } else {
      authState = authStates.ANON();
      const state = window.crypto.getRandomValues(new Int16Array(4)).join('');
      localStorage.setItem('state', state);
    }

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ user });
        const { authState: { access } } = this.state;
        fetch('https://api.spotify.com/v1/me', {
          headers: { Authorization: `Bearer ${access}` },
        })
          .then(r => r.json())
          .then(({
            id,
            display_name: displayName,
            images: [ { url: photoURL } ],
          }) => firebase.auth().currentUser.updateProfile({
            displayName,
            photoURL,
          }));
      }
    });

    this.state = { authState };
  }

  logout = () =>
    this.setState({ authState: authStates.ANON() });

  render() {
    const { authState, user } = this.state;
    return choose(authState, authStates, {
      ANON: () => {
        const params = new URLSearchParams();
        params.set('client_id', SPOTIFY_ID);
        params.set('response_type', 'token');
        params.set('redirect_uri', `${window.location}ok`);
        params.set('state', localStorage.getItem('state'));
        params.set('scope', SPOTIFY_SCOPES.join(' '));
        const authUrl = new URL(`${SPOTIFY_AUTH}?${params}`);
        return (
          <Hello authUrl={authUrl} />
        );
      },
      AUTH_ERR: () => (
        <p>authentication error sadface</p>
      ),
      AUTH_OK: ({ access }) => user
        ? <GetReady access={access} user={user} logout={this.logout} />
        : <p>Signing in...</p>,
    });
  }
}

export default App;
