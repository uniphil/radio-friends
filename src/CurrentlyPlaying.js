import React from 'react';
import './CurrentlyPlaying.css';

const CurrentlyPlaying = ({ muted, onToggleMute, track, next }) => (
  <div className="CurrentlyPlaying">
    <div className="CurrentlyPlaying-main">
      <button
        className="ContentPlaying-toggle button button-circle"
        onClick={onToggleMute}
      >
        {muted ? 'resume' : 'pause' }
      </button>
      <div className="CurrentlyPlaying-info">
        <h3>Currently playing</h3>
        <h4>
          { track.name }
          <span className="CurrentlyPlaying-artist">{ track.artist }</span>
        </h4>
        <p className="CurrentlyPlaying-queued">queued by <span className="CurrentlyPlaying-queuer">{track.queuer}</span></p>
      </div>
    </div>
    {next ? (
      <p className="CurrentlyPlaying-next">
        up next:{' '}
        <span className="CurrentlyPlaying-next-title">
          {next.name}{' – '}
        </span>
        <span className="CurrentlyPlaying-next-artist">
          {next.artist}
        </span>
        , queued by{' '}
        <span className="CurrentlyPlaying-next-queuer">
          {next.queuer}
        </span>
      </p>
    ) : (
      <p className="CurrentlyPlaying-next">
        up next: <em>nothing queued yet!</em>
      </p>
    )}
  </div>
);

export default CurrentlyPlaying;
