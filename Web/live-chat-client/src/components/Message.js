import React from 'react';

function Message({ content, sender }) {
  return (
    <div className={`message ${sender === 'self' ? 'self' : 'others'}`}>
      <p className='message-content'>{content}</p>
    </div>
  );
}

export default Message;
