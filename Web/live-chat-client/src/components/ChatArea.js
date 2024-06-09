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

function ChatArea({selectedItem}) {
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

  console.log("message chat",messages);
  //Mở kết nối với máy chủ WebSocket tại địa chỉ ws://localhost:8900 sử dụng thư viện socket.io và lưu trữ nó trong socket.
  // useEffect(() => {
  //   socket = io("ws://localhost:8900");
  //   // một tin nhắn mới được nhận và arrivalMessage được cập nhật.
  //   socket.on("getMessage", (data) => {
  //     console.log("data message >>",data);
  //     setArrivalMessage(()=>({
  //       senderid: data.senderId,
  //       content: data.text,
  //       createdAt: Date.now(),
  //     }));
  //   });
  // }, []);

  useEffect(() => {
    // một tin nhắn mới được nhận và arrivalMessage được cập nhật.
    socket.on("getMessage", (data) => {
      console.log("data message >>", data);
      setArrivalMessage(() => ({
        senderid: data.senderId,
        content: data.text,
        createdAt: Date.now(),
      }));
    });
  }, []);

  useEffect(() => {
if(arrivalMessage){
}
    arrivalMessage &&
      // kiểm tra xem currentChat có chứa người gửi của tin nhắn arrivalMessage
      currentChat?.members.includes(arrivalMessage.senderid) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);
  // messages = [
  //   { sender: 'user1', text: 'Hello!', createdAt: 1649227200000 },
  //   { sender: 'user2', text: 'Hi there!', createdAt: 1649227300000 }
  // ]
  useEffect(() => {
    // Đoạn mã này gửi một sự kiện tới server WebSocket với tên "addUser" và truyền _id của người dùng hiện tại. 
    // Điều này giúp server biết rằng một người dùng mới đã kết nối vào hệ thống.
    socket.emit("addUser", user._id);
    // Thông điệp này chứa danh sách các người dùng trực tuyến.
    socket.on("getUsers", (users) => {
      //lọc ra những người bạn của người dùng hiện tại (user.friends), mà cũng xuất hiện trong danh sách người dùng trực tuyến
      setOnlineUsers(
        user.friends.filter((f) => users.some((u) => u.userId === f))
      );
    });
  }, [user]);

  // useEffect(() => {
  //   //Điều này có nghĩa là server cần nhận userId để biết cuộc trò chuyện nào cần lấy
  //   const getConversations = async () => {
  //     try {
  //       const res = await axios.get("http://localhost:8800/api/conversations/userId", { userId: user._id });
  //       setConversations(res.data);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   getConversations();
  // }, [user._id]);

  useEffect(() => {
    //Điều này giúp server biết tin nhắn thuộc về cuộc trò chuyện nào.
    const getMessages = async () => {
      try {
        const res = await axios.post("http://localhost:8800/api/messages/conversationId", { conversationid: currentChat._id });
        setMessages(res.data);
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Tạo đối tượng message: Đoạn mã này tạo một đối tượng tin nhắn với các thuộc tính bao gồm sender (người gửi), 
    // text (nội dung tin nhắn) và conversationId (ID của cuộc trò chuyện hiện tại).
    const message = {
      senderid: user._id,
      content: newMessage,
      conversationid: currentChat._id,
    };
    // Xác định receiverId: Đoạn mã này tìm kiếm receiverId (người nhận tin nhắn) trong danh sách thành viên của currentChat. 
    // Thành viên không phải là người gửi (user._id) sẽ được xác định là người nhận.
    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );
    // Dòng này gửi một sự kiện sendMessage qua socket để thông báo tin nhắn đến người nhận. 
    // Thông điệp này bao gồm senderId (ID của người gửi), receiverId (ID của người nhận) và text (nội dung tin nhắn).
    socket.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      text: newMessage,
    });
    // Gửi tin nhắn: Đoạn mã này gửi tin nhắn đến server thông qua API POST /messages và 
    // sau đó cập nhật danh sách tin nhắn bằng cách thêm tin nhắn mới vào mảng messages.
    //lưu trữ tin nhắn mới vào cơ sở dữ liệu
    try {
      console.log(message);
      const res = await axios.post("http://localhost:8800/api/messages/", message);
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  // useEffect(() => {
  //   const fetchMessages = async () => {
  //     try {
  //       const response = await axios.get(`http://localhost:8800/api/messages/${selectedItem._id}`);// này làm j có này dùng làm j đây
  //       setMessages(response.data);
  //     } catch (error) {
  //       console.error('Error fetching messages:', error);
  //     }
  //   };

  //   if (selectedItem) {
  //     fetchMessages();
  //   }
  // }, [selectedItem]);

  useEffect(() => {
    const getcurrenChat = async (selectedItem) => {
      const responsecheck = await axios.post('http://localhost:8800/api/conversations/getcurrentChat', {
          userId: user._id,
          receiverId: selectedItem._id
      });
      if (responsecheck.data === null) {
          const responsecreate = await axios.post('http://localhost:8800/api/conversations/getnewconv', {
              senderId: user._id,
              receiverId: selectedItem._id
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
/////////////////////////////////////////////////////////
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    
    // Kiểm tra xem người dùng đã chọn tập tin hay chưa
    if (file) {
        console.log('Đã chọn tập tin:', file.name);
        
        // Kiểm tra loại tập tin, ví dụ: chỉ chấp nhận hình ảnh
        if (file.type.includes('image')) {
            console.log('Loại tập tin hợp lệ.');
            
            // Thực hiện các xử lý khác tại đây, ví dụ: tải tập tin lên máy chủ, hiển thị trước tập tin, vv.
        } else {
            console.log('Loại tập tin không hợp lệ. Chỉ chấp nhận hình ảnh.');
        }
    } else {
        console.log('Không có tập tin nào được chọn.');
    }
};
//////////////////////////////////////////////////////////



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


// const handleSend = async (messageType, imageUri) =>{
//   try{
//     const formData = new FormData();
//     formData.append("senderId", userId);
//     formData.append("recepientId", receiverId);
    
//     if(messageType === "image"){
//       formData.append("messageType", "image");
//       formData.append("imageFile", {
//         uri: imageUri,
//         name: "image.jpg",
//         type: "image/jpeg",
//       });
//     }else{
//       formData.append("messageType", "text")
//       formData.append("messageText", message);
//     }
     
// }



/////////////////////// icon
const [selectedEmoji, setSelectedEmoji] = useState(null);
const [showEmojiPicker, setShowEmojiPicker] = useState(false);
const handleEmojiSelect = (emoji) => {
  setSelectedEmoji(emoji.native);
};


  return (
    <div className='chatArea-container'>
      {selectedItem ? (
        <div className='chatArea-header'>
          <div className='header-text'>
            <p className='con-title'>{selectedItem.username}</p>
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
          (item.senderid != user._id)?
          //message left
          <MessageLeft key={uuidv4()} img={selectedItem.avatarpicture} content={item.content} isseen={item.isseen} />
          :
          // message right
          <MessageRight key={uuidv4()} img={user.avatarpicture} content={item.content} isseen={item.isseen}/>
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
        <IconButton component="span">
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

export default ChatArea;
