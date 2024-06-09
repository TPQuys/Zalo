import React, { useContext, useState, useEffect, useRef } from 'react';
import { ScrollView, View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { UserContext } from '../context/UserContext ';
import { io } from "socket.io-client";
import { IP } from '../IP';
import { v4 as uuidv4 } from 'uuid';
import { socketContext } from '../context/SocketContext';
import axios from 'axios';
import 'react-native-get-random-values';
export default function Chat({ navigation, route }) {
  const { userChat } = route.params;
  const [conversations, setConversations] = useState([]);
  const { currentChat } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { socket } = useContext(socketContext);
  const { user, updateUser } = useContext(UserContext);
  const scrollRef = useRef();
  const [chosenImage, setChosenImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [itemModal, setItemModal] = useState({})
  const [typefile, setTypefile] = useState('');
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
      if (result && !result.cancelled) {
        // alert(result.assets[0].uri);
        uploadfile(result.assets[0].uri, result.assets[0].mimeType);
      } else {
        console.log('User cancelled the picker');
      }
    } catch (err) {
      console.log('Unknown Error: ', err);
    }
  }
  const uploadfile = async (uri, mimeType) => {
    try {
      let filename = uri.split('/').pop();
      const formData = new FormData();
      formData.append('file', {
        uri: uri,
        type: mimeType,
        name: filename,
      });
      formData.append('name', filename);
      const response = await axios.post(IP + '/api/uploadImage/uploadfile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      // const message = {
      //   senderid: user._id,
      //   content: response.data.url,
      //   conversationid: currentChat._id,
      // };
      // const receiverId = currentChat.members.find(
      //   (member) => member !== user._id
      // );
      // socket.emit("sendMessage", {
      //   senderId: user._id,
      //   receiverId,
      //   text: newMessage,
      // });
      // try {
      //   console.log(message);
      //   const res = await axios.post(IP+"/api/messages/", message);
      //   setMessages([...messages, res.data]);
      //   setNewMessage("");
      // } catch (err) {
      //   console.log(err);
      // }
    } catch (error) {
      console.error('Lỗi upload file', error);
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
      const receiverId = currentChat.members.find(
        (member) => member !== user._id
      );
      socket.emit("sendMessage", {
        senderId: user._id,
        receiverId,
        text: newMessage,
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
  ////kéo list tin nhắn xuống dưới cùng
  useEffect(() => {
    scrollRef.current.scrollToEnd({ animated: true });
  }, [messages]);

  //Mở kết nối với máy chủ WebSocket tại địa chỉ ws://192.168.0.102:8900 sử dụng thư viện socket.io và lưu trữ nó trong socket.
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
    if (arrivalMessage) {
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
  useEffect(() => {
    //Điều này có nghĩa là server cần nhận userId để biết cuộc trò chuyện nào cần lấy
    const getConversations = async () => {
      try {
        const res = await axios.get(IP + "/api/conversations/userId", { userId: user._id });
        setConversations(res.data);
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
        const res = await axios.post(IP + "/api/messages/conversationId", { conversationid: currentChat._id });
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
    if (!newMessage) return;
    //Tạo đối tượng message: Đoạn mã này tạo một đối tượng tin nhắn với các thuộc tính bao gồm sender (người gửi), 
    // text (nội dung tin nhắn) và conversationId (ID của cuộc trò chuyện hiện tại).
    const message = {
      senderid: user._id,
      content: newMessage,
      conversationid: currentChat._id,
      status: 0
    };

    // Xác định receiverId: Đoạn mã này tìm kiếm receiverId (người nhận tin nhắn) trong danh sách thành viên của currentChat. 
    // Thành viên không phải là người gửi (user._id) sẽ được xác định là người nhận.
    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );
    // Dòng này gửi một sự kiện sendMessage qua socket để thông báo tin nhắn đến người nhận. 
    // Thông điệp này bao gồm senderId (ID của người gửi), receiverId (ID của người nhận) và text (nội dung tin nhắn).

    //giống chỗ này nè mà chỗ receiver là members 
    socket.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      text: newMessage,
    });
    // Gửi tin nhắn: Đoạn mã này gửi tin nhắn đến server thông qua API POST /messages và 
    // sau đó cập nhật danh sách tin nhắn bằng cách thêm tin nhắn mới vào mảng messages.
    //lưu trữ tin nhắn mới vào cơ sở dữ liệu
    try {
      const res = await axios.post(IP + "/api/messages/", message);
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

  return (
    <View style={{ backgroundColor: "#e2e9f1", flex: 1 }}>
      <View style={{ width: "100%", backgroundColor: "#227ffd", flexDirection: "row", padding: 10, marginTop: 25, justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={require("../images/back.png")} style={{ height: 25, width: 25 }} />
          </TouchableOpacity>
          <Text style={{ color: "white", margin: 10, fontSize: 17, fontWeight: 600 }}>{friend.name}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
          <TouchableOpacity><Ionicons name='call-outline' color={"white"} size={20} /></TouchableOpacity>
          <TouchableOpacity><Ionicons name='videocam-outline' color={"white"} size={30} /></TouchableOpacity>
          <TouchableOpacity><Ionicons name='menu' color={"white"} size={30} /></TouchableOpacity>
        </View>
      </View>
      <View style={{ flex: 1, marginBottom: 70 }}>
        <ScrollView ref={scrollRef}>
          {messages.map((item) => {
            if (item.senderid != user._id) {
              if (item.status == 1) {
                //tin nhắn của bạn
                return <View style={{ flexDirection: "row", marginBottom: 10 }} key={uuidv4()}>
                  <Image source={{ uri: friend.avt }} style={{ height: 40, width: 40, borderRadius: 20 }} />
                  <View style={{ marginHorizontal: 10, flex: 0.8 }}>
                    <Text style={{ fontSize: 17, alignSelf: "flex-start", paddingHorizontal: 7, paddingVertical: 10, backgroundColor: "white", borderRadius: 10 }} key={uuidv4()}>
                      Tin nhắn đã bị thu hồi
                    </Text>
                  </View>
                </View>
              }
              else {
                return <View style={{ flexDirection: "row", marginBottom: 10 }} key={uuidv4()}>
                <Image source={{ uri: friend.avt }} style={{ height: 40, width: 40, borderRadius: 20 }} />
                <View style={{ marginHorizontal: 10, flex: 0.8 }}>
                  <Text style={{ fontSize: 17, alignSelf: "flex-start", paddingHorizontal: 7, paddingVertical: 10, backgroundColor: "white", borderRadius: 10 }} key={uuidv4()}>
                    {item.content}
                  </Text>
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
                  <View style={{ marginHorizontal: 10, flex: 0.8 }}>
                    <Text style={{ fontSize: 17, paddingHorizontal: 7, alignSelf: "flex-end", paddingVertical: 10, backgroundColor: "white", borderRadius: 10, backgroundColor: "#d5f1ff", borderWidth: 0.7, borderColor: "lightgrey" }} key={item._id}>
                      {item.content}
                    </Text>
                    {messages.indexOf(item) === messages.length - 1 ? (
                      <Text style={{ alignSelf: "flex-end", color: "grey" }}>
                        {item.isseen ? "Đã xem" : "Đã gửi"}
                      </Text>
                    ) : null}
                  </View>
                </TouchableOpacity>
              else
                return <View>
                  <Text style={{ marginHorizontal: 10, marginBottom: 10, fontSize: 17, paddingHorizontal: 7, alignSelf: "flex-end", paddingVertical: 10, backgroundColor: "white", borderRadius: 10, backgroundColor: "#d5f1ff", borderWidth: 0.7, borderColor: "lightgrey" }} key={item._id}>
                    Tin nhắn đã bị thu hồi
                  </Text>
                </View>
            }
          })
          }

        </ScrollView>
      </View>
      <View style={{ borderTopWidth: 0.5, backgroundColor: "white", height: 70, position: "absolute", left: 0, right: 0, bottom: 0, flexDirection: "row", alignItems: "center", padding: 20, justifyContent: "space-between" }}>
        <TextInput
          placeholder='Tin nhắn'
          style={{ fontSize: 17, flex: 1, }}
          value={newMessage}
          onChangeText={(text) => setNewMessage(text)}
        ></TextInput>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
          <TouchableOpacity><Ionicons name='mic-outline' color={"grey"} size={30} /></TouchableOpacity>
          <TouchableOpacity
            onPress={pickDocument}
          ><Ionicons name='file-tray-full' color={"gold"} size={30} /></TouchableOpacity>
          <TouchableOpacity
            onPress={pickImage}
          ><Ionicons name='image' color={"gold"} size={30} /></TouchableOpacity>
          <TouchableOpacity
            onPress={newMessage != "" ? handleSubmit : null}
          ><Ionicons name='send' color={"black"} size={30} /></TouchableOpacity>
        </View>
      </View>
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
            <View style={{ flexDirection: "row", marginBottom: 10, justifyContent: "flex-end" }}>
              <View style={{ marginHorizontal: 10, flex: 0.8 }}>
                <Text style={{ fontSize: 17, paddingHorizontal: 7, paddingVertical: 10, backgroundColor: "white", borderRadius: 10, backgroundColor: "#d5f1ff", borderWidth: 0.7, borderColor: "lightgrey" }}>
                  {itemModal.content}
                </Text>
              </View>
            </View>}

          <View style={{ backgroundColor: "white", height: 100, borderRadius: 15, flexDirection: "row", alignItems: "center", justifyContent: "space-around" }}>
            <TouchableOpacity style={{ alignItems: "center" }}>
              <Ionicons name='heart' size={40} color={"red"} style={{ margin: 10, alignSelf: "flex-start" }} />
              <Text>Thả tim</Text>
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