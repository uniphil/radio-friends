import React, { Component } from 'react';
import firebase from './firebase';
import Radio from './Radio';


export default class GetReady extends Component {
  constructor(props) {
    super(props);
    this.state = {
      device: null,
      devices: null,
    };
    this.getDevices();
  }

  getDevices = () => {
    const { access } = this.props;
    return fetch('https://api.spotify.com/v1/me/player/devices', {
      headers: { Authorization: `Bearer ${access}` } })
      .then(r => r.json())
      .then(({ devices }) =>
        this.setState({ devices }));
  };

  handleManualGetDevices = e => {
    e.preventDefault();
    this.setState({ devices: null });
    return this.getDevices();
  }

  setDevice = device =>
    this.setState({ device });

  render() {
    const { access, user } = this.props;
    const { device, devices } = this.state;
    if (devices === null) {
      return (
        <div className="splash">
          <p>loading devices for playback....</p>
        </div>
      );
    }
    if (devices.length === 0) {
      return (
        <div className="splash">
          <div>
            <p>no devices available? try starting the spotify app on the device you want to play music from.</p>
            <p>
              <a className="button" href="#" onClick={this.handleManualGetDevices}>
                Try again
              </a>
            </p>
          </div>
        </div>
      );
    }
    if (device) {
      return <Radio access={access} device={device} user={user} />;
    }
    return (
      <div className="splash">
        <ul>
          {devices.map(d => (
            <li key={d.id}>
              <p>
                {d.name} <em>({d.type})</em>{' '}
                <button className="button" onClick={() => this.setDevice(d)}>use</button>
              </p>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
