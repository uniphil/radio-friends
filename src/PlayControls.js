import React, { Component } from 'react';
import firebase from 'firebase';


export default class PlayControls extends Component {
  constructor() {
    super();
    this.state = {
      loadingQueue: true,
      playing: null,
      queue: [],
    };
    firebase.database().ref('queue').on('value', v => {
      const fbQueue = v.val();
      const queue = Object.keys(fbQueue).map(id => ({ id, ...fbQueue[id] }));
      this.sync(queue);
      this.setState({
        loadingQueue: false,
        queue,
      });
    });
  }

  x = (uri, position) => {
    const { device, access } = this.props;
    const query = device ? `device_id=${device.id}` : ''
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

  sync = queue => {
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
      this.x(item.uri, now - startedAt);
      this.setState({
        playing: item,
      });
      console.log(item, startedAt + item.duration - now);
      setTimeout(() => this.sync(this.state.queue), startedAt + item.duration - now + 16);
    }
  };

  render() {
    const { loadingQueue, queue, playing } = this.state;
    return (
      <div>
        {playing && (
          <div>
            <h3>Currently playing</h3>
            <h4>
              { playing.name } <small>({ playing.artist })</small>
            </h4>
            <p>Queued by {playing.queuer}</p>
          </div>
        )}
        {loadingQueue ? (
          <p>Loading queue...</p>
        ) : (
          <div>
            <h3>Queue</h3>
            <ol>
              {queue.map(item => (
                <li key={item.id}>
                  <h4>
                    {item.name} <small>({item.artist})</small>
                  </h4>
                  <p>Queued by {item.queuer}</p>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    );
  }
}
