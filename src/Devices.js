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
        <h3>Devices</h3>
        {error && <p>{error}</p>}
        {loading && <p>loading...</p>}
        {devices.length === 0 ? (
          <p>no active devices</p>
        ) : (
          <ul>
            {devices.map(d => (
              <li key={d.id}>
                {d.id === device.id && '✓ '}
                {d.name} <em>{d.type}</em>
                <button onClick={() => onSelectDevice(d)}>use</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}
