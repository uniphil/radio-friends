import React, { Component } from 'react';

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

  queue = uri => {
    const { device, access } = this.props;
    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${access}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uris: [uri] }),
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
                <h4>{track.name} <small>({track.artists.map(artist => artist.name).join(', ')})</small></h4>
                <button onClick={() => this.queue(track.uri)}>queue</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}
