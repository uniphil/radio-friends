import React, { Component } from 'react';
import Chat from './Chat';

export default class Radio extends Component {
  render() {
    const { user } = this.props;
    return (
      <div style={{
        display: 'flex',
      }}>
        <div style={{ flex: '1' }}>music side</div>
        <div style={{ flex: '1' }}>
          <Chat user={user} />
        </div>
      </div>
    );
  }
}
