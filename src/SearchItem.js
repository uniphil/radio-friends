import React, { Component } from 'react';
import './SearchItem.css';


export default class SearchItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      queueStatus: 'none',
    };
  }

  componentWillMount() {
    this.alive = true;
  }
  componentWillUnmount() {
    this.alive = false;
  }

  handleQueue = () => {
    const { onQueue, track } = this.props;
    this.setState({ queueStatus: 'queuing' }, () =>
      onQueue(track).then(() =>
        this.setState({ queueStatus: 'queued' })));
  };

  render() {
    const { track } = this.props;
    const { queueStatus } = this.state;
    return (
      <div
        className="SearchItem"
        onClick={this.handleQueue}
      >
        <div className={`SearchItem-info SearchItem-status-${queueStatus}`}>
          <h3>
            <span className="SearchItem-name">
              {track.name}
            </span>
            <span className="SearchItem-artist">
              {track.artists.map(artist => artist.name).join(', ')}
            </span>
          </h3>
        </div>
        {queueStatus !== 'queued' && (
          <button
            className="SearchItem-queue-button button"
            disabled={queueStatus !== 'none'}
          >
            queue
          </button>
        )}
      </div>
    );
  }
}
