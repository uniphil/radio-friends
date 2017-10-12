import React from 'react';
import './Hello.css';

const Hello = ({ authUrl }) => (
  <div className="Hello splash">
    <div className="Hello-wrap">
      <h1 className="Hello-title">Radio Friends</h1>
      <p>Test day is over. Many thanks to those who tried it out!</p>
      <link href="//cdn-images.mailchimp.com/embedcode/horizontal-slim-10_7.css" rel="stylesheet" type="text/css" />
      <div id="mc_embed_signup">
        <form action="https://csc11.us2.list-manage.com/subscribe/post?u=81efec9c295da7f4479e67c1e&amp;id=f79ea173a9" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate" target="_blank" novalidate>
          <div id="mc_embed_signup_scroll">
            <input type="email" style={{ width: '15em' }} name="EMAIL" className="email" id="mce-EMAIL" placeholder="email address" required />
            <div style={{ position: 'absolute', left: -5000 }} aria-hidden="true">
              <input type="text" name="b_81efec9c295da7f4479e67c1e_f79ea173a9" tabindex="-1" />
            </div>
            <div className="clear">
              <input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" className="button" />
            </div>
          </div>
        </form>
      </div>
      {/*<p>Listen to music together from anywhere</p>
      <p className="Hello-signin">
        <a className="Hello-signin-link button" href={authUrl}>
          Sign in with Spotify
        </a>
      </p>*/}
    </div>
  </div>
);

export default Hello;
