import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Modal, ScrollView, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { UserContext } from '../context/UserContext ';
import { IP } from '../IP';
import axios from 'axios';
import { Checkbox } from 'react-native-paper';

export default function Login({ navigation, route }) {
    const [group, setGroup] = useState(route.params.group)
    const phonenumber = route.params.phonenumber
    const { user, updateUser } = useContext(UserContext);
    const [name, setName] = useState("");
    const [friendList, setFriendList] = useState([])
    const [renameView, setRenameView] = useState(false)
    const [confirm, setConfirm] = useState(false)
    const [memberView, setMemberView] = useState(false)
    const [addMemberView, setAddMemberView] = useState(false)
    const [members, setMembers] = useState([])
    const [memberSelected, setMemberSelected] = useState({})
    const [selectedItems, setSelectedItems] = useState([])
    const [memberOption, setMemberOption] = useState(false)
    const [confirmContent, setConfirmContent] = useState("")
    // console.log(user)
    const membersList = async () => {
        try {
            const response = await axios.post(IP + '/api/group/members/list', { groupId: group._id });
            setMembers(response.data)
            // console.log(response.data)
        } catch (error) {
            // console.error('Lỗi lấy thành viên', error);
        }
    }
    const friendsList = async () => {
        try {
            const response = await axios.post(IP + '/api/group/members/orther', { groupId: group._id, phonenumber });
            let list = response.data;
            console.log(list)
            setFriendList(response.data)
            // console.log(response.data)
        } catch (error) {
            navigation.push('HomeTabs', { Screen: 'Friends_list', params: { phonenumber: phonenumber, groupShow: true } });
            // console.error('Lỗi lấy danh sách bạn bè:', error);
        }
    }
    useEffect(() => {
        membersList()
        friendsList()
    }, [phonenumber])
    //đổi tên
    const rename = async () => {
        try {
            const response = await axios.post(IP + '/api/group/rename', { name, groupId: group._id });
            setGroup(response.data)
            setName("")
            setRenameView(false)
        } catch (error) {
            console.error('Lỗi tìm user:', error);
        }
    }
    //thêm thành viên
    const addMember = async () => {
        try {
            const response = await axios.post(IP + '/api/group/member/add', { groupId: group._id, members: selectedItems });
            console.log(response.data)
            setAddMemberView(false)
            membersList()
            friendsList()
            setSelectedItems([])
        } catch (error) {
            console.error('Lỗi tìm user:', error);
        }
    }

    //Rời nhóm
    const leaveGroup = async () => {
        try {
            const response = await axios.post(IP + '/api/users/phonenumber', { phonenumber: phonenumber });
            // console.log('Phản hồi từ server:', response.data);
            const responsegroup = await axios.post(IP + '/api/group/leave',
                {
                    userId: response.data._id.toString(),
                    groupId: group._id,
                });
            // console.log(responsegroup.data)
            navigation.push('HomeTabs', { Screen: 'Friends_list', params: { phonenumber: phonenumber, groupShow: true } });
        } catch (error) {
            console.error('Lỗi rời nhóm:', error);
        }
    }
    //chọn checkbox
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

    //Xóa member 
    const remove = async () => {
        try {
            const response = await axios.post(IP + '/api/group/member/remove', { groupId: group._id, userId: user._id.toString(), memberId: memberSelected._id });
            console.log(response.data)
            membersList()
            friendsList()
            setMemberOption(false)
            alert(response.data)

        } catch (error) {
            // alert(error)
            console.log(error)
            alert("Bạn không thể mời bản thân ra khỏi nhóm")
        }
    }
    const changeAdmin = async () => {
        try {
            const response = await axios.post(IP + '/api/group/changeAdmin', { groupId: group._id, userId: user._id.toString(), memberId: memberSelected._id });
            console.log(response.data)
            membersList()
            friendsList()
            setMemberOption(false)
            setGroup(response.data)
            alert("Đổi nhóm trưởng thành công")
        } catch (error) {
            // alert(error)
            console.log(error)
            alert("Bạn đang là trưởng nhóm")
        }
    }
    const removeGroup = async () => {
        try {
            const response = await axios.post(IP + '/api/group/remove', { groupId: group._id, userId: user._id.toString()});
            console.log(response.data)
            navigation.push('HomeTabs', { Screen: 'Friends_list', params: { phonenumber: phonenumber, groupShow: true } });
            alert(response.data)

        } catch (error) {
            console.log(error)
            alert("Bạn phải là trưởng nhóm")
        }
    }
    return (
        <View style={{ backgroundColor: "#f3f4f6", flex: 1, marginTop: 25 }}>

            <View style={{ width: "100%", backgroundColor: "#227ffd", flexDirection: "row", padding: 10, alignItems: "center" }}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.goBack()
                        // navigation.push('HomeTabs', { Screen: 'Friends_list', params: { phonenumber: phonenumber, groupShow: true } });
                    }}
                >
                    <Image source={require("../images/back.png")} style={{ height: 25, width: 25 }} />
                </TouchableOpacity>

                <Text style={{ color: "white", margin: 10, fontSize: 17, fontWeight: 600 }}>Tùy chọn</Text>
            </View>{renameView ?
                <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', height: "100%", width: "100%", position: "absolute", zIndex: 2, justifyContent: "center" }}>
                    <View style={{ position: "absolute", alignSelf: "center", backgroundColor: "white", height: 200, width: 280,borderRadius:15}}>
                        <Text style={{ fontSize: 20, margin: 16, fontWeight: 600 }}>Đổi tên nhóm</Text>
                        <TextInput style={{ fontSize: 17, margin: 16 }} placeholder='Nhập tên mới' value={name} onChangeText={setName} />
                        <View style={{ alignSelf: "flex-end", flexDirection: "row", gap: 40, margin: 20 }}>
                            <TouchableOpacity onPress={() => setRenameView(false)}>
                                <Text style={{ fontSize: 17 ,color:"grey"}}>Huỷ</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    if (name.trim() !== "")
                                        rename()
                                }}
                            >
                                <Text style={{ fontSize: 17, color:"#227ffd" }}>Đồng ý</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View> : null
            }{confirm ?
                <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', height: "100%", width: "100%", position: "absolute", zIndex: 10, justifyContent: "center" }}>
                    <View style={{ position: "absolute", alignSelf: "center", backgroundColor: "white",  width: 280,borderRadius:15 }}>
                        <Text style={{ fontSize: 20, margin: 16, fontWeight: 600 }}>{confirmContent}</Text>
                        <View style={{ alignSelf: "flex-end", flexDirection: "row", gap: 40, margin: 20, marginTop: 50 }}>
                            <TouchableOpacity onPress={() => setConfirm(false)}>
                                <Text style={{ fontSize: 17 ,color:"grey"}}>Huỷ</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    if (confirmContent=== "Mời " + memberSelected.username + " ra khỏi nhóm?") {
                                        remove()
                                        setConfirm(false)
                                    }else if (confirmContent=== "Mời " + memberSelected.username + " làm trưởng nhóm?") {
                                        changeAdmin()
                                        setConfirm(false)
                                    } else if(confirmContent==="Giải tán nhóm " + group.groupname+"")
                                    {
                                        removeGroup()
                                        setConfirm(false)
                                    }
                                    else
                                        leaveGroup()
                                }}
                            >
                                <Text style={{ fontSize: 17, color:"#227ffd" }}>Đồng ý</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View> : null
            }
            {memberView ?
                <View style={{ position: "absolute", alignSelf: "center", backgroundColor: "white", height: "100%", width: "100%", zIndex: 2 }}>
                    <View style={{ width: "100%", backgroundColor: "#227ffd", flexDirection: "row", padding: 10, alignItems: "center" }}>
                        <TouchableOpacity
                            onPress={() => {
                                setMemberView(false)
                            }}
                        >
                            <Image source={require("../images/back.png")} style={{ height: 25, width: 25 }} />
                        </TouchableOpacity>

                        <Text style={{ color: "white", margin: 10, fontSize: 17, fontWeight: 600 }}>Thành viên</Text>
                    </View>
                    <ScrollView>
                        {members.map((member) => {
                            return <TouchableOpacity key={member._id} style={{ flexDirection: "row", backgroundColor: "white" }}
                                onLongPress={() => {
                                    if (user._id.toString() === group.createby) {
                                        setMemberOption(true)
                                        setMemberSelected(member)
                                    }
                                }}
                            >
                                <Image source={{ uri: member.avatarpicture }} style={{ height: 60, width: 60, borderRadius: 30, margin: 10 }} />
                                <View style={{ flex: 1, padding: 10, gap: 10, borderBottomWidth: 0.3, borderBottomColor: "lightgrey", borderBlockColor: "grey" }}>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                        <Text style={{ fontSize: 18, fontWeight: 600 }}>{member.username}</Text>
                                        <Text style={{ color: "orange" }}>{member._id === group.createby ? "Trưởng nhóm" : ""} </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        })}
                    </ScrollView>
                    {memberOption ?
                        <View style={{ position: "absolute", width: "100%", height: "100%" }}>
                            <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                                onPress={() => setMemberOption(false)}
                            ></TouchableOpacity>
                            <View style={{ borderTopWidth: 1, width: "100%", padding: 10, borderColor: "lightgrey", flexDirection: "row", justifyContent: "space-around" }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setConfirm(true)
                                        setConfirmContent("Mời " + memberSelected.username + " làm trưởng nhóm?")
                                    }}>
                                    <Ionicons style={{ alignSelf: "center" }} name='key-outline' color={"gold"} size={30} />
                                    <Text style={{ width: 100, textAlign: "center", fontWeight: 600, fontSize: 15, color: "lightgrey" }}>Chuyển trưởng nhóm</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        setConfirm(true)
                                        setConfirmContent("Mời " + memberSelected.username + " ra khỏi nhóm?")
                                    }}
                                >
                                    <Ionicons style={{ alignSelf: "center" }} name='person-remove-outline' color={"red"} size={30} />
                                    <Text style={{ width: 100, textAlign: "center", fontWeight: 600, fontSize: 15, color: "lightgrey" }}>Mời khỏi nhóm</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        : null}
                </View>
                : null}
            {addMemberView ?
                <View style={{ position: "absolute", alignSelf: "center", backgroundColor: "white", height: "100%", width: "100%", zIndex: 2 }}>
                    <View style={{ width: "100%", backgroundColor: "#227ffd", flexDirection: "row", padding: 10, alignItems: "center" }}>
                        <TouchableOpacity
                            onPress={() => {
                                setAddMemberView(false)
                            }}
                        >
                            <Image source={require("../images/back.png")} style={{ height: 25, width: 25 }} />
                        </TouchableOpacity>
                        <Text style={{ color: "white", margin: 10, fontSize: 17, fontWeight: 600 }}>Thêm thành viên</Text>
                    </View>
                    <ScrollView>
                        {
                            friendList.map((item) => {
                                const checked = selectedItems.includes(item._id.toString());
                                return <View key={item._id} style={{ flexDirection: "row", backgroundColor: "white" }}
                                >
                                    <Image source={{ uri: item.avatarpicture }} style={{ height: 60, width: 60, borderRadius: 30, margin: 10 }} />
                                    <View style={{ flex: 1, padding: 10, gap: 10, borderBottomWidth: 0.3, borderBottomColor: "lightgrey", borderBlockColor: "grey" }}>
                                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                            <Text style={{ fontSize: 18, fontWeight: 600 }}>{item.username}</Text>
                                            <Checkbox
                                                status={checked ? 'checked' : 'unchecked'}
                                                onPress={() => toggleItemSelection(item._id.toString())}
                                            />
                                        </View>
                                    </View>
                                </View>
                            })}
                    </ScrollView>
                    <TouchableOpacity style={{ position: "absolute", right: 30, bottom: 30, backgroundColor: "#227ffd", width: 50, height: 50, borderRadius: 50, alignItems: "center", justifyContent: "center" }}
                        onPress={() => {
                            if (selectedItems.length != 0) {
                                addMember()
                            }
                            else {
                                alert("Hãy chọn thành viên")
                            }
                        }}
                    >
                        <Ionicons name='arrow-forward' size={25} color={"white"} />
                    </TouchableOpacity>
                </View> : null
            }
            <View style={{ alignItems: "center", padding: 15, gap: 15, backgroundColor: 'white' }}>
                <Image source={{ uri: group.grouppicture }} style={{ height: 100, width: 100, backgroundColor: "lightgrey", borderRadius: 50 }} />
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={{ fontWeight: 600, fontSize: 30, margin: 5 }}>{group.groupname}</Text>
                    <TouchableOpacity
                        onPress={() => setRenameView(true)}
                    >
                        <Ionicons name='pencil' size={17} style={{ padding: 5, backgroundColor: "lightgray", borderRadius: 20 }}></Ionicons>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ padding: 15, gap: 20, backgroundColor: 'white', marginTop: 10 }}>
                <TouchableOpacity style={{ flexDirection: "row", gap: 15, alignItems: "center" }}
                    onPress={() => { setAddMemberView(true) }}
                >
                    <Ionicons name='add-circle-outline' size={22}></Ionicons>

                    <Text style={{ fontSize: 17, margin: 5 }}>Thêm thành viên</Text>

                </TouchableOpacity>
                <TouchableOpacity style={{ flexDirection: "row", gap: 15, alignItems: "center" }}
                    onPress={() => { setMemberView(true) }}
                >
                    <Ionicons name='people-outline' size={22}></Ionicons>

                    <Text style={{ fontSize: 17, margin: 5 }}>Xem thành viên</Text>

                </TouchableOpacity>
                <TouchableOpacity style={{ flexDirection: "row", gap: 15, alignItems: "center" }}
                    onPress={() => {
                        setConfirm(true)
                        setConfirmContent("Rời nhóm " + group.groupname)
                    }}
                >
                    <Ionicons name='exit-outline' color={"red"} size={22} ></Ionicons>
                    <Text style={{ fontSize: 17, margin: 5, color: "red" }}>Rời nhóm</Text>
                </TouchableOpacity>
                {group.createby===user._id.toString()?<TouchableOpacity style={{ flexDirection: "row", gap: 15, alignItems: "center" }}
                    onPress={() => {
                        setConfirm(true)
                        setConfirmContent("Giải tán nhóm " + group.groupname)
                    }}
                >
                    <Ionicons name='remove-circle-outline' color={"red"} size={22} ></Ionicons>
                    <Text style={{ fontSize: 17, margin: 5, color: "red" }}>Giải tán nhóm</Text>
                </TouchableOpacity>:null}
            </View>
        </View>
    );
}
const styles = StyleSheet.create({

});