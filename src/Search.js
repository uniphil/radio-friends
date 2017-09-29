import React, { Component } from 'react';
import firebase from './firebase';

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchError: null,
      searchResults: [],
      searchValue: '',
      searching: false,
    };
  }

  handleSearchValueChange = e => {
    this.setState({ searchValue: e.target.value });
  }

  search = e => {
    e.preventDefault();
    const { access } = this.props;
    const { searchValue } = this.state;
    this.setState({
      searchError: null,
      searching: true,
    });

    const q = encodeURIComponent(searchValue);
    fetch(`https://api.spotify.com/v1/search?q=${q}&type=track`, {
      headers: { 'Authorization': `Bearer ${access}` },
    })
      .then(r => r.json())
      .then(data => data.error
        ? Promise.reject(data.error.message)
        : data)
      .then(({ tracks }) => {
        this.setState({
          searching: false,
          searchResults: tracks.items,
        });
      }, err => {
        this.setState({
          searching: false,
          searchError: err,
        });
      });
  };

  queue = track => {
    const { user } = this.props;
    firebase.database().ref('queue').push({
      uri: track.uri,
      name: track.name,
      artist: track.artists.map(a => a.name).join(', '),
      duration: track.duration_ms,
      queuer: user.displayName,
      queued: +new Date(),
    });
  }

  render() {
    const { searching, searchError, searchValue, searchResults } = this.state;
    return (
      <div>
        <p>search yo</p>
        {searchError && (<p>uh oh: {`${searchError}`}</p>)}
        <form onSubmit={this.search}>
          <p>
            <input
              disabled={searching}
              onChange={this.handleSearchValueChange}
              placeholder="search"
              value={searchValue}
            />
          </p>
          <p>
            <button type="submit">search</button>
          </p>
        </form>
        <div>
          <ul>
            {searchResults.map(track => (
              <li key={track.id}>
                <h4>
                  {track.name}{' '}
                  <small>({track.artists.map(artist => artist.name).join(', ')})</small>
                  <button onClick={() => this.queue(track)}>queue</button>
                </h4>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}
