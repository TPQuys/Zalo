import React from 'react'
import logo from "../img/logo.png"

function Welcom() {
  return (
    <div className='welcome-container'>
      <img src={logo} alt='Logo' className='welcom-logo1'/>
      <p style={{marginLeft: '250px'}}> View and text directly to people present in the chat Rooms.</p>
    </div>
  )
}

export default Welcom;