import React from 'react'

function MessageSelf() {
    var props2 = {name: "you", message: "This is a sample Message"}

  return (
    <div className='self-message-container'>
        <div className='messageBox'>
            <p>{props2.message}</p>
            <p className='self-timStamp'>12:00am</p>
        </div>
    </div>
  )
}

export default MessageSelf