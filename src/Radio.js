import React, { Component } from 'react';
import Chat from './Chat';
import Search from './Search';
import PlayControls from './PlayControls';
import './Radio.css';

export default class Radio extends Component {
  render() {
    const { access, device, user } = this.props;
    return (
      <div className="Radio">
        <div className="Radio-music-side">
          <div className="Radio-search">
            <Search access={access} device={device} user={user} />
          </div>
          <div className="Radio-player">
            <PlayControls access={access} device={device} user={user} />
          </div>
        </div>
        <div className="Radio-chat-side" style={{ flex: 1 }}>
          <Chat user={user} />
        </div>
      </div>
    );
  }
}
