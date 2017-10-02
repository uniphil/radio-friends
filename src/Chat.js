import React, { Component } from 'react';
import firebase from './firebase';
import Message from './Message';
import './Chat.css';


export default class Chat extends Component {
  constructor() {
    super();
    this.state = {
      message: '',
      messages: null,
    };
    firebase.database().ref('messages').limitToLast(14).on('value', v => {
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
      <div className="Chat">
        <div className="Chat-messages">
          {messages
            ? Object.keys(messages).map(id => (
                <Message key={id} message={messages[id]} />
              ))
            : <p>loading messages...</p>}
        </div>
        <form className="Chat-form" onSubmit={this.post}>
          <textarea
            className="input"
            onChange={this.handleTyping}
            value={message}
          />
          <button className="button" type="submit">
            send
          </button>
        </form>
      </div>
    );
  }
}
