import React, { Component } from 'react';
import firebase from 'firebase';
import CurrentlyPlaying from './CurrentlyPlaying';


export default class PlayControls extends Component {
  constructor() {
    super();
    this.state = {
      loadingQueue: true,
      muted: false,
      playing: null,
      queue: [],
    };
    firebase.database().ref('queue').on('value', v => {
      const fbQueue = v.val();
      const queue = Object.keys(fbQueue).map(id => ({ id, ...fbQueue[id] }));
      this.setState({
        loadingQueue: false,
        queue,
      }, this.sync);
    });
  }

  setPlayback = (uri, position) => {
    if (this.state.muted) { console.log('nope'); return; }
    const { device, access } = this.props;
    const query = device ? `device_id=${device.id}` : '';
    fetch(`https://api.spotify.com/v1/me/player/play?${query}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${access}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uris: [uri] }),
    }).then(() =>
      fetch(`https://api.spotify.com/v1/me/player/seek?position_ms=${position}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${access}` },
      }));
  };

  pausePlayback = () => {
    const { device, access } = this.props;
    const query = device ? `device_id=${device.id}` : '';
    fetch(`https://api.spotify.com/v1/me/player/pause?${query}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${access}`,
        'Content-Type': 'application/json',
      },
    });
  };

  sync = () => {
    const { queue } = this.state;
    const now = +new Date();
    const { item, startedAt } = queue.reduce((last, item) => {
      const lastEnd = last.startedAt + last.item.duration;
      if (lastEnd > now) {
        return last;
      }
      return {
        item,
        startedAt: Math.max(lastEnd, item.queued),
      };
    }, {
      item: { duration: 0 },
      startedAt: -Infinity,
    });
    if (startedAt + item.duration > now) {
      this.setPlayback(item.uri, now - startedAt);
      this.setState({
        playing: item,
      });
      setTimeout(this.sync, startedAt + item.duration - now + 16);
    }
  };

  toggleMute = () => {
    const { muted } = this.state;
    this.setState({ muted: !muted }, () => {
      if (muted) {
        this.sync();
      } else {
        this.pausePlayback();
      }
    });
  }

  render() {
    const { muted, playing, queue } = this.state;
    const inOrder = Object.keys(queue).map(k => queue[k]);  // ...ish...
    const next = inOrder[inOrder.indexOf(playing) + 1];
    return (
      <div>
        {playing && (
          <CurrentlyPlaying
            muted={muted}
            next={next}
            onToggleMute={this.toggleMute}
            track={playing}
          />
        )}
      </div>
    );
  }
}
