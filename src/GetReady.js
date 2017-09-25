import React, { Component } from 'react';
import firebase from './firebase';
import Radio from './Radio';


export default class GetReady extends Component {
  constructor({ access, logout, user }) {
    super();
    this.state = {
      device: null,
      devices: null,
      access,
      user,
    };
    fetch('https://api.spotify.com/v1/me/player/devices', {
      headers: { Authorization: `Bearer ${access}` } })
      .then(r => r.json())
      .then(({ devices }) =>
        this.setState({ devices }));
  }

  setDevice = device =>
    this.setState({ device });

  render() {
    const { access, device, devices, user } = this.state;
    if (devices === null) {
      return <p>loading devices for playback....</p>;
    }
    if (devices.length === 0) {
      return <p>no devices available? try starting the spotify app on the device you want to play music from.</p>;
    }
    if (device) {
      return <Radio access={access} device={device} user={user} />;
    }
    return (
      <ul>
        {devices.map(d => (
          <li key={d.id}>
            <p>{d.name} <em>({d.type})</em> <button onClick={() => this.setDevice(d)}>use</button></p>
          </li>
        ))}
      </ul>
    );
  }
}
