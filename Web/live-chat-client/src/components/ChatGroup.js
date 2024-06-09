import { IconButton } from '@mui/material';
import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import Message from './Message';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import MessageRight from './MessageRight';
import MessageLeft from './MessageLeft';
import ImageIcon from '@mui/icons-material/Image';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import UndoIcon from '@mui/icons-material/Undo';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { Picker } from 'emoji-mart';
import PhoneIcon from '@mui/icons-material/Phone';
import DuoIcon from '@mui/icons-material/Duo';
import DehazeIcon from '@mui/icons-material/Dehaze';
import { socketContext } from '../context/SocketContext';

function ChatGroup({ selectedItem }) {
  const navigate = useNavigate();
  const [currentChat, setCurrentChat] = useState([]);
  const {user} = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messageContainerRef = useRef(null);
  // const selectedItem = userChat
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { socket } = useContext(socketContext);
  const scrollRef = useRef();

  /////////////////////// icon
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  
  const handleEmojiSelect = (emoji) => {
    setSelectedEmoji(emoji.native);
  };
  useEffect(() => {
    const getcurrenChat = async (selectedItem) => {
      const responsecheck = await axios.post('http://localhost:8800/api/conversations/getcurrentGroup', {
        groupid: selectedItem._id
      });
      if (responsecheck.data === null) {
          const responsecreate = await axios.post('http://localhost:8800/api/conversations/getnewconvGroup', {
            groupid: selectedItem._id
          });
          setCurrentChat(responsecreate.data);
      } else {
          setCurrentChat(responsecheck.data);
      }
    };
    if (selectedItem) {
      getcurrenChat(selectedItem);
    }
  }, [selectedItem]);
  


  useEffect(() => {
    socket.on("getMessage", (data) => {
      console.log("data message >>", data);
      setArrivalMessage(() => ({
        senderid: data.senderId,
        content: data.text,
        createdAt: Date.now(),
        avatarpicture: data.avatar,
        username: data.username,
      }));
      
    });
  }, []);

useEffect(() => {

  arrivalMessage &&
  selectedItem?.members.includes(arrivalMessage.senderid) &&
    setMessages((prev) => [...prev, arrivalMessage]);
    console.log("hallllllllllo",messages)
}, [arrivalMessage, currentChat]);
useEffect(() => {
  socket.emit("addUser", user._id);
  socket.on("getUsers", (users) => {
    setOnlineUsers(
      user.friends.filter((f) => users.some((u) => u.userId === f))
    );
  });
}, [user]);
// useEffect(() => {
//   const getMessages = async () => {
//     try {
//       const res = await axios.post("http://localhost:8800/api/messages/conversationId", { conversationid: currentChat._id });
//       setMessages(res.data);
//       console.log(res.data);
//     } catch (err) {
//       console.log(err);
//     }
//   };
//   getMessages();
// }, [currentChat]);

useEffect(() => {
  const getMessages = async () => {
    try {
      const res = await axios.post("http://localhost:8800/api/messages/getMessageByConverationId", { conversationid: currentChat._id });
      console.log("aahhhhhhhhhhhhh",res.data)
      setMessages(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  getMessages();
}, [currentChat]);

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!newMessage) return;
    const message = {
      senderid: user._id,
      content: newMessage,
      conversationid: currentChat._id,
      status: 0,
    };
    const receiverId = selectedItem.members.filter(
      (member) => member !== user._id
    );
    socket.emit("sendMessageIngroup", {
      senderId: user._id,
      receiverId,
      text: newMessage,
      avatar: user.avatarpicture,
      username: user.username,
    });
  try {
    const res = await axios.post("http://localhost:8800/api/messages/createMessage", message);
    setMessages([...messages, res.data]);
    setNewMessage("");
  } catch (err) {
    console.log(err);
  }
};



function isImageUrl(content) {
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.bmp']; // Các định dạng ảnh có thể mở rộng thêm nếu cần
  const urlPattern = /^(http(s)?:\/\/[^\s]+\.(png|jpg|jpeg|gif|bmp))/i; // Một pattern để kiểm tra URL

  if (typeof content !== 'string') {
    return false; // Nếu không phải là chuỗi, không phải URL hình ảnh
  }

  // Kiểm tra xem chuỗi có khớp với pattern không
  const match = urlPattern.test(content);

  if (!match) {
    return false; // Không phải là một URL hợp lệ
  }

  // Kiểm tra xem đuôi file có phù hợp không
  const extension = content.slice(content.lastIndexOf('.')).toLowerCase(); // Lấy phần đuôi file và chuyển về lowercase

  if (!imageExtensions.includes(extension)) {
    return false; // Đuôi file không hợp lệ
  }

  return true; // Chuỗi là một URL hình ảnh hợp lệ
}


const handleRevokeMessage = async (messageId, ) => {
  try {
    // Gửi yêu cầu thu hồi tin nhắn đến máy chủ
    const res = await axios.put(`http://localhost:8800/api/messages/${messageId}/revoke`);
    
    const index = messages.findIndex(msg => msg._id === messageId);
    if (index !== -1) {
      // Loại bỏ tin nhắn khỏi mảng
      const updatedMessages = [...messages.slice(0, index), ...messages.slice(index + 1)];
      setMessages(updatedMessages);
    }
    const updatedMessages = messages.map(item => {
      if (item._id === messageId) {
        return { ...item, status: 'revoke' }; // Cập nhật trạng thái tin nhắn đã thu hồi
      }
      return item;
    });
    setMessages(updatedMessages);
    console.log('Tin nhắn đã được thu hồi:', res.data);
  } catch (err) {
    console.log('Lỗi khi thu hồi tin nhắn:', err);
  }
};


  return (
    <div className='chatArea-container'>
      {selectedItem ? (
        <div className='chatArea-header'>
          <div className='header-text'>
            <p className='con-title'>{selectedItem.groupname}</p>
            {/* <p>{currentChat._id}</p> */}
          </div>
          <IconButton>
              <PhoneIcon/>
          </IconButton>
          <IconButton>
              <DuoIcon/>
          </IconButton>
          <IconButton>
              <DehazeIcon/>
          </IconButton>
        </div>
      ) : (
          <p></p>
      )}
      <div className='message-container' ref={messageContainerRef}>
        {messages.map((item) => (
          (item.senderid._id != user._id)?
          //message left
          <MessageLeft key={uuidv4()} img={item.avatarpicture?item.avatarpicture:item.senderid.avatarpicture} content={item.content} isseen={item.isseen} username={item.username?item.username:item.senderid.username} />
          :
          // message right
          <MessageRight key={uuidv4()} img={item.avatarpicture?item.avatarpicture:item.senderid.avatarpicture} content={item.content} isseen={item.isseen}/>
        ))}
      </div>
      <div className='text-input-area'>
        <input 
          placeholder='Nhập tin nhắn...'
          className='search-box'
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
        />
        <input
        type="file"
        id="fileInput"
        style={{ display: 'none' }}
        // onChange={handleFileInputChange}
        // onChange= {isImageUrl}
      />
      <label htmlFor="fileInput">
        <IconButton component="span" onClick= {isImageUrl}>
          <ImageIcon />
        </IconButton>
      </label>
        <IconButton>
          <AttachFileIcon />
        </IconButton>
        <IconButton onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
          <InsertEmoticonIcon />
        </IconButton>
        {showEmojiPicker && (
          <Picker onSelect={handleEmojiSelect} />
        )}
        <IconButton onClick={handleSubmit}>
          <SendIcon />
        </IconButton>
      </div>
    </div>
  )
}

export default ChatGroup;