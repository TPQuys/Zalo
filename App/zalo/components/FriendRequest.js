import React, { useEffect, useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';
import { IP } from '../IP';



export default function Login({ navigation, route }) {
    const phonenumber = route.params
    console.log(phonenumber)
    const [request, setRequest] = useState([])
    const [requests, setRequests] = useState([])
    console.log("tet")
    // const [username, setUsername] = useState('');

    const fetchData = async () => {
        try {
            const response = await axios.post(IP + '/api/requestAddFriend/list', {
                recieveid: phonenumber,
            });
            console.log('Phản hồi từ server:', response.data);
            const requests = response.data.map(async (item) => {
                try {
                    console.log(item)
                    const userResponse = await axios.post(IP + '/api/users/phonenumber', { phonenumber: item.senderid });
                    console.log('Phản hồi từ server 2:', userResponse.data);
                    return userResponse.data;
                } catch (error) {
                    console.error('null:', error);
                    return null;
                }
            });
            const userList = await Promise.all(requests);
            setRequests(userList.filter(user => user !== null));
        } catch (error) {
            console.error('Lỗi:', error);
        }
    };

    useEffect(() => {
        

        fetchData();
    }, []);
    const setFriend = async (item) => {
        console.log(item);
        try {
            const updateRequestAddFriend = axios.put(IP + '/api/requestAddFriend/update', {
                senderid: item.phonenumber,
                recieveid: phonenumber
            });

            const updateUserAddFriend = axios.put(IP + '/api/users/update/addFriend', {
                uphonenumber: phonenumber,
                fphonenumber: item.phonenumber
            });

            await Promise.all([updateRequestAddFriend, updateUserAddFriend]);
            alert("Kết bạn thành công")
            console.log('Both requests have been completed successfully.');
            setRequests(prevRequests => prevRequests.filter(request => request.senderid !== item.senderid));

        } catch (error) {
            console.error('Lỗi khi thực hiện yêu cầu:', error);
            // Xử lý lỗi nếu cần thiết
        }
    };

    return (
        <View style={{ backgroundColor: "white", flex: 1, top: 25 }}>
            <View style={{ width: "100%", backgroundColor: "#227ffd", flexDirection: "row", padding: 10, alignItems: "center" }}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.push('HomeTabs', { Screen: 'Friends_list', params: { phonenumber: phonenumber } });
                    }}
                >
                    <Ionicons name='arrow-back' size={24} color={"white"}></Ionicons>
                </TouchableOpacity>
                <Text style={{ color: "white", margin: 10, fontSize: 17, fontWeight: 600 }}>Lời mời kết bạn</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                <TouchableOpacity style={{ borderBottomWidth: 2, paddingHorizontal: 30, padding: 10 }}>
                    <Text style={{ fontSize: 18, fontWeight: 600 }}>
                        Đã nhận
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ borderBottomWidth: 2, paddingHorizontal: 30, padding: 10 }}>
                    <Text style={{ fontSize: 18, fontWeight: 600 }}>
                        Đã gửi
                    </Text>
                </TouchableOpacity>
            </View>
            <View>
                <FlatList
                    style={{backgroundColor:"red"}}
                    data={requests}
                    renderItem={({ item }) => <View key={item.phonenumber} style={{ flexDirection: "row", backgroundColor: "white" }} onPress={() => navigation.push("Chat")}>
                        <Image source={{ uri: item.avatarpicture }} style={{ height: 40, width: 40, borderRadius: 20, margin: 10, alignSelf: "center" }} />
                        <View style={{ flex: 1, padding: 10, gap: 10, borderBlockColor: "grey" }}>
                            <View style={{ justifyContent: "center" }}>
                                <Text style={{ fontSize: 18, fontWeight: 600 }}>{item.username}</Text>
                                <Text style={{ fontSize: 15, color: "grey", fontWeight: 600 }}>{item.phonenumber}</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={{ alignSelf: "center", backgroundColor: "lightgrey", padding: 7, borderRadius: 7, margin: 10 }}
                            onPress={() => {
                                setFriend(item)
                            }}
                        >
                            <Text>
                                Đồng ý
                            </Text>
                        </TouchableOpacity>
                    </View>
                    }
                    onScrollToTop={()=>console.log("test")}
                    onEndReachedThreshold={0.1}
                >
                </FlatList>
            </View>
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