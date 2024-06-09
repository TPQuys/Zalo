import React, { useContext, useState, useEffect, useRef } from 'react';
import { ScrollView, View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Modal, Clipboard, PermissionsAndroid, KeyboardAvoidingView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { UserContext } from '../context/UserContext ';
import { IP } from '../IP';
import { v4 as uuidv4 } from 'uuid';
import { socketContext } from '../context/SocketContext';
import axios, { Axios } from 'axios';
import 'react-native-get-random-values';
import { Audio } from 'expo-av';


export default function ChatGroup({ navigation, route }) {
  const { userChat } = route.params;
  const [reaction, setReaction] = useState(1);
  const [conversations, setConversations] = useState([]);
  const { currentChat } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [arrivalUpdateMessage, setArrivalUpdateMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { socket } = useContext(socketContext);
  const { user, updateUser } = useContext(UserContext);
  const scrollRef = useRef();
  const [chosenImage, setChosenImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [itemModal, setItemModal] = useState({})

  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState();
  // const [recordings, setRecordings] = useState();
  const [recorderView, setRecorderView] = useState(false);
  const [test, setTest] = useState("Giữ để ghi âm");
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [uploading, setUploading] = useState(false);

  const [playbackInstance, setPlaybackInstance] = useState(null);
  const [playbackPosition, setPlaybackPosition] = useState(null);
  const [playbackDuration, setPlaybackDuration] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playId, setPlayId] = useState('')

  console.log(user)

  async function startRecording() {
    try {
      if (permissionResponse.status !== 'granted') {
        console.log('Requesting permission..');
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log('Recording started');
      setIsRecording(true)

    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    try {
      console.log('Stopping recording..');
      // setRecording(undefined);
      await recording.stopAndUnloadAsync();
      setIsRecording(false)
      await Audio.setAudioModeAsync(
        {
          allowsRecordingIOS: false,
        }
      );
      const recordingURI = recording.getURI();
      if (recordingURI) {
        uploadfile(recordingURI, recording._options.web.mimeType, Date.now().toString())
        setRecorderView(false)
      }

    } catch (error) {
      // Xử lý lỗi ở đây
      console.error('Error uploading audio:', error);
    }
  }

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Permission Denied', 'Permission to access camera roll is required!');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (pickerResult.cancelled === true) {
      return;
    }

    setChosenImage(pickerResult.assets[0].uri);
    uploadMedia(pickerResult.assets[0].uri, pickerResult.assets[0].mimeType, pickerResult.assets[0].type);
    console.log(pickerResult.assets[0]);
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({});
      console.log(result.assets[0]);
      if (result.assets[0]) {
        // alert(result.assets[0].uri);
        setUploading(true)
        uploadfile(result.assets[0].uri, result.assets[0].mimeType, result.assets[0].name);
      } else {
        console.log('User cancelled the picker');
      }
    } catch (err) {
      console.log('Unknown Error: ', err);
    }
  }
  const uploadfile = async (uri, mimeType, name) => {
    try {
      let filename = uri.split('/').pop();
      const formData = new FormData();
      formData.append('file', {
        uri: uri,
        type: mimeType,
        name: name,
      });
      formData.append('name', filename);
      console.log("fromdata:" + JSON.stringify(formData))
      const response = await axios.post(IP + '/api/uploadImage/uploadfile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setUploading(false)
      let message = {
        senderid: user._id,
        content: response.data.url,
        conversationid: currentChat._id
      }
      const receiverId = userChat.members.filter(
        (member) => member !== user._id
      )
      socket.emit("sendMessageIngroup", {
        senderId: user._id,
        receiverId,
        text: response.data.url,
        avatar: user.avatarpicture,
        username: user.username,
      });
      try {
        console.log(message);
        const res = await axios.post(IP + "/api/messages/", message)
        setMessages([...messages, res.data])
        console.log(res.data.senderid === user._id)
        setNewMessage("");
      } catch (error) {
        alert("Lỗi mạng hãy gửi lại")
      }
    } catch (error) {
      alert("Lỗi mạng hãy gửi lại")
    }
  };

  const uploadMedia = async (uri, mimeType, type) => {
    try {
      let filename = uri.split('/').pop();
      const formData = new FormData();
      formData.append('file', {
        uri: uri,
        type: mimeType,
        name: filename,
      });
      formData.append('name', filename);
      console.log("FormData", formData);
      const response = await axios.post(IP + '/api/uploadImage/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      const message = {
        senderid: user._id,
        content: response.data.url,
        conversationid: currentChat._id,
      };
      const receiverId = userChat.members.filter(
        (member) => member !== user._id
      );
      socket.emit("sendMessageIngroup", {
        senderId: user._id,
        receiverId,
        text: response.data.url,
        avatar: user.avatarpicture,
        username: user.username,
      });
      try {
        console.log(message);
        const res = await axios.post(IP + "/api/messages/", message);
        setMessages([...messages, res.data]);
        setNewMessage("");
      } catch (err) {
        console.log(err);
      }
    } catch (error) {
      console.error('Lỗi upload media', error);
    }
  };
  //delete
  const deleteMessage = async (id) => {
    try {
      const res = await axios.put(IP + "/api/messages/delete", { id: id });
      const receiverId = userChat.members.filter(
        (member) => member !== user._id
      );
      socket.emit("uploadMessageIngroup", {
        senderId: user._id,
        receiverId,
        message: JSON.stringify(res.data),
        avatar: user.avatarpicture,
        username: user.username,
      });
      // Tìm tin nhắn cần cập nhật trong danh sách messages
      const updatedMessages = messages.map(message => {
        if (message._id === id) {
          // Cập nhật nội dung của tin nhắn tương ứng
          return { ...message, status: 1 }; // Thay đổi nội dung tin nhắn hoặc trạng thái khác tùy vào yêu cầu
        }
        return message;
      });
      // Cập nhật lại state messages với danh sách tin nhắn đã được cập nhật
      setMessages(updatedMessages);
      setModalVisible(false);
    } catch (err) {
      console.log(err);
    }
  }

  //update
  const updateEmoji = async (id, senderId, emoji) => {
    try {
      const res = await axios.put(IP + "/api/messages/reaction", { id: id, senderid: senderId, emoji: emoji });
      const receiverId = userChat.members.filter(
        (member) => member !== user._id
      );
      socket.emit("uploadMessageIngroup", {
        senderId: user._id,
        receiverId,
        message: JSON.stringify(res.data),
        avatar: user.avatarpicture,
        username: user.username,
      });
      const updatedMessages = messages.map(message => {
        if (message._id === id) {
          // Cập nhật nội dung của tin nhắn tương ứng
          const newEmojis = [...message.emojis]; // Tạo một bản sao của mảng emojis
          newEmojis.push({ senderId, emoji }); // Thêm mới vào đầu mảng
          return { ...message, emojis: newEmojis };
        }
        return message;
      });
      setMessages(updatedMessages);
      setModalVisible(false);
    } catch (err) {
      console.log(err);
    }
  }

  //xoá emojis
  const removeEmoji = async (id, senderId) => {
    try {
      const res = await axios.put(IP + "/api/messages/reaction/remove", { id: id, senderid: senderId });
      const receiverId = userChat.members.filter(
        (member) => member !== user._id
      );
      socket.emit("uploadMessageIngroup", {
        senderId: user._id,
        receiverId,
        message: JSON.stringify(res.data),
        avatar: user.avatarpicture,
        username: user.username,
      });
      const updatedMessages = messages.map(message => {
        if (message._id === id) {
          const updatedEmojis = message.emojis.filter(emoji => emoji.senderId !== senderId);
          return { ...message, emojis: updatedEmojis };
        }
        return message;
      });
      setMessages(updatedMessages);

      setModalVisible(false);
    } catch (err) {
      console.log(err);
    }
  }


  const scrollTBottom = () => {
    scrollRef.current.scrollToEnd({ animated: true });
  }

  useEffect(() => {
    scrollTBottom()
  }, [messages]);


  useEffect(() => {
    socket.on("getMessage", (data) => {
      console.log("data message >>", data);
      setArrivalMessage(() => ({
        senderid: data.senderId,
        content: data.text,
        createdAt: Date.now(),
        avatarpicture: data.avatar,
        username: data.username,
        emojis:[]
      }));
    });
  }, []);

  useEffect(() => {
    socket.on("updateMessage", (data) => {
      const message =JSON.parse(data.message);
      console.log("data message >>", JSON.parse(data.message));
      setArrivalUpdateMessage(() => ({
          _id: message._id,
          senderid: data.senderId,
          content: message.content,
          createdAt: Date.now(),
          avatarpicture: data.avatar,
          username: data.username,
          emojis:message.emojis,
          status:message.status
      }));
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      // kiểm tra xem currentChat có chứa người gửi của tin nhắn arrivalMessage
      userChat?.members.includes(arrivalMessage.senderid) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    if(arrivalUpdateMessage){
      const updatedMessages = messages.map(message => {
        if (message._id === arrivalUpdateMessage._id) {
          return { ...message, emojis: arrivalUpdateMessage.emojis ,status:arrivalUpdateMessage.status};
        }
        return message;
      });
      setMessages(updatedMessages);
    }
  }, [arrivalUpdateMessage, currentChat]);
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
  useEffect(() => {
    //Điều này có nghĩa là server cần nhận userId để biết cuộc trò chuyện nào cần lấy
    const getConversations = async () => {
      try {
        try{
        const response = await axios.post(IP + '/api/group/members/list', { groupId: userChat._id });
        }catch(err){
          alert("Nhóm này đã bị xoá")        
          navigation.push('HomeTabs', { Screen: 'Friends_list', params: { phonenumber: user.phonenumber, groupShow: true } });
        }
        const res = await axios.post(IP + "/api/conversations/getcurrentGroup", { groupid: currentChat._id });
        setConversations(currentChat);
        console.log(currentChat._id);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [user._id]);

  useEffect(() => {
    //Điều này giúp server biết tin nhắn thuộc về cuộc trò chuyện nào.
    const getMessages = async () => {
      try {
        const res = await axios.post(IP + "/api/messages/getMessageByConverationId", { conversationid: currentChat._id });
        setMessages(res.data);
      } catch (err) {
   
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
    const receiverId = userChat.members.filter(
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
      const res = await axios.post(IP + "/api/messages/createMessage", message);
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
    console.log("is image ", isImageUrl(newMessage));
  };
  const friend = {
    id: "nhung",
    name: userChat.username,
    avt: userChat.avatarpicture,
  }

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
  //t chayj cai này nè 



  function isFileMessage(message) {
    // Kiểm tra xem tin nhắn có phải là một URL hợp lệ không
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    if (urlPattern.test(message)) {
      // Nếu là một URL, kiểm tra phần mở rộng tệp
      const urlParts = message.split('/');
      const fileName = urlParts[urlParts.length - 1]; // Lấy phần cuối cùng của URL, tức là tên tệp
      const fileExtension = fileName.split('.').pop().toLowerCase(); // Lấy phần mở rộng của tệp và chuẩn hóa thành chữ thường
      const supportedExtensions = ["jpg", "jpeg", "png", "gif", "docx", "pdf", "mp4", "avi","pptx"]; // Danh sách các phần mở rộng tệp bạn muốn hỗ trợ

      // Kiểm tra xem phần mở rộng của tệp có trong danh sách hỗ trợ không
      return supportedExtensions.includes(fileExtension);
    }
    return false; // Trả về false nếu tin nhắn không phải là một URL hợp lệ
  }


  function getFileNameFromURL(url) {
    // Tách phần cuối của URL bằng dấu "/"
    const parts = url.split("/");
    // Lấy phần tử cuối cùng trong mảng là tên file
    let fileName = parts[parts.length - 1];
    // Tách tên file thành các phần bằng dấu gạch ngang
    const fileNameParts = fileName.split("-");
    // Loại bỏ phần số đằng trước dấu gạch ngang
    fileNameParts.shift();
    // Nối lại các phần của tên file và loại bỏ phần mở rộng ".pdf" nếu có
    fileName = fileNameParts.join("-");
    fileName = fileName.replace('.pdf', '');
    // Trả về tên file đã được xử lý
    return fileName;
  }



  function isVideoLink(link) {
    var videoExtensions = ['.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv', '.webm', '.ogg', '.ogv'];
    var fileExtension = link.split('.').pop().toLowerCase();
    if (videoExtensions.includes('.' + fileExtension)) {
      return true;
    } else {
      return false;
    }
  }



  const handlePlay = async (item) => {
    try {
      const { sound } = await Audio.Sound.createAsync({ uri: item.content });
      setPlaybackInstance(sound);
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
      setIsPlaying(true);
      setPlayId(item._id)
    } catch (error) {
      console.log('Error playing audio', error);
    }
  };

  const onPlaybackStatusUpdate = status => {
    if (status.isLoaded && status.isPlaying) {
      setPlaybackPosition(status.positionMillis);
      setPlaybackDuration(status.durationMillis);
    }
    if (status.isLoaded && !status.isPlaying) {
      // Đặt trạng thái isPlaying thành false khi audio kết thúc phát
      setIsPlaying(false);
      console.log("stop")
    }
  };

  const formatTime = millis => {
    if (millis == null) return '--:--';

    const totalSeconds = millis / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);

    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };



  return (
    <View style={{ backgroundColor: "#e2e9f1", flex: 1 }}>
      <View style={{ width: "100%", backgroundColor: "#227ffd", flexDirection: "row", padding: 10, marginTop: 25, justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={require("../images/back.png")} style={{ height: 25, width: 25 }} />
          </TouchableOpacity>
          <Text style={{ color: "white", margin: 10, fontSize: 17, fontWeight: 600 }}>{userChat.groupname}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
          <TouchableOpacity><Ionicons name='call-outline' color={"white"} size={20} /></TouchableOpacity>
          <TouchableOpacity><Ionicons name='videocam-outline' color={"white"} size={30} /></TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              // const group1 = axios.post(IP + '/api/group/group', { groupId: userChat._id })
              // if(group1){
              console.log(userChat)
              navigation.push("GroupDetail", { phonenumber: user.phonenumber, group: userChat })
              // }
            }}
          ><Ionicons name='menu' color={"white"} size={30} /></TouchableOpacity>
        </View>
      </View>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding' >
        <ScrollView ref={scrollRef}
          contentContainerStyle={{ paddingBottom: 70 }}
        >
          {messages.map((item) => {
            if (item.senderid._id != user._id && item.senderid != user._id) {
              if (item.status == 1) {
                return <View style={{ flexDirection: "row", marginBottom: 10 }} key={uuidv4()}>
                  <Image source={{ uri: item.senderid.avatarpicture }} style={{ height: 40, width: 40, borderRadius: 20 }} />
                  <View style={{ marginHorizontal: 10, flex: 0.8 }}>
                    <Text style={{ fontSize: 17, alignSelf: "flex-start", paddingHorizontal: 7, paddingVertical: 10, backgroundColor: "white", borderRadius: 10 }} key={uuidv4()}>
                      Tin nhắn đã bị thu hồi
                    </Text>
                  </View>
                </View>
              }
              else {
                return <View style={{ flexDirection: "column", marginBottom: 10, marginLeft: 10 }} key={uuidv4()}>
                  <Text style={{ paddingBottom: 5 }}>{item.senderid.username ? item.senderid.username : item.username}</Text>
                  <View style={{ flexDirection: "row" }}>
                    <Image source={{ uri: item.senderid.avatarpicture ? item.senderid.avatarpicture : item.avatarpicture }} style={{ height: 40, width: 40, borderRadius: 20 }} />
                    <View style={{ marginHorizontal: 10, flex: 0.8 }}>
                      {isImageUrl(item.content) ? (
                        <Image source={{ uri: item.content }} style={{ width: 200, height: 200 }} />
                      ) : (
                       
                          <TouchableOpacity style={{ alignSelf: 'flex-start' }}
                            onLongPress={() => {
                              setModalVisible(true)
                              setItemModal(item)
                            }}
                          >
                            <Text style={{ fontSize: 17, paddingHorizontal: 7, paddingVertical: 10, backgroundColor: "white", borderRadius: 10, minWidth: 60 }} key={item._id}>
                              { isVideoLink(item.content)
                          ? <View style = {{flexDirection:"row",gap:20}}>
                            <Ionicons name='volume-low-outline' size={20}></Ionicons>
                            <TouchableOpacity onPress={() => (isPlaying ? null : handlePlay(item))}>
                              <Text style={{ width: 40 }} key={item._id}>{(isPlaying && playId === item._id) ? formatTime(playbackDuration - playbackPosition) : 'Phát'}</Text>
                            </TouchableOpacity>
                          </View>:isFileMessage(item.content)?
                            <View style={{padding:10,maxWidth:250}}>
                            <Ionicons name='document-outline' size={40} style={{alignSelf:"flex-start"}}></Ionicons>
                            <Text style={{textAlign:"left"}}>{getFileNameFromURL(item.content)}</Text>
                            </View>
                            :
                          item.content}
                            </Text>
                            <View style={{ flexDirection: 'row', position: 'absolute', left: 10, alignSelf: 'flex-start', bottom: -8, backgroundColor: "white", borderRadius: 15, alignItems: 'center' }}>
                              {
                                (() => {
                                  let uniqueEmojis = [];
                                  let temp = [...item.emojis];
                                  const maxItems = 3;
                                  let itemCount = 0;

                                  return temp.reverse().map(item => {

                                    if (itemCount < maxItems && !uniqueEmojis.includes(item.emoji)) {
                                      uniqueEmojis.push(item.emoji);
                                      itemCount++;
                                      if (item.emoji === 1) {
                                        return <Text key={uuidv4()}>♥️</Text>;
                                      } else if (item.emoji === 2) {
                                        return <Text key={uuidv4()}>👍</Text>
                                      } else if (item.emoji === 3) {
                                        return <Text key={uuidv4()}>😆</Text>
                                      } else if (item.emoji === 4) {
                                        return <Text key={uuidv4()}>😲</Text>
                                      } else if (item.emoji === 5) {
                                        return <Text key={uuidv4()}>😭</Text>
                                      } else if (item.emoji === 6) {
                                        return <Text key={uuidv4()}>😠</Text>
                                      }
                                    }
                                    return null; // Return null for emojis beyond the limit or duplicates
                                  });
                                })()
                              }
                              <Text>{item.emojis.length !== 0 ? item.emojis.length : null}</Text>
                            </View>
                          </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>

              }
            }
            else {
              if (item.status == 0)
                return <TouchableOpacity style={{ flexDirection: "row", marginBottom: 10, justifyContent: "flex-end" }} key={uuidv4()}
                  onLongPress={() => {
                    setModalVisible(true)
                    setItemModal(item)
                  }}
                >
                  <View style={{ marginHorizontal: 10 }}>
                    {isImageUrl(item.content) ? (
                      <Image source={{ uri: item.content }} style={{ width: 200, height: 200, alignSelf: "flex-end" }} />
                    ) : (
                      <View style={{ marginHorizontal: 5, paddingHorizontal: 7, alignSelf: "flex-end", paddingVertical: 10, borderRadius: 10, backgroundColor: "#d5f1ff", borderWidth: 0.7, borderColor: "lightgrey", flexDirection: 'row', minWidth: 60 }} key={item._id}>
                        <Text style={{ fontSize: 17}} >
                          {isVideoLink(item.content)
                            ?
                            (<View style={{flexDirection:"row",gap:20}}>
                              <Ionicons name='volume-low-outline' size={20}></Ionicons>
                              <TouchableOpacity onPress={() => (isPlaying ? null : handlePlay(item))}>
                                <Text style={{ width: 40 }} key={item._id}>{(isPlaying && playId === item._id) ? formatTime(playbackDuration - playbackPosition) : 'Phát'}</Text>
                              </TouchableOpacity>
                            </View>)
                            : isFileMessage(item.content)?
                            <View style={{padding:10,maxWidth:250}}>
                            <Ionicons name='document-outline' size={40} style={{alignSelf:"flex-end"}}></Ionicons>
                            <Text style={{textAlign:"right"}}>{getFileNameFromURL(item.content)}</Text>
                            </View>
                            :item.content}
                        </Text>
                        <View style={{ flexDirection: 'row', position: 'absolute', alignSelf: 'flex-end', right: 10, bottom: -8, backgroundColor: "white", borderRadius: 15, alignItems: 'center' }}>
                          {
                            (() => {
                              let uniqueEmojis = [];
                              let temp = [...item.emojis];
                              const maxItems = 3;
                              let itemCount = 0;

                              return temp.reverse().map(item => {

                                if (itemCount < maxItems && !uniqueEmojis.includes(item.emoji)) {
                                  uniqueEmojis.push(item.emoji);
                                  itemCount++;
                                  if (item.emoji === 1) {
                                    return <Text key={uuidv4()}>♥️</Text>;
                                  } else if (item.emoji === 2) {
                                    return <Text key={uuidv4()}>👍</Text>
                                  } else if (item.emoji === 3) {
                                    return <Text key={uuidv4()}>😆</Text>
                                  } else if (item.emoji === 4) {
                                    return <Text key={uuidv4()}>😲</Text>
                                  } else if (item.emoji === 5) {
                                    return <Text key={uuidv4()}>😭</Text>
                                  } else if (item.emoji === 6) {
                                    return <Text key={uuidv4()}>😠</Text>
                                  }
                                }
                                return null; // Return null for emojis beyond the limit or duplicates
                              });
                            })()
                          }
                          <Text>{item.emojis.length !== 0 ? item.emojis.length : null}</Text>
                        </View>

                      </View>
                    )}
                    {messages.indexOf(item) === messages.length - 1 ? (
                      <Text style={{ alignSelf: "flex-end", color: "grey" }}>
                        {item.isseen ? "Đã xem" : "Đã gửi"}
                      </Text>
                    ) : null}
                  </View>
                </TouchableOpacity>
              else
                return <View key={uuidv4()}>
                  <Text style={{ marginHorizontal: 10, marginBottom: 10, fontSize: 17, paddingHorizontal: 7, alignSelf: "flex-end", paddingVertical: 10, backgroundColor: "white", borderRadius: 10, backgroundColor: "#d5f1ff", borderWidth: 0.7, borderColor: "lightgrey" }} key={item._id}>
                    Tin nhắn đã bị thu hồi
                  </Text>
                </View>
            }
          })
          }

        </ScrollView>
      </KeyboardAvoidingView>
      <View style={{ borderTopWidth: 0.5, backgroundColor: "white", height: 70, position: "absolute", left: 0, right: 0, bottom: 0, flexDirection: "row", alignItems: "center", padding: 20, justifyContent: "space-between" }}>
        <TextInput
          onFocus={scrollTBottom}
          placeholder='Tin nhắn'
          style={{ fontSize: 17, flex: 1, }}
          value={newMessage}
          onChangeText={(text) => setNewMessage(text)}
        ></TextInput>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <TouchableOpacity><Ionicons name='mic-outline' color={"grey"} size={20} onPress={() => setRecorderView(true)} /></TouchableOpacity>
          <TouchableOpacity
            onPress={pickDocument}
          ><Ionicons name='file-tray-full' color={"gold"} size={20} /></TouchableOpacity>
          <TouchableOpacity
            onPress={pickImage}
          ><Ionicons name='image' color={"gold"} size={20} /></TouchableOpacity>
          <TouchableOpacity
            onPress={newMessage != "" ? handleSubmit : null}
          ><Ionicons name='send' color={"#227ffd"} size={30} /></TouchableOpacity>
        </View>
      </View>
      {recorderView ? <View style={{ position: "absolute", backgroundColor: 'white', borderWidth: 1, borderColor: "lightgrey", height: 320, width: "100%", bottom: 0, justifyContent: "center", gap: 30 }}>
        <Text style={{ alignSelf: 'center' }}>Nhấn để ghi âm</Text>
        {isRecording ?
          <View style={{ flexDirection: "row", gap: 40, justifyContent: 'center' }}>
            <TouchableOpacity style={{ alignSelf: 'center', height: 60, width: 60, backgroundColor: "#227ffd", justifyContent: 'center', alignItems: "center", borderRadius: 30 }}
              onPress={async () => {
                await recording.stopAndUnloadAsync();
                setIsRecording(false)
              }}
            >
              <Ionicons name='close' color={"white"} size={40}></Ionicons>
            </TouchableOpacity>
            <TouchableOpacity style={{ alignSelf: 'center', height: 60, width: 60, backgroundColor: "#227ffd", justifyContent: 'center', alignItems: "center", borderRadius: 30 }}
              onPress={() => stopRecording()}
            >
              <Ionicons name='send' color={"white"} size={35}></Ionicons>
            </TouchableOpacity>
            <View style={{ alignSelf: 'center', height: 60, width: 60, justifyContent: 'center', alignItems: "center", borderRadius: 30 }} />
          </View> :
          <TouchableOpacity style={{ alignSelf: 'center', height: 60, width: 60, backgroundColor: "#227ffd", justifyContent: 'center', alignItems: "center", borderRadius: 30 }}
            onPress={() => {
              startRecording()
            }}
          >
            <Ionicons name='mic' color={"white"} size={40}></Ionicons>
          </TouchableOpacity>}

        <TouchableOpacity style={{ alignSelf: "center" }} onPress={() => {
          setRecorderView(false)
        }}>
          <Text>Hủy</Text>
        </TouchableOpacity>
      </View> : null}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(true);
        }}>

        <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', flex: 1, justifyContent: "flex-end", padding: 15 }}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => setModalVisible(false)}></TouchableOpacity>
          {itemModal.senderid !== user._id ?
            <View style={{ flexDirection: "row", marginBottom: 10 }}>
              <Image source={{ uri: friend.avt }} style={{ height: 40, width: 40, borderRadius: 20 }} />
              <View style={{ marginHorizontal: 10, flex: 0.8 }} >
                <Text style={{ fontSize: 17, paddingHorizontal: 7, paddingVertical: 10, backgroundColor: "white", borderRadius: 10 }}>
                  {itemModal.content}
                </Text>
              </View>
            </View> :
            <View style={{ flexDirection: "row", marginBottom: 10 }}>
              <View style={{ marginHorizontal: 10, flex: 0.8 }}>
                <Text style={{ fontSize: 17, paddingHorizontal: 7, paddingVertical: 10, backgroundColor: "white", borderRadius: 10, backgroundColor: "#d5f1ff", borderWidth: 0.7, borderColor: "lightgrey" }}>
                  {itemModal.content}
                </Text>
              </View>
            </View>}
          <View style={{ flexDirection: "row" }}>
            <View style={{ flexDirection: "row", backgroundColor: "white", marginVertical: 10, borderRadius: 15, justifyContent: "space-around", flex: 1 }}>
              <TouchableOpacity style={{ alignItems: "center" }}
                onPress={() => updateEmoji(itemModal._id.toString(), user._id.toString(), 1)}
              >
                <Text style={{ fontSize: 30, margin: 5 }}>♥️</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ alignItems: "center" }}
                onPress={() => updateEmoji(itemModal._id.toString(), user._id.toString(), 2)}
              >
                <Text style={{ fontSize: 30, margin: 5 }}>👍</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ alignItems: "center" }}
                onPress={() => updateEmoji(itemModal._id.toString(), user._id.toString(), 3)}
              >
                <Text style={{ fontSize: 30, margin: 5 }}>😆</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ alignItems: "center" }}
                onPress={() => updateEmoji(itemModal._id.toString(), user._id.toString(), 4)}
              >
                <Text style={{ fontSize: 30, margin: 5 }}>😲</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ alignItems: "center" }}
                onPress={() => updateEmoji(itemModal._id.toString(), user._id.toString(), 5)}
              >
                <Text style={{ fontSize: 30, margin: 5 }}>😭</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ alignItems: "center" }}
                onPress={() => updateEmoji(itemModal._id.toString(), user._id.toString(), 6)}
              >
                <Text style={{ fontSize: 30, margin: 5 }}>😠</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={{ alignSelf: "center", margin: 10 }}
              onPress={() => {
                removeEmoji(itemModal._id.toString(), user._id.toString())
              }}
            >
              <Ionicons name='ban' size={40} color={"white"} ></Ionicons>
            </TouchableOpacity>
          </View>
          <View style={{ backgroundColor: "white", height: 100, borderRadius: 15, flexDirection: "row", alignItems: "center", justifyContent: "space-around" }}>
            <TouchableOpacity style={{ alignItems: "center" }}
              onPress={() => { Clipboard.setString(itemModal.content); setModalVisible(false) }}
            >
              <Ionicons name='clipboard-outline' size={40} style={{ margin: 10, alignSelf: "flex-start" }} />
              <Text>Sao chép</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ alignItems: "center" }}
              onPress={() => deleteMessage(itemModal._id.toString())}
            >
              <Ionicons name='refresh' size={40} />
              <Text>Thu hồi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  Textbox: {
    borderWidth: 2,
    borderColor: "#514eb5",
    borderRadius: 15,
    padding: 10,
    width: "80%",
    fontSize: 17,
    backgroundColor: "#eaeaf5"
  }
});