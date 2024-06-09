import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { IP } from '../IP';
import * as ImagePicker from 'expo-image-picker';
import { UserContext } from '../context/UserContext ';
import axios from 'axios';
import { RadioButton } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker'

export default function Login({ navigation, route }) {
    const [friend,setFriend] = useState(route.params.friend)
    const { user, updateUser } = useContext(UserContext);
    const phoneNumber = route.params.phonenumber
    const [check, setCheck] = useState(-1)
    const [dob, setDob] = useState(new Date(friend.birth))
    const [updateView, setUpdateView] = useState(false)
    const [name, setName] = useState(friend.username)
    const [gender, setGender] = useState(friend.gender)
    const [avatarpicture,setAvatarpicture] = useState(friend.avatarpicture)
    // const [birth, setBirth] = useState((day < 10 ? "0" + day : day) + "/" + (month < 10 ? "0" + month : month) + "/" + year)
    const [show, setShow] = useState(false)

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || dob;
        setShow(false);
        setDob(new Date(currentDate));
    }
    const addFriend = async (event) => {

        event.preventDefault();
        try {
            const response = await axios.post(IP + '/api/requestAddFriend/', {
                senderid: phoneNumber,
                recieveid: friend.phonenumber
            });
            setCheck(0)
            // alert(response.data)
            console.log('Phản hồi từ server:', response.data);
        } catch (error) {
            console.error('Lỗi khi kết bạn:', error);
            setCheck(-1)
        }
    };
    const unFriend = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.put(IP + '/api/requestAddFriend/update/unfriend', {
                friendId: phoneNumber,
                userId: friend.phonenumber
            });
            setCheck(response.data)
        } catch (error) {
            console.error('Lỗi khi xóa kết bạn:', error);
            setCheck(-1)
        }
    };

    const updateInfo = async () =>{
        try {
            const response = await axios.put(IP + '/api/users/update/info', {
                userId: friend._id,
                username:name,
                gender:gender,
                birth:dob,
                avatarpicture:avatarpicture
            });
            setFriend(response.data)
            updateUser(response.data)
            setUpdateView(false)
            console.log("update ", response.data)
        } catch (error) {
            console.error('Lỗi khi thay đổi thông tin:', error);
            setCheck(-1)
        }
    }

    useEffect(() => {
        const checkU = async () => {
            try {
                const response = await axios.post(IP + '/api/requestAddFriend/check', {
                    senderid: phoneNumber,
                    recieveid: friend.phonenumber
                });
                setCheck(response.data)
                console.log('Phản hồi từ server:', response.data);
            } catch (error) {
                // console.error('Lỗi kết bạn:', error);
                setCheck(-1)
            }
        }
        checkU()
        // alert(check)
    }, [])


    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
          alert('Permission Denied', 'Permission to access camera roll is required!');
          return;
        }
    
        const pickerResult = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 4],
          quality: 1,
        });
        if (pickerResult.cancelled === true) {
          return;
        }
    
        uploadMedia(pickerResult.assets[0].uri, pickerResult.assets[0].mimeType, pickerResult.assets[0].type);
        console.log(pickerResult.assets[0]);
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
          console.log(response.data.url)
          setAvatarpicture(response.data.url)
        } catch (error) {
          console.error('Lỗi upload media', error);
        }
      };

    return (
        <View style={{ backgroundColor: "white", flex: 1 }}>
            <ImageBackground source={require("../images/background.png")} style={{ width: "100%", alignSelf: "center", flex: 0.3 }}>
                <View style={{ marginTop: 20, padding: 10, flexDirection: "row", justifyContent: "space-between" }}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.push('HomeTabs', { Screen: 'Home', params: { phonenumber: phoneNumber } });
                        }}
                    >
                        <Ionicons name='arrow-back' size={25} color={"white"} style={{ margin: 10 }} />
                    </TouchableOpacity>
                    <View style={{ flexDirection: "row", gap: 15 }}>
                        <TouchableOpacity>
                            <Ionicons name='time-outline' size={25} color={"white"} style={{ margin: 10 }} />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Ionicons name='menu' size={25} color={"white"} style={{ margin: 10 }} />
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
            <View style={{ backgroundColor: "#f1f2f6", flex: 1 }}>
                <View style={{ alignItems: "center" }} >
                    <TouchableOpacity>
                        <Image source={{ uri: friend.avatarpicture }} style={{ height: 160, width: 160, borderRadius: 80, borderWidth: 5, borderColor: "white", bottom: 80, backgroundColor: "white" }} />
                    </TouchableOpacity>
                    <Text style={{ bottom: 60, fontSize: 25, fontWeight: 600 }}>{friend.username}</Text>
                </View>
                <View style={{ margin: 15, padding: 20, borderRadius: 15, backgroundColor: "white", gap: 20, bottom: 50 }}>
                    <View style={{ gap: 25 }}>
                        <Text style={{ fontSize: 20, fontWeight: 600 }}>Thông tin cá nhân:</Text>
                        <View style={{ flexDirection: "row", borderBottomWidth: 1, borderColor: "lightgrey" }}>
                            <Text style={{ width: 100, fontSize: 17 }}>Giới tính</Text>
                            <Text>{friend.gender == 0 ? "Nam" : "Nữ"}</Text>
                        </View>
                        <View style={{ flexDirection: "row", borderBottomWidth: 1, borderColor: "lightgrey" }}>
                            <Text style={{ width: 100, fontSize: 17 }}>Ngày sinh</Text>
                            <Text>{(dob.getDate() < 10 ? "0" + dob.getDate() : dob.getDate()) + "/" + (dob.getMonth()+1 < 10 ? "0" + (dob.getMonth() + 1) : dob.getMonth()) + "/" + dob.getFullYear()}</Text>
                        </View>
                        <View style={{ flexDirection: "row", borderBottomWidth: 1, borderColor: "lightgrey" }}>
                            <Text style={{ width: 100, fontSize: 17 }}>Điện thoại</Text>
                            <Text>{friend.phonenumber}</Text>
                        </View>
                    </View>
                    {friend._id !== user._id ?
                        <View>
                            {check == -1 ?
                                <TouchableOpacity
                                    onPress={addFriend}
                                >
                                    <Text style={{ borderRadius: 15, borderWidth: 0.5, borderColor: "lightgrey", paddingHorizontal: 100, padding: 15, alignSelf: "center", backgroundColor: "lightgrey", fontWeight: 500, fontSize: 17 }}><Ionicons name='person-add-outline' size={17} /> Kết bạn</Text>
                                </TouchableOpacity> :
                                (check == 0 ?
                                    <Text>Đã gửi lời mời kết bạn</Text> :
                                    <TouchableOpacity
                                        onPress={unFriend}
                                    >
                                        <Text style={{ borderRadius: 15, borderWidth: 0.5, borderColor: "lightgrey", paddingHorizontal: 100, padding: 15, alignSelf: "center", backgroundColor: "lightgrey", fontWeight: 500, fontSize: 17 }}><Ionicons name='person-remove-outline' size={17} /> Hủy kết bạn</Text>
                                    </TouchableOpacity>
                                )
                            }
                        </View>
                        : <View>
                            <TouchableOpacity
                                onPress={() => setUpdateView(true)}
                            >
                                <Text style={{ borderRadius: 15, borderWidth: 0.5, borderColor: "lightgrey", paddingHorizontal: 100, padding: 15, alignSelf: "center", backgroundColor: "lightgrey", fontWeight: 500, fontSize: 17 }}><Ionicons name='pencil-outline' size={17} />Chỉnh sửa</Text>
                            </TouchableOpacity>

                        </View>}
                </View>
            </View>
            {updateView ?
                <View style={{ position: "absolute", alignSelf: "center", backgroundColor: "white", height: "100%", width: "100%", zIndex: 2, margin: 25 }}>
                    <View style={{ width: "100%", backgroundColor: "#227ffd", flexDirection: "row", padding: 10, alignItems: "center" }}>
                        <TouchableOpacity
                            onPress={() => {
                                setUpdateView(false)
                            }}
                        >
                            <Ionicons name='arrow-back' size={25} color={"white"} />
                            {/* <Image source={require("../images/back.png")} style={{ height: 25, width: 25 }} /> */}
                        </TouchableOpacity>

                        <Text style={{ color: "white", margin: 10, fontSize: 17, fontWeight: 600 }}>Chỉnh sửa thông tin</Text>
                    </View>
                    <View>
                        <View style={{ flexDirection: "row" }}>
                            <TouchableOpacity
                            onPress={pickImage}
                            >
                                <Image source={{ uri: avatarpicture }} style={{ height: 100, width: 100, borderRadius: 80, borderWidth: 5, borderColor: "white", backgroundColor: "white", margin: 15 }} />
                            </TouchableOpacity>
                            <View style={{ top: 30, gap: 20 }}>
                                <TextInput style={{ fontSize: 17 }} value={name} onChangeText={setName} />
                                <TouchableOpacity
                                    onPress={() => {
                                        setShow(true)
                                    }}
                                ><Text style={{ fontSize: 17 }}>{(dob.getDate() < 10 ? "0" + dob.getDate() : dob.getDate()) + "/" + (dob.getMonth()+1 < 10 ? "0" + (dob.getMonth() + 1) : dob.getMonth()) + "/" + dob.getFullYear()}</Text></TouchableOpacity>
                                <View style={{ flexDirection: "row", gap: 30 }}>
                                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                                        <RadioButton
                                            value="first"
                                            status={gender === 0 ? 'checked' : 'unchecked'}
                                            onPress={() => setGender(0)}
                                        />
                                        <Text>Nam</Text>
                                    </View>
                                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                                        <RadioButton
                                            value="second"
                                            status={gender === 1 ? 'checked' : 'unchecked'}
                                            onPress={() => setGender(1)}
                                        />
                                        <Text>Nữ</Text>
                                    </View>
                                </View>

                            </View>

                        </View>
                        {show && (<DateTimePicker mode='date' display='spinner' value={dob} onChange={onChange} />)}
                    </View>
                    <TouchableOpacity style={{ backgroundColor: "#227ffd", top: 50, alignSelf: "center", width: "70%", borderRadius: 15, alignItems: "center", padding: 5 }}
                    onPress={()=>updateInfo()}
                    >
                        <Text style={{ fontSize: 17, color: "white" }}>Lưu</Text>
                    </TouchableOpacity>
                </View>
                : null}
        </View>
    );
}
const styles = StyleSheet.create({

});