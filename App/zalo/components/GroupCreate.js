import React, { useEffect, useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, ScrollView, } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Checkbox } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { IP } from '../IP';

export default function Register_name({ navigation, route }) {
    const [name, setName] = useState('');
    const [user, setUser] = useState({});
    const [grouppicture, setGrouppicture] = useState("https://res.cloudinary.com/dctyqb6u1/image/upload/v1713726106/ioa22glxiqgkie43s0d9.png")
    const list = route.params.list
    const phonenumber = route.params.phonenumber
    // console.log(phonenumber)
    const [selectedItems, setSelectedItems] = useState([]);
    useEffect(() => {
        const searchUser = async () => {
            try {
                const response = await axios.post(IP + '/api/users/phonenumber', { phonenumber: phonenumber });
                // console.log('Phản hồi từ server:', response.data);
                setUser(response.data)
                setSelectedItems([response.data._id.toString()])
            } catch (error) {
                console.error('Lỗi tìm user:', error);
            }
        };
        // Gọi fetchData() mỗi khi search thay đổi
        searchUser();
    }, [])
    const toggleItemSelection = (itemId) => {
        console.log(selectedItems)
        let updatedSelection = [...selectedItems];
        if (updatedSelection.includes(itemId)) {
            updatedSelection = updatedSelection.filter((id) => id !== itemId);
        } else {
            updatedSelection.push(itemId);
        }
        console.log(updatedSelection)
        setSelectedItems(updatedSelection);
    };

    const createGroup = async () => {
        try {
            const response = await axios.post(IP + '/api/group/', {
                groupname: name,
                grouppicture: grouppicture,
                members: selectedItems,
                createby: user._id.toString()
            });
            // Xử lý phản hồi từ server nếu cần
            navigation.push('HomeTabs', { Screen: 'Friends_list', params: { phonenumber: phonenumber, groupShow: true } });
            console.log('Phản hồi từ server:', response.data);
        } catch (error) {
            // Xử lý lỗi nếu có
            console.error('Lỗi khi đăng ký:', error);
        }
    };
    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        console.log(1)
        if (permissionResult.granted === false) {
        console.log(2)
        alert('Permission Denied', 'Permission to access camera roll is required!');
          return;
        }
        console.log(3)
    
        const pickerResult = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 4],
          quality: 1,
        });
        console.log(4)
        console.log(pickerResult)
        if (pickerResult.cancelled === true) {
          return;
        }
    
        uploadMedia(pickerResult.assets[0].uri, pickerResult.assets[0].mimeType, pickerResult.assets[0].type);
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
        //   console.log("FormData", formData);
          const response = await axios.post(IP + '/api/uploadImage/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          console.log(response.data)
          setGrouppicture(response.data.url)
        } catch (error) {
          console.error('Lỗi upload media', error);
        }
      };
    return (
        <View style={{ backgroundColor: "white", flex: 1 }}>
            <View style={{ width: "100%", backgroundColor: "#227ffd", flexDirection: "row", padding: 10, alignItems: "center", marginTop: 25 }}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.goBack()
                    }}
                >
                    <Image source={require("../images/back.png")} style={{ height: 25, width: 25 }} />
                </TouchableOpacity>
                <Text style={{ color: "white", margin: 10, fontSize: 17, fontWeight: 600 }}>Nhóm mới</Text>
            </View>
            <View style={{ padding: 15, gap: 30 , flexDirection:"row"}}>
                <TouchableOpacity style={{height:60,width:60,borderWidth:1,borderRadius:30,justifyContent:"center",alignItems:'center',backgroundColor:"lightgrey"}}
                onPress={pickImage}
                >   
                    {!grouppicture?<Text style={{textAlign:"center"}}>
                        Chọn ảnh
                    </Text>:
                    <Image source={{uri:grouppicture}} style={{height:60,width:60,borderRadius:30}}/>
                    }
                </TouchableOpacity>
                <TextInput style={{ borderBottomWidth: 2, borderBottomColor: "lightgrey", fontSize: 20, padding: 5 }}
                    placeholder='Đặt tên nhóm' placeholderTextColor={"lightgray"}
                    value={name}
                    onChangeText={text => setName(text)}
                />
            </View>
            <ScrollView>
                {list.map((item) => {
                    const checked = selectedItems.includes(item._id.toString());
                    return <View key={item._id} style={{ flexDirection: "row", backgroundColor: "white", padding: 5 }}>
                        <Image source={{ uri: item.avatarpicture }} style={{ height: 60, width: 60, borderRadius: 30, margin: 10 }} />
                        <View style={{ flex: 1, padding: 10, gap: 10, borderBottomWidth: 0.3, borderBottomColor: "lightgrey", borderBlockColor: "grey" }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                <Text style={{ fontSize: 18, fontWeight: 600 }}>{item.username}</Text>
                            </View>
                        </View>
                        <View style={{ alignSelf: "center" }}>
                            <Checkbox
                                status={checked ? 'checked' : 'unchecked'}
                                onPress={() => toggleItemSelection(item._id.toString())}
                            />
                        </View>
                    </View>
                }
                )}
            </ScrollView>
            <View>

            </View>
            <TouchableOpacity style={{ position: "absolute", right: 30, bottom: 30, backgroundColor: "#227ffd", width: 50, height: 50, borderRadius: 50, alignItems: "center", justifyContent: "center" }}
                onPress={() => {
                    if (name.trim() !== "") {
                        if (selectedItems.length > 2) {
                            alert("tạo nhóm thành công")
                            createGroup()
                        } else {
                            alert("Hãy chọn ít nhất 2 thành viên để tạo nhóm")
                        }
                    }
                    else {
                        alert("Hãy nhập tên nhóm")
                    }
                }}
            >
                <Ionicons name='arrow-forward' size={25} color={"white"} />
            </TouchableOpacity>
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