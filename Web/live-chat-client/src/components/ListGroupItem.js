import React from 'react';
import axios from 'axios';
import { useContext, useState, useEffect } from 'react';
import FaceIcon from '@mui/icons-material/Face';
import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import { UserContext } from '../context/UserContext';

function ListGroupItem({props}) {
  const navigate = useNavigate();
  const {user} = useContext(UserContext);
  const [lastmessages, setLastMessages] = useState([]);
  const [currentChat, setCurrentChat] = useState([]);
//prop = gr
  // const getcurrenChat = async (props) => {
  //   const responsecheck = await axios.post('http://localhost:8800/api/conversations/getcurrentGroup', {
  //       groupid: props._id
  //   });
  //   if (responsecheck.data === null) {
  //       const responsecreate = await axios.post('http://localhost:8800/api/conversations/getnewconvGroup', {
  //           groupid: props._id
  //       });
  //       setCurrentChat(responsecreate.data);
  //       navigate("chatGroup");
  //       // navigation.push("Chat", { userChat: userChat, currentChat: responsecreate.data })
  //   } else {
  //       setCurrentChat(responsecheck.data);
  //       navigate("chatGroup");
  //       // navigation.push("Chat", { userChat: userChat, currentChat: responsecheck.data })
  //   }
  // }
  
  return (
    <div className='conversation-container' >
      
        <img src={props.avatarpicture} alt="Avatar" className='con-icon' />
        <p className='con-title'>{props.groupname}</p>
        <p className='con-lastMessage'>{currentChat.lastmessage}</p>
        {/* <p className='con-timeStamp'>{props.timeStamp}</p> */}
    <div className='conversation-item'>
      {/* Hiển thị thông tin cuộc trò chuyện */}
      <IconButton >
        <CloseIcon />
      </IconButton>
    </div>
    </div>
  )
}

export default ListGroupItem