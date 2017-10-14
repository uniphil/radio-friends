import React, { Component } from 'react';
import Devices from './Devices';
import Radio from './Radio';
import './GetReady.css';


export default class GetReady extends Component {
  constructor(props) {
    super(props);
    this.state = {
      device: null,
      ready: false,
    };
  }

  setDevice = device =>
    this.setState({ device });

  render() {
    const { access, user } = this.props;
    const { device, ready } = this.state;

    if (ready) {
      return <Radio access={access} device={device} user={user} />;
    }

    return (
      <div className="GetReady">
        <div className="GetReady-box GetReady-devices">
          <Devices
            access={access}
            device={device}
            onSelectDevice={this.setDevice}
          />
        </div>
        <div className="GetReady-box GetReady-ready">
          <button
            className="button"
            onClick={() => this.setState({ ready: true })}
          >
            Ready
          </button>
        </div>
      </div>
    );
  }
}
