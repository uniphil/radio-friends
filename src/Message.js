import React from 'react';
import './Message.css';

const Message = ({ message }) => (
  <div className="Message">
    <p className="Message-content">{message.message}</p>
    <p className="Message-author">{message.name}</p>
  </div>
);

export default Message;
