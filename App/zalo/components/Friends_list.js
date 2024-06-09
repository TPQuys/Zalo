import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ScrollView, View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Pressable, FlatList, RefreshControl } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';
import { IP } from '../IP';


export default function Chat({ navigation, route }) {
    const phonenumber = route.params.phonenumber
    const [list, setList] = useState([])
    const [listGroups, setListGroups] = useState([])
    const [showFriendsView, setShowFriendsView] = useState(route.params.groupShow != true ? true : false);
    const friendsViewRef = useRef(null);
    const [friend, setFriend] = useState(null);
    const [search, setSearch] = useState('')
    const groupsViewRef = useRef(null);
    const [refreshing, setRefreshing] = useState(false);
    useEffect(() => {
        const getList = async () => {
            try {
                const response = await axios.post(IP + '/api/users/friends/', { phonenumber: phonenumber });
                // const responseGrops = await axios.post(IP+'/api/group/list',{userId:response.data._id.toString()})
                // console.log('Phản hồi từ server:', response);
                setList(response.data)
            } catch (error) {
                console.error('Lỗi lẫy danh sách bạn bè:', error);
                // setFriend(null)
            }
        };
        // Gọi fetchData() mỗi khi search thay đổi
        getList();
    }, [])

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        console.log("reflesh")
        getListGroup()
        setTimeout(() => {
          setRefreshing(false);
        }, 1000);
      }, []);

    const getcurrenChatGroup = async (group) => {
        const responsecheck = await axios.post(IP + '/api/conversations/getcurrentGroup', {
            groupid: group._id,
        });
        if (responsecheck.data === null) {
            const responsecreate = await axios.post(IP + '/api/conversations/getnewconvGroup', {
                groupid: group._id,
            });
            navigation.navigate("ChatGroup", { userChat: group, currentChat: responsecreate.data })
        } else {
            navigation.push("ChatGroup", { userChat: group, currentChat: responsecheck.data })
        }
    }
    const getListGroup = async () => {
        try {
            const response = await axios.post(IP + '/api/users/phonenumber', { phonenumber: phonenumber });
            // console.log('Phản hồi từ server:', response.data);
            const responsegroup = await axios.post(IP + '/api/group/list', { userId: response.data._id.toString() });
            // console.log(responsegroup.data)
            setListGroups(responsegroup.data)
        } catch (error) {
            console.error('Lỗi tìm user:', error);

        }
    };
    useEffect(() => {
        
        // Gọi fetchData() mỗi khi search thay đổi
        getListGroup();
    }, [])

    const handleToggleView = (boolean) => {
        setShowFriendsView(boolean);
    };

    useEffect(() => {
        const searchUser = async () => {
            try {
                const response = await axios.post(IP + '/api/users/phonenumber', { phonenumber: search });
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
            {friend != null ?
                <TouchableOpacity style={{ position: "absolute", top: 80, backgroundColor: "white", width: "80%", alignSelf: "center", padding: 10, flexDirection: "row", gap: 10, alignItems: "center", borderRadius: 10, borderWidth: 1, borderColor: "lightgrey", zIndex: 1 }}
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
                : null
            }
            <View style={{flex:1}}>
                <View style={{ backgroundColor: "white" }}>

                    <View style={{ flexDirection: "row", borderWidth: 1, borderColor: "lightgrey" }}>
                        <TouchableOpacity
                            onPress={() => handleToggleView(true)}
                            style={{ padding: 15, alignSelf: "flex-start", flex: 1, alignItems: "center", backgroundColor: showFriendsView ? "lightgrey" : "white" }}>
                            <Text>Bạn bè</Text>
                        </TouchableOpacity>
                        <View style={{ width: 0.5, height: "60%", borderWidth: 0.5, borderColor: "lightgrey", alignSelf: "center" }} />
                        <TouchableOpacity
                            onPress={() => handleToggleView(false)}
                            style={{ padding: 15, alignSelf: "flex-start", flex: 1, alignItems: "center", backgroundColor: !showFriendsView ? "lightgrey" : "white" }}>
                            <Text>Nhóm</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{flex:1}}>
                    {showFriendsView ? (
                        <View ref={friendsViewRef} >
                            <TouchableOpacity
                                onPress={() => navigation.navigate("FriendRequest", phonenumber)}
                                style={{ borderRadius: 15, alignSelf: "flex-start", padding: 15, backgroundColor: "white", marginBottom: 10, width: "100%", flexDirection: "row" }}
                            >
                                <Ionicons name='people' color={"white"} size={25} style={{ backgroundColor: "#227ffd", padding: 10, borderRadius: 15 }} />
                                <Text style={{ fontWeight: 600, fontSize: 17, alignSelf: "center", margin: 10 }}>Lời mời kết bạn</Text></TouchableOpacity>
                            <ScrollView>

                                {list.map((item) =>
                                    <TouchableOpacity key={item._id} style={{ flexDirection: "row", backgroundColor: "white" }}
                                        onPress={async () => {
                                            const response = await axios.post(IP + '/api/users/phonenumber', { phonenumber: item.phonenumber });
                                            console.log(response.data)
                                            navigation.push("Profile_friend", { friend: response.data, phonenumber })
                                        }}>
                                        <Image source={{ uri: item.avatarpicture }} style={{ height: 60, width: 60, borderRadius: 30, margin: 10 }} />
                                        <View style={{ flex: 1, padding: 10, gap: 10, borderBottomWidth: 0.3, borderBottomColor: "lightgrey", borderBlockColor: "grey" }}>
                                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                <Text style={{ fontSize: 18, fontWeight: 600 }}>{item.username}</Text>
                                                {/* <Text style={{}}>{item.phonenumber} giờ</Text> */}
                                            </View>
                                            {/* <Text style={{ color: "grey" }} numberOfLines={1}>{item.message}</Text> */}
                                        </View>
                                    </TouchableOpacity>
                                )}
                            </ScrollView>
                        </View>
                    ) : (
                        <View ref={groupsViewRef} style={{flex:1}}>
                            <TouchableOpacity
                                onPress={() => navigation.push("GroupCreate", { phonenumber: phonenumber, list: list })}
                                style={{ borderRadius: 15, alignSelf: "flex-start", padding: 15, backgroundColor: "white", marginBottom: 10, width: "100%", flexDirection: "row" }}
                            >
                                <Ionicons name='add-circle' color={"white"} size={25} style={{ backgroundColor: "#227ffd", padding: 10, borderRadius: 20 }} />
                                <Text style={{ fontWeight: 600, fontSize: 17, alignSelf: "center", margin: 10 }}>Tạo nhóm</Text></TouchableOpacity>
                            <View style={{flex:1,overflow:'visible'}}>
                                <FlatList data={listGroups} 
                                renderItem={({item})=>
                                        <TouchableOpacity key={item._id} style={{ flexDirection: "row", backgroundColor: "white" }} onPress={
                                            () => getcurrenChatGroup(item)
                                        }>
                                            <Image source={{ uri: item.grouppicture }} style={{ height: 60, width: 60, borderRadius: 30, margin: 10 }} />
                                            <View style={{ flex: 1, padding: 10, gap: 10, borderBottomWidth: 0.3, borderBottomColor: "lightgrey", borderBlockColor: "grey" }}>
                                                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                    <Text style={{ fontSize: 18, fontWeight: 600 }}>{item.groupname}</Text>
                                                    <Text style={{}}>Thành viên: {item.members.length}</Text>
                                                </View>
                                                {/* <Text style={{ color: "grey" }} numberOfLines={1}>{item.message}</Text> */}
                                            </View>
                                        </TouchableOpacity>
                                }
                                onEndReachedThreshold={0.1}
                                style={{flex:1}}
                                refreshControl={
                                    <RefreshControl refreshing={refreshing}
                                    onRefresh={onRefresh}/>
                                }
                                />
                            </View>
                        </View>
                    )}
                    <TouchableOpacity title="Toggle View" onPress={handleToggleView} />
                </View>

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