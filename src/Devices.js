import React, { Component } from 'react';

export default class Devices extends Component {
  constructor(props) {
    super(props);
    this.state = {
      devices: [],
      error: null,
      loading: false,
    };
  }

  componentWillMount() {
    this.getDevices();
  }

  getDevices = () => {
    const { access } = this.props;
    this.setState({ loading: true });
    return fetch('https://api.spotify.com/v1/me/player/devices', {
      headers: { Authorization: `Bearer ${access}` } })
      .then(r => r.json())
      .then(
        ({ devices }) => this.setState({ devices, loading: false }),
        error => this.setState({ error, loading: false }));
  };

  render() {
    const { device, onSelectDevice } = this.props;
    const { devices, loading, error } = this.state;
    return (
      <div className="Devices">
        <h3>Playback device</h3>
        <p>Radio friends plays music by controlling the playback of your Spotify account.</p>
        {error && <p>{error}</p>}
        {loading && <p>loading...</p>}
        {devices.length === 0  && !loading && !error? (
          <div>
            <p>No devices on your Spotify account are active. Please open the Spotify app on the device you want to listen to Radio Friends.</p>
            <p>You can also proceed without choosing a device, and we'll try to activate your last-used device automatically.</p>
            <button
              className="button"
              onClick={this.getDevices}
            >
              Refresh
            </button>
          </div>
        ) : (
          <ul>
            {devices.map(d => (
              <li key={d.id}>
                {device && d.id === device.id && '✓ '}
                {d.name} <em>{d.type}</em>
                <button
                  className="button"
                  onClick={() => onSelectDevice(d)}
                >
                  use
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}
