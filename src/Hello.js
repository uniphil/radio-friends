import React, { Component } from 'react';
import './Hello.css';

const Hello = ({ authUrl }) => (
  <div className="Hello splash">
    <div className="Hello-wrap">
      <h1 className="Hello-title">Radio Friends</h1>
      <p>Listen to music together from anywhere</p>
      <p className="Hello-signin">
        <a className="Hello-signin-link" href={authUrl}>
          Sign in with Spotify
        </a>
      </p>
    </div>
  </div>
);

export default Hello;
