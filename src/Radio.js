import React, { Component } from 'react';
import Chat from './Chat';
import Search from './Search';
import PlayControls from './PlayControls';

export default class Radio extends Component {
  render() {
    const { access, device, user } = this.props;
    return (
      <div style={{
        display: 'flex',
      }}>
        <div style={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
        }}>
          <div style={{ flex: 1 }}>
            <Search access={access} device={device} user={user} />
          </div>
          <div>
            <PlayControls access={access} device={device} user={user} />
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <Chat user={user} />
        </div>
      </div>
    );
  }
}
