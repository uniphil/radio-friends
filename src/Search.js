import React, { Component } from 'react';
import firebase from './firebase';
import SearchItem from './SearchItem';
import './Search.css';

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
    const searchValue = e.target.value;
    this.setState(searchValue === ''
      ? { searchValue, searchResults: [] }  // clear results when input cleared
      : { searchValue });
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

  selectAll = () => {
    if (!this.inputEl) { return; }
    this.inputEl.select();
  };

  queue = track => {
    const { user } = this.props;
    return firebase.database().ref('queue').push({
      uri: track.uri,
      name: track.name,
      artist: track.artists.map(a => a.name).join(', '),
      duration: track.duration_ms,
      queuer: user.displayName,
      queued: +new Date(),
    });
  };

  render() {
    const { searching, searchError, searchValue, searchResults } = this.state;
    return (
      <div className="Search">
        {searchError && (<p>uh oh: {`${searchError}`}</p>)}
        <form className="Search-form" onSubmit={this.search}>
          <input
            className="Search-input input"
            disabled={searching}
            onChange={this.handleSearchValueChange}
            onFocus={this.selectAll}
            placeholder="Search music to queue"
            ref={el => this.inputEl = el}
            value={searchValue}
          />
          <button
            className="Search-button button"
            type="submit"
          >
            search
          </button>
        </form>
        <ol className="Search-results">
          {searchResults.map(track => (
            <li className="Search-result-wrap" key={track.id}>
              <SearchItem
                key={track.id}
                onQueue={this.queue}
                track={track}
              />
            </li>
          ))}
        </ol>
      </div>
    );
  }
}
