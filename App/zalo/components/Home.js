import React, { useContext, useState, useEffect } from 'react';
import { ScrollView, View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { UserContext } from '../context/UserContext ';
import axios from 'axios';
import {IP} from '../IP';

export default function Home({ navigation, route }) {
    const { user, updateUser } = useContext(UserContext);

    const [search, setSearch] = useState('')

    const { phonenumber } = route.params;

    const [friend, setFriend] = useState(null);

    const listfriend = user.friends;

    const [listfriends, setListfriends] = useState([]);

    const getcurrenChat = async (userChat) => {
            const responsecheck = await axios.post(IP+'/api/conversations/getcurrentChat', {
                userId: user._id,
                receiverId: userChat._id
            });
            if (responsecheck.data === null) {
                const responsecreate = await axios.post(IP+'/api/conversations/getnewconv', {
                    senderId: user._id,
                    receiverId: userChat._id
                });
                navigation.push("Chat", { userChat: userChat, currentChat: responsecreate.data })
            } else {
                navigation.push("Chat", { userChat: userChat, currentChat: responsecheck.data })
            }
    }

    //Tìm kiếm user bằng số điện thoại
    useEffect(() => {
        const searchUser = async () => {
            try {
                const response = await axios.post(IP+'/api/users/phonenumber', { phonenumber: search });
                // console.log('Phản hồi từ server:', response.data);
                setFriend(response.data)
            } catch (error) {
                // console.error('Lỗi khi đăng nhập:', error);
                setFriend(null)
            }
        };
        // Gọi fetchData() mỗi khi search thay đổi
        searchUser();
    }, [search])

    const datafriends = async () => {
        for (let i = 0; i < listfriend.length; i++) {
            try {
                const response = await axios.post(IP+'/api/users/user', {
                    userId: listfriend[i]
                });
                setListfriends(prevList => [...prevList, response.data]);
            } catch (error) {
                alert('error get data friends');
            }
        }
    }
    useEffect(() => {
        datafriends();
    }, []);
    return (
        <View style={{ backgroundColor: "#f3f4f6", flex: 1 }}>

            <View style={{ width: "100%", backgroundColor: "#227ffd", flexDirection: "row", padding: 10, marginTop: 25, justifyContent: "space-between" }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TouchableOpacity>
                        <Ionicons name='search' size={25} color={"white"}></Ionicons>
                    </TouchableOpacity>
                    <TextInput
                        value={search}
                        onChangeText={setSearch}
                        style={{ fontSize: 17, padding: 10, color: "white" }}
                        placeholder='Tìm kiếm' placeholderTextColor={"lightgrey"}
                    />
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
                    <TouchableOpacity><Ionicons name='qr-code' color={"white"} size={20} /></TouchableOpacity>
                    <TouchableOpacity><Ionicons name='add-outline' color={"white"} size={30} /></TouchableOpacity>
                </View>
            </View>
            <ScrollView>
                {listfriends.map((item) =>
                    <TouchableOpacity key={item._id} style={{ flexDirection: "row", backgroundColor: "white" }}
                        onPress={() => getcurrenChat(item)}>
                        <Image source={{ uri: item.avatarpicture }} style={{ height: 60, width: 60, borderRadius: 30, margin: 10 }} />
                        <View key={item} style={{ flex: 1, padding: 10, gap: 10, borderBottomWidth: 0.3, borderBottomColor: "lightgrey", borderBlockColor: "grey" }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                <Text style={{ fontSize: 18, fontWeight: 600 }}>{item.username}</Text>
                            </View>
                            <Text style={{ color: "grey" }} numberOfLines={1}></Text>
                        </View>
                    </TouchableOpacity>
                )}
            </ScrollView>
            {friend != null ?
                <TouchableOpacity style={{ position: "absolute", top: 80, backgroundColor: "white", width: "80%", alignSelf: "center", padding: 10, flexDirection: "row", gap: 10, alignItems: "center", borderRadius: 10, borderWidth: 1, borderColor: "lightgrey" }}
                    onPress={() => {
                        setSearch("")
                        navigation.push("Profile_friend", { friend, phonenumber })
                    }}
                >
                    <Image source={{ uri: friend.avatarpicture }} style={{ height: 30, width: 30, borderRadius: 15, backgroundColor: "white" }} />
                    <View>
                        <Text style={{ fontSize: 17, fontWeight: 500 }}>
                            {friend.username}
                        </Text>
                        <Text style={{ fontSize: 17, fontWeight: 500, color: "grey" }}>
                            Số điện thoại: {friend.phonenumber}
                        </Text>
                    </View>
                </TouchableOpacity>
                : <Text></Text>
            }
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