import React, { Component } from 'react';
import firebase from './firebase';


export default class Chat extends Component {
  constructor() {
    super();
    this.state = {
      message: '',
      messages: null,
    };
    firebase.database().ref('messages').limitToLast(4).on('value', v => {
      this.setState({ messages: v.val() });
    });
  }
  handleTyping = e => {
    this.setState({ message: e.target.value });
  };
  post = e => {
    e.preventDefault();
    const { message } = this.state;
    const { user } = this.props;
    const m = firebase.database().ref('messages').push();
    m.set({
      message,
      name: user.displayName,
    });
    this.setState({ message: '' });
  };
  render() {
    const { message, messages } = this.state;
    return (
      <div>
        <div>
          {messages
            ? Object.keys(messages).map(id => (
                <p key={id}>
                  {messages[id].message}{' '}
                  <small><em>({messages[id].name})</em></small>
                </p>
              ))
            : <p>loading messages...</p>}
        </div>
        <form onSubmit={this.post}>
          <textarea onChange={this.handleTyping} value={message} />
          <p><button type="submit">send</button></p>
        </form>
      </div>
    );
  }
}
